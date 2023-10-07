const { SlashCommandBuilder } = require('discord.js');
const { player, connection } = require("./join")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Disconnects the bot from VC'),
  async execute(interaction) {

    connection.destroy();

    interaction.reply({ content: 'Disconnected!', ephemeral: true});
  },
};
