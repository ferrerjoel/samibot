const { SlashCommandBuilder } = require('discord.js');
const {
  getVoiceConnection,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Disconnects the bot from VC'),
  async execute(interaction) {

    const connection = getVoiceConnection(interaction.guildId);

    connection.destroy();

    interaction.reply({ content: 'Disconnected!', ephemeral: true});
  },
};
