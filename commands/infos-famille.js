const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const clash = require('../apiCalls/clash')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infos-famille')
        .setDescription(`Les infos de la famille`),
    async execute(interaction) {

        const recup = {
            armee: await clash.getClan('2JQ82LG').then((res) => { return res.data }),
            asterix: await clash.getClan('YV902CU').then((res) => { return res.data }),
            alpha: await clash.getClan('2LYU98Q2').then((res) => { return res.data })
        }
        const embed_1 = new MessageEmbed()
            .setColor('#ffffff')
            .setTitle(`voici l'armée d'Astérix:`)

        const embed_2 = new MessageEmbed()
            .setColor('#ffffff')
            .setTitle(`CLAN 1 : L'ARMÉE (${recup.armee.members}/50)`)
            .setURL('https://link.clashofclans.com/fr?action=OpenClanProfile&tag=2JQ82LG')
            .setDescription('Clan chill / GDC organisée avec stratégie / accompagnement en stratégie et nouvelles compo')
            .setThumbnail(recup.armee.badgeUrls.medium)
            .addFields(
                { name: 'Tag ', value: '#2JQ82LG' },
                { name: 'Lien', value: 'https://link.clashofclans.com/fr?action=OpenClanProfile&tag=2JQ82LG', inline: true },
                { name: 'Description', value: recup.armee.description }
            )
        const embed_3 = new MessageEmbed()
            .setColor('#ffffff')
            .setTitle(`CLAN 2 : ASTERIX TEAM (${recup.asterix.members}/50)`)
            .setURL(' https://link.clashofclans.com/fr?action=OpenClanProfile&tag=YV902CU')
            .setDescription('CLAN chill / à la cool / rigolade / foutraque')
            .setThumbnail(recup.asterix.badgeUrls.medium)
            .addFields(
                { name: 'Tag ', value: '#YV902CU' },
                { name: 'Lien', value: ' https://link.clashofclans.com/fr?action=OpenClanProfile&tag=YV902CU', inline: true },
                { name: 'Description', value: recup.asterix.description }
            )

        await interaction.reply({ ephemeral: false, embeds: [embed_1, embed_2, embed_3] })
    },
};
