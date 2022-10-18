const { SlashCommandBuilder } = require('discord.js');
const { generateDependencyReport, getVoiceConnection, AudioPlayerStatus, entersState, joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('rick')
		.setDescription('Rick rol'),
	async execute(interaction) {

		const voiceConnection = joinVoiceChannel({
			channelId: interaction.member.voice.channelId,
			guildId: interaction.channel.guildId,
			adapterCreator: interaction.channel.guild.voiceAdapterCreator,
			selfDeaf: false
		});

		const connection = getVoiceConnection(interaction.guildId);
		const player = createAudioPlayer();
		const resource = createAudioResource('./audio/rick.ogg');

		try {

			await entersState(voiceConnection, VoiceConnectionStatus.Ready, 5000);
			
			console.log("Connected");
			
		} catch (error) {
			
			console.log("Voice Connection not ready within 5s.", error);
			
			return null;
			
		}
		
		connection.subscribe(player);
		player.play(resource);
		
	},
};