const { SlashCommandBuilder } = require('discord.js');
const { player } = require("./play")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses or resumes the current audio'),
  async execute(interaction) {

    player.pause();

    interaction.reply({ content: 'Audio paused!', ephemeral: true});
  },
};
