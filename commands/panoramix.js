const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panoramix')
        .setDescription('Discute avec moi')
    ,
    async execute(interaction) {

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Fais ton choix')
                    .addOptions([
                        {
                            label: `les 10 commandements de l'armée d'Astérix`,
                            value: 'commandements',
                        },
                        {
                            label: `Les infos sur l'Armée d'Astérix`,
                            value: 'infos-famille',
                        },
                    ])
                    ,
            )


        const embed = new MessageEmbed()
            .setColor('#ffffff')
            .addFields(
                { name: `Salut ${interaction.user.username}!`, value: `De quoi à tu besoin?` },
            )


        await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });
    },
};