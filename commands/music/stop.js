const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel, getVoiceConnections , createAudioPlayer, NoSubscriberBehavior, createAudioResource , AudioPlayerStatus , StreamType} = require('@discordjs/voice');
const { createReadStream } = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the actual music playback'),

    async execute(interaction, client) {
        const time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();
        const player = createAudioPlayer({behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            }
        }).stop();
        interaction.reply("Stopped the audio");
    }
}