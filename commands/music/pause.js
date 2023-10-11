const { SlashCommandBuilder, ChannelType } = require('discord.js');
var Player = require('./play');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the audio'),

    async execute(interaction, client) {
        const time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();

        Player.getAudioPlayer().pause();
        await interaction.reply("Paused the audio");
    }
}