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
        console.log('interaction:', interaction)

        await interaction.deferReply({ ephemeral: true });
        let reponse = {
            title: "",
            value: ""
        }

        let action = interaction.options.get("action").value
        switch (action) {

            /*####################################################################################################################*/
            case add:

                //recherche en bdd
                const getUser = await db.getUser({
                    db: "dayZero",
                    tag: member.tag,
                })
                //recherche sur COC
                const infosMember = await clash.getPlayer(`${member.tag.replaceAll('#', '').toUpperCase()}`)
                if (infosMember.data) {
                    const add = await db.addUpdateUser({
                        db: "dayZero",
                        tag: member.tag,
                        data: {
                            coc: getUser ? getUser.coc : null,
                            discord: interaction.user
                        }
                    })
                    if (add === "OK") {
                        reponse = {
                            title: `Merci ${interaction.user.username}`,
                            value: `J'ai bien enregistré que tu est le chef du village: ${infosMember.data.name} - ${member.tag}`
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