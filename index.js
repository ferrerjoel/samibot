const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits, Intents } = require('discord.js');
const { token } = require('./config.json');
const { chatgpt } = require('chatgpt.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences
	],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}
// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Samibot has deployed >:)');
});

client.on('interactionCreate', interaction => {
	console.log(`Wa, ${interaction.user.username} with id ${interaction.user.id} used a command!`);
});

client.on('interactionCreate', async interaction => {
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageCreate', message => {

	if (message.content.length <= 50 || message.author.bot) return;

	const randomChance = Math.floor(Math.random() * 20) + 1;

	if (randomChance === 1) {
		const modifiedMessage = message.content.replace(/[aeiou]/gi, 'i');

		message.reply(randomizeCase(modifiedMessage));
	} else {

	}

});

function randomizeCase(inputString) {
	let randomizedString = '';
	for (let i = 0; i < inputString.length; i++) {
		if (Math.random() < 0.5) {
			randomizedString += inputString[i].toUpperCase();
		} else {
			randomizedString += inputString[i].toLowerCase();
		}
	}
	return randomizedString;
}

client.login(token);

