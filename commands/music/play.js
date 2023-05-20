const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

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
        await interaction.reply(`Searching for `);
    },
    
}