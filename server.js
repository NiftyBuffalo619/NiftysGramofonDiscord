const { Client, Events, Collection , GatewayIntentBits, IntentsBitField , REST , Routes , ActivityType} = require('discord.js');
const dotenv = require('dotenv').config();
const token = process.env.token;
const fs = require('node:fs');
const { createReadStream } = require('node:fs');
const path = require('path');
const { join } = require('node:path');
const { createSpinner } = require('nanospinner');
var colors = require('colors');
const { joinVoiceChannel, getVoiceConnections , createAudioPlayer, NoSubscriberBehavior, createAudioResource , AudioPlayerStatus , StreamType} = require('@discordjs/voice');
const { time } = require('node:console');


//const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const client = new Client({ intents: [
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMembers,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.MessageContent,
	IntentsBitField.Flags.GuildVoiceStates,
	IntentsBitField.Flags.GuildEmojisAndStickers,
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
			console.log(`[Warning] Missing data properties for ${command?.name}`.yellow);
		}
	}
}
spinner.success(`Commands have loaded sucessfully!`.green);

let status = [
	{
		name: `Nifty's Discord`,
		type: ActivityType.Watching,
	},
	{
		name: `to Music`,
		type: ActivityType.Listening,
	}
]
client.once(Events.ClientReady, c => {
	console.log(`Successfully started`.green + `✔`);
	console.log(`Logged in as ${c.user.tag}`.green);
	client.user.setActivity({
		name: `Nifty's Discord`,
		type: ActivityType.Watching,
	});
	const notify = require("./notifications/notify");
	notify.notifyStartup();

	setInterval(() => {
		let random = Math.floor(Math.random() * status.length);
		client.user.setActivity(status[random]);
	}, 10000);
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

	if (interaction.isChatInputCommand()) {
		if (interaction.commandName === 'playnokiaarabic') {
			const voicechannel = interaction.options.getChannel('channel');
			const connection = joinVoiceChannel({
				channelId: voicechannel.id,
				guildId: interaction.guildId,
				adapterCreator: interaction.guild.voiceAdapterCreator,
			});
			//console.log(`Joined channel ${voicechannel.id} guild id: ${interaction.guildId}`.cyan);
			const time = new Date();
			let hours = time.getHours();
			let minutes = time.getMinutes();
			let seconds = time.getSeconds();
			console.log(`[Server][${hours}:${minutes}:${seconds}] Joined channel`.cyan + ` ${voicechannel.name}`.white);
			console.log(`[Server][${hours}:${minutes}:${seconds}] Preparing to play voice...`.cyan);
			const player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Play,
				}
			});

			player.on(AudioPlayerStatus.Playing, () => {
				console.log(`[Server][${hours}:${minutes}:${seconds}] The audio player has started playing!`.cyan);
			});

			player.on('error', (err) => {
				console.log(`[Server][${hours}:${minutes}:${seconds}] An error occured: ${err}`.red);
			});
			
			//let resource = createAudioResource(join(__dirname, 'music/nokiaarabic.mp3'));
			var soundname = "";
			switch (interaction.options.get('category').value) {
				case 1, '1':
					soundname = "music/nokiaarabic.ogg";
				break;
				case 2, '2':
					soundname = "music/nokiaarabic2.ogg";
				break;
				default:
					soundname = "music/nokiaarabic.ogg";
				break;
			}
			resource = createAudioResource(join(__dirname, soundname));
			resource = createAudioResource(join(__dirname, soundname), { inlineVolume: true });
			resource.volume.setVolume(1);

	
			resource = createAudioResource(createReadStream(join(__dirname, soundname), {
				inputType: StreamType.OggOpus,
			}));

			player.play(resource);

			
			const subscription = connection.subscribe(player);
			
		    //https://discordjs.guide/voice/audio-player.html#creation
		}
	}
});

const Server = require('./server/server');
const server = new Server();
server.listen(80);
client.login(token);
//module.exports = client;