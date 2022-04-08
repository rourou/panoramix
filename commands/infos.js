const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const clash = require('../apiCalls/clash')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infos')
        .setDescription('Recupere les infos sur clash of clans')
        .addStringOption(option =>
            option.setName('choix')
                .setDescription('Dans un clan spécifique')
                .setRequired(true)
                .addChoice('clan', 'clan')
                .addChoice('joueur', 'joueur')
        )
        .addStringOption(option =>
            option.setName('tag')
                .setDescription('Tag du joueur ou clan')
                .setRequired(true)
        ),


    async execute(interaction) {

        //const subcommand = interaction.options.getSubcommand()
        let choice = interaction.options.get("choix").value
        let tag = interaction.options.get("tag").value

        //supression du #
        tag = tag.replaceAll('#', '').toUpperCase()

        //mise en pause de la reponse
        await interaction.deferReply({ ephemeral: true });

        let res = null
        let reply = {
            name: `${choice.toUpperCase()} - ${tag}`,
            text: `Non trouvé`
        }
        switch (choice) {
            case "joueur":
                res = await clash.getPlayer(`${tag}`)

                if (res.data !== "N/A") {
                    reply = {
                        name: `${choice.toUpperCase()} - ${res.data.name}`,
                        text: `HDV: ${res.data.townHallLevel}`
                    }
                }

                break;

            case "clan":
                res = await clash.getClan(`${tag}`)

                if (res.data !== "N/A") {
                    reply = {
                        name: `${choice.toUpperCase()} - ${res.data.name}`,
                        text: `Description:\n${res.data.description}`
                    }
                }

                break;
        }

        const embed = new MessageEmbed()
            .setColor('#ffffff')
            .addFields(
                { name: reply.name, value: reply.text },
            )

        await interaction.editReply({ ephemeral: false, embeds: [embed] })
    },
};