const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const clash = require('../apiCalls/clash')
//BDD
const db = require("../datas/db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('super-troupes')
        .setDescription('Recherche et liste les super troupes activées (mise a jour tous les 1/2 heures')
    ,
    async execute(interaction) {

        //mise en pause de la reponse
        await interaction.deferReply({ ephemeral: true });

        const replyObj = await constructReplyTab()

        const embed = new MessageEmbed()
            .setColor('#ffffff')
            .setTitle(`Super Troupes actives`)
            .addFields(
                { name: `Super Troupes`, value: replyTab.join("\n") }
            )

        for (const item in replyObj) {
            embed.addFields(
                { name: item, value: replyObj[item].join("\n") }
            )
        }

        await interaction.editReply({ ephemeral: false, embeds: [embed] })
    },
};

const constructReplyTab = async () => {
    //objet de recherche
    const allMembers = await db.getFullDb("dayZero")
    let replyObjet = {}
    for (const member in allMembers) {
        if (member !== "timeStamp") {
            for (const troup in allMembers[member].coc.troops) {
                if (allMembers[member].coc.troops[troup].superTroopIsActive) {

                    const troupName = allMembers[member].coc.troops[troup].name
                    const memberName = allMembers[member].coc.name

                    let temp
                    try {
                        temp = [...replyObjet[troupName]]
                    } catch (error) {
                        temp = []
                    }
                    temp.push(memberName)

                    replyObjet = {
                        ...replyObjet,
                        [troupName]: temp
                    }
                }

            }
        }
    }
    return replyObjet
}