const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays something cool'),
    async execute(interaction) {
        await interaction.reply("Play command");
    },
}