const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('salut')
        .setDescription('Dis bonjour a Panoramix!'),

    async execute(interaction) {
        console.log('interaction', interaction)

        const embed = new MessageEmbed()
            .setColor('#ffffff')
            .addFields(
                { name: `Salut`, value: `${interaction.user.toString()}!` },
            )


        await interaction.reply({ ephemeral: false, embeds: [embed] });
    },
};