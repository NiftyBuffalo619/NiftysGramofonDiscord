const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel, getVoiceConnections , createAudioPlayer, NoSubscriberBehavior, createAudioResource , AudioPlayerStatus , StreamType} = require('@discordjs/voice');
const { createReadStream } = require('node:fs');
var Player = require('./play');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the actual music playback'),

    async execute(interaction, client) {
        const time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();
        //AudioPlayerClass.stop();
        if (Player.getAudioPlayer() === undefined) {
            await interaction.reply("There is nothing playing");
            return;
        }
        Player.getAudioPlayer().stop();
        await interaction.reply("Stopped the audio");
    }
}