// const fs = require('node:fs');
// const path = require('node:path');
// // Require the necessary discord.js classes
// const { Client, Collection, GatewayIntentBits, Intents } = require('discord.js');
// const { token } = require('./config.json');


// // Create a new client instance
// const client = new Client({
// 	intents: [
// 		GatewayIntentBits.Guilds,
// 		GatewayIntentBits.GuildMessages,
// 		GatewayIntentBits.MessageContent,
// 		GatewayIntentBits.GuildMembers,
// 		GatewayIntentBits.GuildVoiceStates,
// 		GatewayIntentBits.GuildPresences
// 	],
// });

// client.commands = new Collection();

// const commandsPath = path.join(__dirname, 'commands');
// const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// for (const file of commandFiles) {
// 	const filePath = path.join(commandsPath, file);
// 	const command = require(filePath);
// 	// Set a new item in the Collection
// 	// With the key as the command name and the value as the exported module
// 	client.commands.set(command.data.name, command);
// }
// // When the client is ready, run this code (only once)
// client.once('ready', () => {
// 	console.log('Samibot has deployed >:)');
// });

// client.on('interactionCreate', interaction => {
// 	console.log(`Wa, ${interaction.user.username} with id ${interaction.user.id} used a command!`);
// });

// client.on('interactionCreate', async interaction => {
// 	const command = client.commands.get(interaction.commandName);

// 	if (!command) return;

// 	try {
// 		await command.execute(interaction);
// 	} catch (error) {
// 		console.error(error);
// 		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
// 	}
// });

// // Login to Discord with your client's token
// client.login(token);

const nacl = require('tweetnacl');

exports.handler = async (event) => {
	console.log(event);
	// Checking signature (requirement 1.)
	// Your public key can be found on your application in the Developer Portal
	const PUBLIC_KEY = process.env.PUBLIC_KEY;
	const signature = event.headers['x-signature-ed25519']
	const timestamp = event.headers['x-signature-timestamp'];
	const strBody = event.body; // should be string, for successful sign

	const isVerified = nacl.sign.detached.verify(
		Buffer.from(timestamp + strBody),
		Buffer.from(signature, 'hex'),
		Buffer.from(PUBLIC_KEY, 'hex')
	);

	if (!isVerified) {
		return {
			statusCode: 401,
			body: JSON.stringify('invalid request signature'),
		};
	}

	// Replying to ping (requirement 2.)
	const body = JSON.parse(strBody)
	if (body.type == 1) {
		return {
			statusCode: 200,
			body: JSON.stringify({ "type": 1 }),
		}
	}

	// Handle /foo Command
	if (body.data.name == 'ping') {
		return JSON.stringify({  // Note the absence of statusCode
			"type": 4,  // This type stands for answer with invocation shown
			"data": { "content": "bar" }
		})
	}

	return {
		statusCode: 404  // If no handler implemented for Discord's request
	}
};
