const { SlashCommandBuilder } = require('discord.js');
const { readFileSync, promises: fsPromises} = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rick_names')
		.setDescription('Changes all the nicknames of the disconnected users for a line of Never Gonna Give You Up'),
	async execute(interaction) {
		await interaction.guild.members.fetch() // fetch all members and cache them
		await interaction.reply({ content: 'You are CRAZY! This may take a while...', ephemeral: true });

		var Members = interaction.guild.members.cache.map(member => member); // Getting the members and mapping them by ID.
		Members = Members.filter(e => e.id !== '391982520729600002'); // will return ['A', 'C', 'F'] //315843334201671690
		Members = Members.filter(e => e.presence == null); // will return ['A', 'C', 'F']

		var rick_lines = syncReadFile('./text_sources/rick_names.txt');

		//var rick_allowed_users = Math.min(rick_lines.length, Members.length)
		
		for (var i = 0; i < rick_lines.length; i++){
			if (rick_lines[i].length > 29) rick_lines[i] = String(rick_lines[i]).substring(0,29);
			// We have to add a char in order to see the song in order
			try {
				if (i < Members.length) await interaction.guild.members.cache.get(Members[i].user.id).setNickname(intToChar(i) + '|' + rick_lines[i]);
			} catch (e) {
				console.error(`Handled error: ${e}`)
			}
			
		}

	}

};

function syncReadFile(filename) {
	const contents = readFileSync(filename, 'utf-8');
  
	const arr = contents.split(/\r?\n/);
  
	return arr;
}

function intToChar(int) {
	// 👇️ for Uppercase letters, replace `a` with `A`
	const code = 'a'.charCodeAt(0);
	return String.fromCharCode(code + int);
  }