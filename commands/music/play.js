const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel, getVoiceConnections , createAudioPlayer, NoSubscriberBehavior, createAudioResource , AudioPlayerStatus , StreamType} = require('@discordjs/voice');
const { createReadStream } = require('node:fs');
const client = require('../../server');
var colors = require('colors');
const ytdl = require('ytdl-core');
const play = require('play-dl');
const helper = require('../../helper/helper');
const notify = require("../../notifications/notify");

const queue = new Map();



var AUDIOPLAYER;
class PlayerAudio {
    constructor(PlayerAudio) {
        this.PlayerAudio = PlayerAudio;
    }
    
    stop() {
        if (this.PlayerAudio !== null) {
            console.log("Error AudioPlayer cannot be null");
        }
        this.PlayerAudio.stop();
    }
    pause() {
        if (this.PlayerAudio !== null) {
            console.log("Error cannot be null");
        }
        this.PlayerAudio.pause();
    }
}
module.exports = {
    initializeAudioPlayer: (player) => {
        AUDIOPLAYER = player;
        return player;
    },
    getAudioPlayer: () => {
        return AUDIOPLAYER;
    },
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
        await interaction.deferReply();
        var yt_info = await play.search(query, { limit: 1});
        var stream = await play.stream(yt_info[0].url);
        helper.UpdatePlayingState(yt_info[0].title, yt_info[0].url, yt_info[0].channel, `Youtube video description: ${yt_info[0].description}`, yt_info[0].durationInSec, 0);
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            }
        });
        await player.on(AudioPlayerStatus.Playing, () => {
            console.log(`[Server][${hours}:${minutes}:${seconds}] Playing`.cyan + ` ${yt_info[0].title}`.white + ` Url: ${yt_info[0].url}`);
            console.log(`[Server][${hours}:${minutes}:${seconds}] AudioPlayer has started playing from`.cyan + ` Youtube`.red + `!`.cyan);
        });
        await player.on(AudioPlayerStatus.Idle, () => {
                console.log(`[Server][${hours}:${minutes}:${seconds}] Stopping`.red + ` ${yt_info[0].title}`.white + ` Url: ${yt_info[0].url}`.white);
                console.log(`[Server][${hours}:${minutes}:${seconds}] AudioPlayer has been stopped`.red);
                helper.UpdatePlayingState(``, ``, ``, `❌ Nothing is being played`);
                notify.notifyPlaybackYTStop({title: yt_info[0].title});
        });
        await player.on(AudioPlayerStatus.Paused, () => {
            console.log(`[Server][${hours}:${minutes}:${seconds}] AudioPlayer has been paused`.red);
        });
        player.on('error', (err) => {
            console.log(`[Server][${hours}:${minutes}:${seconds}] An error occured: ${err}`.red);
        });
        var resource = createAudioResource(stream.stream , { inputType: stream.type });
        connection.subscribe(player);
        player.play(resource);
        module.exports.initializeAudioPlayer(player);
        await interaction.editReply(`Started playing **${yt_info[0].title}**`);
        await notify.notifyPlaybackYT({title: yt_info[0].title, description: yt_info[0].description, channel: voicechannel.name});
    },

}