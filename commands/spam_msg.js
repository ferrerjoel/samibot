const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { generateDependencyReport, getVoiceConnection, AudioPlayerStatus, entersState, joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('spam_msg')
		.setDescription('Spams a msg')
		.addIntegerOption(option => option.setName('iterations')
			.setDescription('Number of iterations')
			.setRequired(true)
			.setMinValue(1)
			.setMaxValue(100))
		.addStringOption(option => option.setName('message')
			.setDescription('Message to send')
			.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		await interaction.reply({content: 'Deploying...', ephemeral: true});
		for (let i = 0; i < interaction.options.getInteger('iterations'); i++){
			interaction.channel.send(interaction.options.getString('message'));
		}
		
	},
};