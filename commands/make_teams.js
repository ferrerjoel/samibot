const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('teams')
		.setDescription('Make teams of your VC!')
		.addIntegerOption(option => option.setName('teams')
				.setDescription('Number of teams do you want to make')
				.setRequired(true)
				.setMinValue(2)
				.setMaxValue(10)),
	async execute(interaction) {
		let userVoiceChannel = interaction.member.voice.channelId;
		let serverMembers = interaction.guild.members.cache.map(member => member);

		let teamsToCreate = interaction.options.getInteger('teams');

		serverMembers = serverMembers.filter(e => e.voice.channelId == userVoiceChannel);
		let numberOfPlayers = serverMembers.length;

		const teams = [];

		for (let i = 0; i < teamsToCreate; i++) {
			for(let j = 0; j < teamsToCreate; j++) {
				teams[i] = [];
			}
		}
		let team = 0;
		let position = 0;
		while (serverMembers.length > 0){
			teams[team][position] = serverMembers.splice(Math.floor(Math.random()*serverMembers.length), 1);
			if (team == teamsToCreate-1){
				team = -1;
				position++;
			} 
			team++;
			
		}

		await interaction.reply({ content: printTeams(teams)});
		console.log(printTeams(teams));
		
		// if (true){
		// 	interaction.guild.channels.create({
		// 		name: 'HOLA',
		// 		type: 2, //GUILD_VOICE
		// 		permissionOverwrites: [
		// 		   {
		// 			 id: interaction.user.id,
		// 			 deny: [PermissionsBitField.Flags.ViewChannel],
		// 		  },
		// 		],
		// 	  })
		// }
	},
};

function printTeams(teams){
	let messageTeams = "";
	for (let i = 0; i < teams.length; i++){
		messageTeams += "**Team "+(i+1)+":**\n----------------\n";
		for (let j = 0; j < teams[i].length; j++){
			messageTeams += teams[i][j][0].user.username + "\n";
		}
	}
	return messageTeams;
}