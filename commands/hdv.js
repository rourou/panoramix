const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const clash = require('../apiCalls/clash')
const clans = require('../datas/clans.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hdv')
        .setDescription('Recherche des joueurs par HDV !!! execution longue !!!')
        .addIntegerOption(option =>
            option.setName('hdv')
                .setDescription(`niveau d'hdv`)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('clan')
                .setDescription('Dans un clan spécifique')
                .setRequired(true)
                .addChoice('Armee', 'armee')
                .addChoice('Asterix', 'asterix')
                .addChoice('Tous', 'tous')
        )
        .addStringOption(option =>
            option.setName('tag')
                .setDescription('Tag des joueurs trouvés')
                .setRequired(true)
                .addChoice('Oui', 'oui')
                .addChoice('Non', 'non')
        ),
    async execute(interaction) {

        let clan = interaction.options.get("clan").value
        let hdv = interaction.options.get("hdv").value

        //mise en pause de la reponse
        await interaction.deferReply();
        //construction du tableau de recherche
        let recherche
        if (clan === "tous") {
            recherche = clans
        } else {
            recherche = {
                [`${clan}`]: clans[`${clan}`]
            }
        }
        //recherche via l'api COC
        const replyTab = []
        for (const clanShearch in recherche) {
            infosClan = await clash.getClan(recherche[`${clanShearch}`].tag)
            replyTab.push(`------ ${recherche[`${clanShearch}`].name} ------`)
            for (const member of infosClan.data.memberList) {
                infosMember = await clash.getPlayer(`${member.tag.replaceAll('#', '').toUpperCase()}`)
                if (infosMember.data.townHallLevel === hdv) {
                    replyTab.push(`${member.name} (${member.tag})`)
                }
            }
            replyTab.push(`------------------------`)
        }

        const embed = new MessageEmbed()
            .setColor('#ffffff')
            .addFields(
                { name: `HDV ${hdv}`, value: replyTab.join("\n") }
            )

        // await interaction.editReply(replyTab.join("\n"));
        await interaction.editReply({ ephemeral: false, embeds: [embed] })
    },
};