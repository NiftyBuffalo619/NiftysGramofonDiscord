const { Client, Events, Collection , GatewayIntentBits, IntentsBitField , REST , Routes } = require('discord.js');
const dotenv = require('dotenv').config();
const token = process.env.token;
const fs = require('node:fs');
const path = require('path');
const { createSpinner } = require('nanospinner');
var colors = require('colors');

//const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const client = new Client({ intents: [
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMembers,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.MessageContent,
] });

client.commands = new Collection();
const foldersPath = path.join(__dirname , 'commands');
const commandFolders = fs.readdirSync(foldersPath);
const commands = [];


console.log('Starting...'.green);
console.log('Loading commands...');
const spinner = createSpinner(`Loading commands...`.green).start();
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath , folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath , file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name , command);
			commands.push(command.data.toJSON());
		}
		else {
			console.log(`[Warning]`.yellow);
		}
	}
}
spinner.success(`Commands have loaded sucessfully!`.green);

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});


const rest = new REST({ version: '10'}).setToken(process.env.token);
(async () => {
	console.log(`Started refreshing (/) commands...`.cyan);
	try {
		await rest.put(
			Routes.applicationGuildCommands(process.env.client_id , process.env.guild_id),
			{body: commands}
		)
	}
	catch (err) {
		console.log(`[Error] There was an error ${err}`.red);
	}
	console.log(`Successfully refreshed (/) commands`.green);
})();

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


client.login(token);