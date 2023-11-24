const { SlashCommandBuilder } = require('discord.js');
const {
  getVoiceConnection,
  entersState,
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  StreamType,
  AudioPlayerStatus,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Pauses or resumes the current audio')
    .addIntegerOption(option => option.setName('volume')
      .setDescription('Number of volume')),
  async execute(interaction) {

    const connection = getVoiceConnection(interaction.guildId);

    const player = connection.state.subscription?.player;
    if (player) {
      const currentResource = player.state.resource;
      const isPlaying = player.state.status === AudioPlayerStatus.Playing;
      const volumeValue = interaction.options.getInteger('volume') || 1;
      currentResource.volume.setVolume(volumeValue);
    }

    interaction.reply({ content: 'Volume set!', ephemeral: true});
  },
};
