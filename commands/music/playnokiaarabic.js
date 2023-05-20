const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const queue = new Map();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('playnokiaarabic')
    .setDescription('Plays a Nokia Arabic Ringtone')
    .addChannelOption((option) => 
        option.setName('channel')
            .setDescription('The name of the channel you wish to play song to')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice))
    .addStringOption((option2) => 
        option2.setName('category')
            .setDescription('The name of the sound you want to play')
            .setRequired(true)
            .addChoices(
                { name: 'Nokia Ringtone Classic', value: "1"},
                { name: 'Nokia Ringtone Remix 2', value: "2"},)
            ),
    async execute(interaction , client) {
        await interaction.reply(`Searching for `);
    },
    
}