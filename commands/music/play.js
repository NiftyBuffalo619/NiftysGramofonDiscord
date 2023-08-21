const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel, getVoiceConnections , createAudioPlayer, NoSubscriberBehavior, createAudioResource , AudioPlayerStatus , StreamType} = require('@discordjs/voice');
const { default: PlayDL } = require('play-dl');
const { createReadStream } = require('node:fs');
const { Player } = require('discord-player');
const { SpotifyExtractor, SoundCloudExtractor } = require('@discord-player/extractor');
const client = require('../../server');
var colors = require('colors');

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
        const voicechannel = interaction.options.getChannel('channel');
        const query = interaction.options.get('name').value;
        /*const searchResult = PlayDL.search(query , { limit: 1});
        const streamURL = searchResult[0].AudioPlayerStatus.Stream;*/
        await interaction.deferReply();
        try {
            const { track } = await player.play(channe , query , {
                nodeOptions: {
                    metadata: interaction
                }
            });
            return interaction.followUp(`**${track.title}** enqueued!`);
        }
        catch (err) {
            console.log(`There was an error while trying to play`.red);
            console.log(`Error Message: ${err.message}`);
        }
        await interaction.reply(`Searching for `);
    },
    
}