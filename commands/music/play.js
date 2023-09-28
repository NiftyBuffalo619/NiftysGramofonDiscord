const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel, getVoiceConnections , createAudioPlayer, NoSubscriberBehavior, createAudioResource , AudioPlayerStatus , StreamType} = require('@discordjs/voice');
const { createReadStream } = require('node:fs');
const client = require('../../server');
var colors = require('colors');
const ytdl = require('ytdl-core');
const play = require('play-dl');
const helper = require('../../helper/helper');

const queue = new Map();



module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
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
        ),

    async execute(interaction , client) {
        const time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();
        const voicechannel = interaction.options.getChannel('channel');
        const query = interaction.options.get('music').value;
        console.log(`[Server][${hours}:${minutes}:${seconds}] Joining ${voicechannel.name}`.cyan);
        const connection = joinVoiceChannel({
			channelId: voicechannel.id,
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
        var yt_info = await play.search(query, { limit: 1});
        var stream = await play.stream(yt_info[0].url);
        helper.UpdatePlayingState(yt_info[0].title, yt_info[0].url, yt_info[0].channel, `Youtube video description: ${yt_info[0].description}`);
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            }
        });
        player.on(AudioPlayerStatus.Playing, () => {
            interaction.reply(`Started playing`);
            console.log(`[Server][${hours}:${minutes}:${seconds}] AudioPlayer has started playing from`.cyan + ` Youtube`.red + `!`.cyan);
        });
        player.on('error', (err) => {
            console.log(`[Server][${hours}:${minutes}:${seconds}] An error occured: ${err}`.red);
        });
        var resource = createAudioResource(stream.stream , { inputType: stream.type });
        connection.subscribe(player);
        player.play(resource);
    },
    
}