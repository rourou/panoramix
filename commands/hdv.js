const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const clash = require('../apiCalls/clash')
//BDD
const db = require("../datas/db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hdv')
        .setDescription('Recherche des joueurs par HDV (mise à jour tous les 1/2 heures)')
        .addIntegerOption(option =>
            option.setName('hdv')
                .setDescription(`niveau d'hdv`)
                .setRequired(true)
        ),
    async execute(interaction) {

        let hdv = interaction.options.get("hdv").value

        //mise en pause de la reponse
        await interaction.deferReply({ ephemeral: true });

        const replyTab = await constructReplyTab(hdv)

        const embed = new MessageEmbed()
            .setColor('#ffffff')
            .addFields(
                { name: `HDV ${hdv}`, value: replyTab.join("\n") }
            )

        // await interaction.editReply(replyTab.join("\n"));
        await interaction.editReply({ ephemeral: false, embeds: [embed] })
    },
};

const constructReplyTab = async (hdv) => {
    //objet de recherche
    const clanFamilly = await db.getFullDb("clans")
    //recherche via l'api COC
    let replyTab = []
    for (const clanSearch in clanFamilly) {
        if (clanSearch !== "timeStamp") {
            replyTab.push(`------ ${clanFamilly[`${clanSearch}`].infosCoc.name} ------`)
            for (const member of clanFamilly[`${clanSearch}`].infosCoc.memberList) {
                const infosMember = await db.getUser({ db: "dayZero", tag: member.tag })
                if (infosMember.coc.townHallLevel === hdv) {
                    replyTab.push(`${member.name} (${member.tag})`)
                }
            }
            replyTab.push(`------------------------`)
        }
    }
    return replyTab
}