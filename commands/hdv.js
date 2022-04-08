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

        const replyObj = await constructReply(hdv)

        const embed = new MessageEmbed()
            .setColor('#ffffff')
            .setTitle(`Villages HDV ${hdv}`)

        for (const item in replyObj) {
            embed.addFields(
                { name: item, value: replyObj[item].join("\n") }
            )
        }

        await interaction.editReply({ ephemeral: false, embeds: [embed] })
    },
};

const constructReply = async (hdv) => {
    //objet de recherche
    const clanFamilly = await db.getFullDb("clans")
    //recherche via l'api COC
    let replyObjet = {}
    for (const clanSearch in clanFamilly) {
        if (clanSearch !== "timeStamp") {
            for (const member of clanFamilly[`${clanSearch}`].infosCoc.memberList) {
                const infosMember = await db.getUser({ db: "dayZero", tag: member.tag })
                if (infosMember.coc.townHallLevel === hdv) {

                    const clanName = clanFamilly[`${clanSearch}`].infosCoc.name
                    const memberName = infosMember.coc.name
                    const memberTag = infosMember.coc.tag

                    let temp
                    try {
                        temp = [...replyObjet[clanName]]
                    } catch (error) {
                        temp = []
                    }
                    temp.push(`${memberName} (${memberTag})`)
                    replyObjet = {
                        ...replyObjet,
                        [clanName]: temp
                    }
                }
            }
        }
    }
    console.log('replyObjet:', replyObjet)
    return replyObjet
}