const { SlashCommandBuilder, PermissionsBitField, time } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('teams')
		.setDescription('Make teams of your VC!')
		.addIntegerOption(option => option.setName('teams')
			.setDescription('Number of teams do you want to make')
			.setRequired(true)
			.setMinValue(2)
			.setMaxValue(10))
		.addBooleanOption(option => option.setName('voice')
			.setDescription('Do you want to make voice channels?')
			.setRequired(false)),
	async execute(interaction) {
		// In recent apis the bot has 3 seconds to respond, in case the bots needs more time, the bot can say this and then edit the message
		await interaction.reply('Making the most balanced teams you have ever seen...');
		let userVoiceChannel = interaction.member.voice.channelId;
		// If the user is not connected
		if (userVoiceChannel == null){
			interaction.reply({content: 'The user is not in a VC!', ephemeral: true});
			return;
		}
		let serverMembers = interaction.guild.members.cache.map(member => member);

		let teamsToCreate = interaction.options.getInteger('teams');
		let voice = interaction.options.getBoolean('voice');
		// Filter the users that are on the VC of the user that invoked the command
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

		await interaction.editReply({ content: await printTeams(teams, voice, interaction)});
		printTeams(teams);
		
	},
};

async function printTeams(teams, voice, interaction){
	let messageTeams = "";
	let channel;
	for (let i = 0; i < teams.length; i++){
		messageTeams += "**Team "+(i+1)+":**\n----------------\n";
		if (voice){
			channel = await createChannel(interaction, "Team " + (i+1))
		} 
		for (let j = 0; j < teams[i].length; j++){
			messageTeams += teams[i][j][0].user.username + "\n";
			if (voice) teams[i][j][0].voice.setChannel(channel);
		}
	}
	return messageTeams;
}

async function createChannel(interaction, name){
	let channel = await interaction.guild.channels.create({
		name: name,
		type: 2, //GUILD_VOICE
		permissionOverwrites: [
			{
				id: interaction.user.id,
				deny: [PermissionsBitField.Flags.ViewChannel],
			},
		],
	})
	// let timeout = setTimeout(function () {
	// 	console.log(channel);
	// 	channel.delete();
	// }, 3000);
	// interaction.client.on("voiceStateUpdate", (oldState, newState) => {
	// 	clearTimeout(timeout);
	// 	console.log("AJA");
	// })
	return channel;
}