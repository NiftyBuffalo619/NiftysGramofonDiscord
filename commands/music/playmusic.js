const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel, getVoiceConnections , createAudioPlayer, NoSubscriberBehavior, createAudioResource , AudioPlayerStatus , StreamType} = require('@discordjs/voice');
const { default: PlayDL } = require('play-dl');
const { createReadStream } = require('node:fs');
const { join } = require('node:path');
var colors = require('colors');
const APP_PATH = require('../../static');
const axios = require('axios');

const queue = new Map();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('playmusic')
    .setDescription('Plays music')
    
    .addChannelOption((option) => 
        option.setName('channel')
            .setDescription('The name of the channel you wish to play song to')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice))
        .addStringOption((option2) => 
        option2.setName('music')
            .setDescription('The name of music you want to play')
            .setRequired(true)
            .addChoices(
                { name: 'Le Gendarme de Saint-Tropez', value: "1"},
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
        switch (interaction.options.get('music').value) {
            case "1":
                 resource = createAudioResource(join(APP_PATH , "music/le_gendarme_de_saint_tropez.mp3"));
                 new Promise((resolve, reject) => {
                    axios.post(`http://localhost/api/addsong`, null,
                    {
                        auth: {
                            username: process.env.usernameDB,
                            password: process.env.passwordDB,
                        },
                        params: {
                            name: "Le gendarme de Saint Tropez",
                            iconUrl: "Icon Url",
                            artist: "Artist",
                            description: "Description",
                        }
                    })
                    .catch(error => {
                        console.log(`Error ${error.stack}`);
                        resolve();
                     });
                 });
            break;
            default:
                resource = createAudioResource(join(APP_PATH, "../music/le_gendarme_de_saint_tropez.mp3"));
            break;
        }
        player.play(resource);
        await interaction.reply(`Playing sound...`);
    },
}