const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel, getVoiceConnections , createAudioPlayer, NoSubscriberBehavior, createAudioResource , AudioPlayerStatus , StreamType} = require('@discordjs/voice');
const { default: PlayDL } = require('play-dl');
const { createReadStream } = require('node:fs');
var colors = require('colors');
const axios = require('axios');
const base64 = require('base-64');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const queue = new Map();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('playradio')
    .setDescription('Plays radio')
    
    .addChannelOption((option) => 
        option.setName('channel')
            .setDescription('The name of the channel you wish to play song to')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice))
        .addStringOption((option2) => 
        option2.setName('radio')
            .setDescription('The name of radio you want to play')
            .setRequired(true)
            .addChoices(
                { name: 'Radio Impuls', value: "1"},
                { name: 'Radio Blanik', value: "2"},
                { name: 'Evropa 2', value: "3"},
                { name: 'OE3', value: "4"},
            )
        ),
    async execute(interaction , client) {
        const voicechannel = interaction.options.getChannel('channel');
        const time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();

        console.log(`[Server][${hours}:${minutes}:${seconds}] Joining ${voicechannel.name}`.cyan);
		const connection = joinVoiceChannel({
			channelId: voicechannel.id,
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            }
        });

        player.on(AudioPlayerStatus.Playing, () => {
            console.log(`[Server][${hours}:${minutes}:${seconds}] Radio has started playing!`.cyan);
        });

        player.on('error', (err) => {
            console.log(`[Server][${hours}:${minutes}:${seconds}] An error occured: ${err}`.red);
        });
        connection.subscribe(player);
        var resource;
        const soundObject = require('../../server/server');
        const username = process.env.usernameDB;
        const password = process.env.passwordDB;
        const AuthHeader = 'Basic ' + base64.encode(`${username}:${password}`);
        console.log(`${username}:${password}`);
        switch (interaction.options.get('radio').value) {
            case "1":
                new Promise((resolve, reject) => {
                    axios.post('localhost/api/addsong', {
                        auth: {
                            username:  base64.encode(username),
                            password:  base64.encode(password),
                        },
                        params: {
                            iconUrl: "https://api.play.cz/static/radio_logo/t200/impuls.png",
                            name: "Radio Impuls",
                            artist: "",
                            description: ""
                        },
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }).catch(error => {
                        resolve([]);
                    }).then(response => {
                        console.log(`[Server][${hours}:${minutes}:${seconds}]: Successfully added song into the server`);
                    });
                });
                 resource = createAudioResource('https://icecast5.play.cz/impuls128.mp3?1571059741');
            break;
            case "2":
                resource = createAudioResource('http://ice.abradio.cz/blanikfm128.mp3');
            break;
            case "3":
                resource = createAudioResource('https://ice.actve.net/fm-evropa2-128');
            break;
            case "4":
                resource = createAudioResource('http://orf-live.ors-shoutcast.at/oe3-q2a');
            break;
            default:
                resource = createAudioResource('https://icecast5.play.cz/impuls128.mp3?1571059741');
            break;
        }
        player.play(resource);
        await interaction.reply(`Playing radio 📡...`);
    },
}