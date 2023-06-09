const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel, getVoiceConnections , createAudioPlayer, NoSubscriberBehavior, createAudioResource , AudioPlayerStatus , StreamType} = require('@discordjs/voice');
const { default: PlayDL } = require('play-dl');
const { createReadStream } = require('node:fs');

const queue = new Map();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays something cool')
    .addStringOption(name => 
        name.setName('name')
        .setDescription('Plays the song by the provided name')
        .setRequired(true))
    
    .addChannelOption((option) => 
        option.setName('channel')
            .setDescription('The name of the channel you wish to play song to')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)),
    async execute(interaction , client) {
        const voicechannel = interaction.options.getChannel('channel');
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
        connection.subscribe(player);

        const query = interaction.options.get('name').value;
        /*const searchResult = PlayDL.search(query , { limit: 1});
        const streamURL = searchResult[0].AudioPlayerStatus.Stream;*/
        const resource = createAudioResource('https://icecast5.play.cz/impuls128.mp3?1571059741');
        player.play(resource);
        

        await interaction.reply(`Searching for `);
    },
    
}