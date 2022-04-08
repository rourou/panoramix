const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
//json de config
const { channelFlood } = require('../datas/configBot.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('envoi-message')
        .setDescription(`J'envoi un message pour toi`)
        .addStringOption(option =>
            option.setName('texte')
                .setDescription(`texte a envoyer`)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('channel')
                .setDescription('dans quel salon?')
                .addChoice('flood', 'flood')
                .addChoice('ici', 'ici')
                .setRequired(true)
        ),

    async execute(interaction) {

        //mise en pause de la reponse
        await interaction.deferReply({ ephemeral: true });

        let channelToSend
        let message = interaction.options.get("texte").value

        switch (interaction.options.get("channel").value) {
            case "flood":
                channelToSend = channelFlood
                break;
            case "ici":
                channelToSend = interaction.channelId
                break;

            default:
                break;
        }

        const channel = await interaction.client.channels.fetch(channelToSend) //id du flood
            .then((channel) => { return channel })
            .catch((err) => { return null })


        const embed = new MessageEmbed()
            .setColor('#ffffff')
            .addFields(
                { name: `---`, value: `${message}` },
            )

        //envoi du message
        channel.send({ ephemeral: false, embeds: [embed] })
            .then(() => {
                const embedSuccess = new MessageEmbed()
                    .setColor('#ffffff')
                    .addFields(
                        { name: `---`, value: "c'est fait" }
                    )

                interaction.editReply({ ephemeral: true, embeds: [embedSuccess] })
            })
            .catch(() => {
                const embedError = new MessageEmbed()
                    .setColor('#ffffff')
                    .addFields(
                        { name: `---`, value: "une erreur est survenue" }
                    )

                interaction.editReply({ ephemeral: true, embeds: [embedError] })
            })


    },
};