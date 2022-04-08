const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const clash = require('../apiCalls/clash')
const fs = require('fs')
//json de config
const { channelFlood } = require('../datas/configBot.json');

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
        let action = interaction.options.get("action").value

        switch (action) {

            default:
                const embedBuild = new MessageEmbed()
                    .setColor('#ffffff')
                    .addFields(
                        { name: `---`, value: `Cette fonctionnalité n'est pas encore fonctionnelle` },
                    )

                await interaction.editReply({ ephemeral: true, embeds: [embedBuild] });
                break;
        }



    },
};