const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits, Intents } = require('discord.js');
const { token } = require('./config.json');
const makeRequest = require('./chatgpt');

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

const MAX_INPUT_TOKENS_CHATGPT = 250

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}
// When the client is ready, run this code (only once)
client.once('ready', () => {
	client.user.setActivity('Hollow Knight: Silksong');
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

client.on('messageCreate', async message => {

	if (message.author.bot) return;

	if (message.mentions.has(client.user.id)) {
		if (message.content.length >= MAX_INPUT_TOKENS_CHATGPT) {
			message.reply(`Mensaje del administrador: reduce el mensaje a ${MAX_INPUT_TOKENS_CHATGPT} caracteres, no estoy hecho de oro`);
			return;
		} 
		message.reply(await makeRequest(message.content.replace(client.user.id, ""), MAX_INPUT_TOKENS_CHATGPT));
	} else if (message.content.length >= 50 ) {
		makeFun(message);
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

function makeFun(message) {
	const randomChance = Math.floor(Math.random() * 20) + 1;

	if (randomChance === 1) {
		const modifiedMessage = message.content.replace(/[aeiou]/gi, 'i');

		message.reply(randomizeCase(modifiedMessage));
	} 
}

client.login(token);

