const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const prism = require("prism-media");
const { exec } = require('child_process');
const {
  getVoiceConnection,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  StreamType,
} = require("@discordjs/voice");
const Silence = require('../silence');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("record")
    .setDescription("Records the audio on the VC!")
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription("Time the bot is going to stay in seconds")
    ),
  async execute(interaction) {
    const voiceChannelId = interaction.member.voice.channelId;

    if (!voiceChannelId) {
      return interaction.reply(
        "You need to be in a voice channel to use this command."
      );
    }

    const voiceConnection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: interaction.guildId,
      adapterCreator: interaction.channel.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    const connection = getVoiceConnection(interaction.guildId);

    try {
      await entersState(voiceConnection, VoiceConnectionStatus.Ready, 5000);
      console.log(
        `Connected to voice channel ${voiceChannelId} on guild ${interaction.guildId}`
      );
    } catch (error) {
      console.error("Voice Connection not ready within 5s.", error);
      return interaction.reply({
        content: "Unable to connect to the voice channel.",
        ephemeral: true,
      });
    }

    const player = createAudioPlayer();

    const silenceStream = new Silence();
    const audioResource = createAudioResource(silenceStream, {
      inputType: StreamType.Raw,
    });

    player.play(audioResource);

    // Subscribe the player to the connection
    connection.subscribe(player);
  
    const writeStream = fs.createWriteStream('out.pcm');
    const listenStream = connection.receiver.subscribe(interaction.member);

    const opusDecoder = new prism.opus.Decoder({
        frameSize: 960,
        channels: 2,
        rate: 48000,
    });

    listenStream.pipe(opusDecoder).pipe(writeStream);

    listenStream.on("data", (data) => {
      console.log(`Received audio data: ${data.length} bytes`);
    });

    // setTimeout(() => {
    //   writeStream.end(); // End the writeStream to trigger the "finish" event
    // }, 50000);

    interaction.reply({ content: `Joined! :)`, ephemeral: true });
  },
};

