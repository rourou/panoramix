const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commandements')
        .setDescription(`Les 10 commandements de l’armé d'Astérix`),
    async execute(interaction) {
        const embed = new MessageEmbed()
            .setColor('#ffffff')
            .setTitle(`Les 10 commandements de l’armé d'Astérix`)
            .setThumbnail("https://us.123rf.com/450wm/ylivdesign/ylivdesign1607/ylivdesign160704740/60388026-militaire-ic%C3%B4ne-de-casque-dans-le-style-plat-avec-ombre.jpg?ver=6")
            .addFields(
                { name: `\u200B`, value: ` ${bold("1 - ")}1000 points aux jeux tu feras\n${bold(" 2 -")} Ton statut de guerre à jour tu tiendras\n${bold(" 3 -")} Poli et courtois tu seras\n${bold(" 4 -")} En fonction de ton profil le bon clan tu choisira\n${bold(" 5 -")} A la vie du clan tu participeras\n${bold(" 6 -")} Dans les temps tu attaqueras\n${bold(" 7 -")} Le discord tu suivras\n${bold(" 8 -")} Des troupes tu donneras\n${bold(" 9 -")} Non préma tu es et resteras\n${bold("10 -")} Si non respect ton exclusion tu accepteras` },
            )


        await interaction.reply({ ephemeral: false, embeds: [embed] })
    },
};