const { SlashCommandBuilder, PermissionsBitField, time } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mutevc')
		.setDescription('Mutes all people on the current VC!')
		.addBooleanOption(option => option.setName('unmute')
			.setDescription('Do you want to unmute all people?')
			.setRequired(false))
		.addRoleOption(option => option.setName('exclude')
			.setDescription('What role do you want to exclude?')
			.setRequired(false)),
	async execute(interaction) {
		
		let userVoiceChannel = interaction.member.voice.channelId;
		// If the user is not connected
		if (userVoiceChannel == null){
			interaction.reply({content: 'The user is not in a VC!', ephemeral: true});
			return;
		}
		let setUnmute = !interaction.options.getBoolean('unmute');
		let roleToExclude = interaction.options.getRole('exclude');
		let serverMembers = interaction.guild.members.cache.map(member => member);

		let teamsToCreate = interaction.options.getInteger('teams');
		let voice = interaction.options.getBoolean('voice');
		// Filter the users that are on the VC of the user that invoked the command
		serverMembers = serverMembers.filter(e => e.voice.channelId == userVoiceChannel);
		if (roleToExclude != null){
			serverMembers = serverMembers.filter(e => !e.roles.cache.has(roleToExclude.id));
		}
		serverMembers.forEach(element => {
			element.voice.setMute(setUnmute);
		});
		await interaction.reply({content: 'Done!', ephemeral: true});
		
	},
};