const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const clash = require('../apiCalls/clash')
const fs = require('fs')
//json de config
const { channelFlood } = require('../datas/configBot.json');
//BDD
const db = require("../datas/db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lien')
        .setDescription('Gestion des liens entre les tags clash of clans et les membres discord')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Action')
                .addChoice('Ajout', 'add')
                .addChoice('Suppression', 'suppr')
                .addChoice('Liste', 'list')
                .addChoice('Demande', 'demande')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('tag')
                .setDescription('Tag du joueur')
                .setRequired(false)
        )
    ,

    async execute(interaction) {
        //console.log('interaction:', interaction)

        await interaction.deferReply({ ephemeral: true });
        let reponse = {
            title: "",
            value: ""
        }

        let action = interaction.options.get("action").value
        let tag, getUser, infosMember
        try {
            tag = interaction.options.get("tag").value.replaceAll('#', '').toUpperCase()
        } catch {
            if (action !== "list") {
                action = "tag-manquant"
            }
        }

        switch (action) {

            case "tag-manquant":
                reponse = {
                    title: "Tag manquant",
                    value: "Il faut renseigner un tag pour cette commande"
                }
                break;

            /*####################################################################################################################*/
            case "add":

                //recherche en bdd
                getUser = await db.getUser({
                    db: "dayZero",
                    tag: `#${tag}`,
                })
                //recherche sur COC
                infosMember = await clash.getPlayer(tag)

                if (infosMember.data !== "N/A") {
                    const add = await db.addUpdateUser({
                        db: "dayZero",
                        tag: `#${tag}`,
                        data: {
                            coc: getUser ? getUser.coc : null,
                            discord: interaction.user
                        }
                    })
                    if (add === "OK") {
                        reponse = {
                            title: `Merci ${interaction.user.username}`,
                            value: `J'ai bien enregistré que tu est le chef du village: ${infosMember.data.name} - ${tag}`
                        }
                    } else {
                        reponse = {
                            title: "ERREUR",
                            value: "Je n'ai pas réussi t'enregistrer"
                        }
                    }
                } else {
                    reponse = {
                        title: "ERREUR",
                        value: "Je ne trouve pas ce tag dans le jeux"
                    }
                }

                break;

            /*####################################################################################################################*/
            case "suppr":

                //recherche en bdd
                getUser = await db.getUser({
                    db: "dayZero",
                    tag: `#${tag}`,
                })
                console.log('getUser:', getUser)
                if (getUser) {
                    const suppr = await db.addUpdateUser({
                        db: "dayZero",
                        tag: `#${tag}`,
                        data: {
                            coc: getUser ? getUser.coc : null,
                            discord: null
                        }
                    })
                    if (suppr === "OK") {
                        reponse = {
                            title: `Merci ${interaction.user.username}`,
                            value: `Tu n'est plus le chef du village: ${getUser.coc.name} - ${tag}`
                        }
                    } else {
                        reponse = {
                            title: "ERREUR",
                            value: "Je n'ai pas réussi t'enregistrer"
                        }
                    }
                } else {
                    reponse = {
                        title: "ERREUR",
                        value: "Je ne trouve pas ce tag"
                    }
                }

                break;

            /*####################################################################################################################*/
            case "list":
                //tableaux de res
                let tabLink = ['Membres avec liens']
                let tabNoLink = ['Membres sans liens']
                //all members 
                const allMembers = await db.getFullDb("dayZero")
                for (const member in allMembers) {
                    if (member !== "timeStamp") {
                        try {
                            console.log('member:', member)
                            if (allMembers[member].discord === null) {
                                tabNoLink.push(`${allMembers[member].coc.name} (${member})`)
                            } else {
                                tabLink.push(`${allMembers[member].coc.name} (${member}) --> ${allMembers[member].discord.username}`)
                            }
                        } catch () {

                        }
                    }
                }
                reponse = {
                    title: "LIENS",
                    value: `${tabLink.join('\n')}\n${tabNoLink.join('\n')}`
                }
                break

            /*####################################################################################################################*/
            default:
                reponse = {
                    title: "Un peu de patience",
                    value: "Cette fonctionnalité n'est pas encore fonctionnelle"
                }
                break;
        }

        const embedBuild = new MessageEmbed()
            .setColor('#ffffff')
            .addFields(
                { name: reponse.title, value: reponse.value },
            )

        await interaction.editReply({ ephemeral: true, embeds: [embedBuild] });

    },
};