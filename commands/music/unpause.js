const { SlashCommandBuilder, ChannelType } = require('discord.js');
var Player = require('./play');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unpause')
    .setDescription('Unpauses the audio'),

    async execute(interaction, client) {
        const time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();
        if (Player.getAudioPlayer() === undefined) {
            await interaction.reply("There is nothing playing");
            return;
        }
        Player.getAudioPlayer().unpause();
        await interaction.reply("Unpaused the audio");
    }
}