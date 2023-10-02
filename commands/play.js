const { SlashCommandBuilder } = require('discord.js');
const {
  getVoiceConnection,
  entersState,
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  StreamType
} = require('@discordjs/voice');
const axios = require('axios');
const player = createAudioPlayer();
module.exports = {
  player,
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays an online audio')
    .addStringOption(option =>option.setName('url')
        .setDescription('URL of the file to play')
        .setRequired(true)),
  async execute(interaction) {
    const voiceChannelId = interaction.member.voice.channelId;

    if (!voiceChannelId) {
      return interaction.reply('You need to be in a voice channel to use this command.');
    }

    const voiceConnection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: interaction.guildId,
      adapterCreator: interaction.channel.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    const connection = getVoiceConnection(interaction.guildId);
    const player = createAudioPlayer();

    try {
      await entersState(voiceConnection, VoiceConnectionStatus.Ready, 5000);
      console.log(`Connected to voice channel ${voiceChannelId} on guild ${interaction.guildId}`);
    } catch (error) {
      console.error("Voice Connection not ready within 5s.", error);
      return interaction.reply({content: 'Unable to connect to the voice channel.', ephemeral: true});
    }

    // Replace 'YOUR_MP3_URL' with the actual URL of the MP3 file
    const mp3Url = interaction.options.getString('url');

    // Use axios to get the MP3 file from the URL
    try {
      const response = await axios.get(mp3Url, { responseType: 'stream' });
      const stream = response.data;

      // Create an AudioResourceStream from the streamed data
      const resource = createAudioResource(stream, {
        inlineVolume: true,
        inputType: StreamType.WebmOpus, // Use inputType 1 for Opus-based audio (typically used in voice channels)
      });
      resource.volume.setVolume(1);

      // Play the audio
      player.play(resource);
    } catch (error) {
      console.error("Error streaming and playing the MP3:", error);
      return interaction.reply({ content: 'An error occurred while processing the audio.', ephemeral: true});
    }

    connection.subscribe(player);

    interaction.reply({ content: 'Now playing the online audio.', ephemeral: true});
  },
};
