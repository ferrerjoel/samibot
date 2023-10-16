const { SlashCommandBuilder } = require("discord.js");
const {
  getVoiceConnection,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins a VC"),
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

    interaction.reply({ content: `Joined! :)`, ephemeral: true });
  },
};

