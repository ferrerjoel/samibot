const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('change_nicks')
		.setDescription('Changes all the nicknames of all users, if not specified, removes them')
		.addStringOption(option =>option.setName('name')
				.setDescription('This is going to be the new nickname for all users')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
	async execute(interaction) {
		await interaction.guild.members.fetch() // fetch all members and cache them
		await interaction.reply({ content: 'You are CRAZY! This may take a while...', ephemeral: true });

		// const excludedIds = ['391982520729600002', '315843334201671690'];

		var Members = interaction.guild.members.cache.map(member => member.id); // Getting the members and mapping them by ID.
		Members = Members.filter(memberId => memberId !== interaction.guild.ownerId); // will return ['A', 'C', 'F'] //315843334201671690

		var newName = interaction.options.getString('name'); // We save the new name, if null, the command is going to remove all nicknames
		Members.forEach(element => {
			try {
				interaction.guild.members.cache.get(element).setNickname(newName);
			} catch (e) {
				console.error(`Handled error: ${e}`)
			}
		});
	}
};