const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('maketest')
    .setDescription('A very simple test command'),
    async execute(interaction) {
        await interaction.reply("Test");
    },
}