const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const clash = require('../apiCalls/clash')
//BDD
const db = require("../datas/db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('super-troupes')
        .setDescription('Recherche et liste les super troupes activées (mise à jour tous les 1/2 heures)')
    ,
    async execute(interaction) {

        //mise en pause de la reponse
        await interaction.deferReply({ ephemeral: true });

        const replyObj = await constructReply()

        const embed = new MessageEmbed()
            .setColor('#ffffff')
            .setTitle(`Super Troupes actives`)

        for (const item in replyObj) {
            embed.addFields(
                { name: item, value: replyObj[item].join("\n") }
            )
        }

        await interaction.editReply({ ephemeral: false, embeds: [embed] })
    },
};

const constructReply = async () => {
    //objet de recherche
    const allMembers = await db.getFullDb("dayZero")
    let replyObjet = {}
    for (const member in allMembers) {
        if (member !== "timeStamp") {
            //console.log('[member]', member)
            for (const troup in allMembers[member].coc.troops) {
                if (allMembers[member].coc.troops[troup].superTroopIsActive) {

                    const troupName = allMembers[member].coc.troops[troup].name
                    const memberName = allMembers[member].coc.name
                    const memberTag = allMembers[member].coc.tag
                    const memberClan = allMembers[member].coc.clan.name

                    let temp
                    try {
                        temp = [...replyObjet[troupName]]
                    } catch (error) {
                        temp = []
                    }
                    temp.push(`${memberName} (${memberTag}) - ${memberClan}`)

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