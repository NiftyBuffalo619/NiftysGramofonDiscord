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
        switch (interaction.options.get('radio').value) {
            case "1":
                new Promise((resolve, reject) => {
                    axios.post(`http://localhost/api/addsong`, null,
                    {
                        auth: {
                            username: process.env.usernameDB,
                            password: process.env.passwordDB,
                        },
                        params: {
                            name: "Radio Impuls",
                            iconUrl: "https://api.play.cz/static/radio_logo/t200/impuls.png",
                            artist: "",
                            description: "",
                        }
                    })
                    .catch(error => {
                        console.log(`Error ${error.stack}`);
                        resolve();
                     });
                 });
                 resource = createAudioResource('https://icecast5.play.cz/impuls128.mp3?1571059741');
            break;
            case "2":
                new Promise((resolve, reject) => {
                    axios.post(`http://localhost/api/addsong`, null,
                    {
                        auth: {
                            username: process.env.usernameDB,
                            password: process.env.passwordDB,
                        },
                        params: {
                            name: "Radio Blanik",
                            iconUrl: "",
                            artist: "",
                            description: "",
                        }
                    })
                    .catch(error => {
                        console.log(`Error ${error.stack}`);
                        resolve();
                     });
                 });
                resource = createAudioResource('http://ice.abradio.cz/blanikfm128.mp3');
            break;
            case "3":
                new Promise((resolve, reject) => {
                    axios.post(`http://localhost/api/addsong`, null,
                    {
                        auth: {
                            username: process.env.usernameDB,
                            password: process.env.passwordDB,
                        },
                        params: {
                            name: "Evropa 2",
                            iconUrl: "",
                            artist: "",
                            description: "",
                        }
                    })
                    .catch(error => {
                        console.log(`Error ${error.stack}`);
                        resolve();
                     });
                 });
                resource = createAudioResource('https://ice.actve.net/fm-evropa2-128');
            break;
            case "4":
                new Promise((resolve, reject) => {
                    axios.post(`http://localhost/api/addsong`, null,
                    {
                        auth: {
                            username: process.env.usernameDB,
                            password: process.env.passwordDB,
                        },
                        params: {
                            name: "OE 3",
                            iconUrl: "",
                            artist: "",
                            description: "",
                        }
                    })
                    .catch(error => {
                        console.log(`Error ${error.stack}`);
                        resolve();
                     });
                 });
                resource = createAudioResource('http://orf-live.ors-shoutcast.at/oe3-q2a');
            break;
            default:
                new Promise((resolve, reject) => {
                    axios.post(`http://localhost/api/addsong`, null,
                    {
                        auth: {
                            username: process.env.usernameDB,
                            password: process.env.passwordDB,
                        },
                        params: {
                            name: "Radio",
                            iconUrl: "",
                            artist: "",
                            description: "",
                        }
                    })
                    .catch(error => {
                        console.log(`Error ${error.stack}`);
                        resolve();
                     });
                 });
                resource = createAudioResource('https://icecast5.play.cz/impuls128.mp3?1571059741');
            break;
        }
        player.play(resource);
        await interaction.reply(`Playing radio 📡...`);
    },
}