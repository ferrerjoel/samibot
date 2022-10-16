const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const rick = createAudioResource('C:/Users/Joel/OneDrive/Escriptori/Weas/Sam Project/Sam/commands/rick.mp3');
const player = createAudioPlayer();
module.exports = {
	data: new SlashCommandBuilder()
		.setName('rick')
		.setDescription('Rick rol'),
	async execute(interaction) {
		console.log(interaction.channelId);
		const connection = joinVoiceChannel({
			channelId: '848112953723060244',
			guildId: interaction.channel.guildId,
			adapterCreator: interaction.channel.guild.voiceAdapterCreator,
		});
		
		player.play(rick);
		connection.subscribe(player);
		
	},
};