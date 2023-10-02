const { SlashCommandBuilder } = require('discord.js');
const { player } = require("./play")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Pauses or resumes the current audio'),
  async execute(interaction) {



    interaction.reply({ content: 'Volume set!', ephemeral: true});
  },
};
