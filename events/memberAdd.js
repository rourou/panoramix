const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');
const { channelStart } = require('../datas/configBot.json');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member) {
        console.log('member:', member)

        //console.log('memberAdd:', memberAdd)
        //const channelList = await member.client.channels.cache.map(channel => `${channel.id} - ${channel.name}`)
        //console.log('channelList:', channelList)

        const channel = await member.client.channels.fetch(channelStart) //channel des nouveaux arrivants
            .then((channel) => { return channel })
            .catch((err) => { return null })
        //console.log('channel:', channel)

        // On créé un nouveau message embarqué
        const embed = new MessageEmbed()
            .setTitle(`Bienvenue dans l'Armée d'Astérix !`)
            .setColor(0xffffff)
            .setDescription(`Salut ${member.user.toString()}\ntoute l'Armée d'Astérix te souhaite la bienvenue !`)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: '\u200B', value: 'Je suis panoramix et je suis un peu le seul sage dans cette famille de fou 😁' },
                { name: '\u200B', value: `Mon rôle est de te servir, n'hésite pas, donc, à m'appeler avec la commande ${bold("/panoramix")}\nJe suis encore jeune malgrès ma barbe, mais mes fonctions vont grandir avec le temps` },
                { name: '\u200B', value: `Voici pour commencer les 10 commandements de la famille\n prends le temps de les lire 😉` },
                { name: `---`, value: ` ${bold("1 - ")}1000 points aux jeux tu feras\n${bold(" 2 -")} Ton statut de guerre à jour tu tiendras\n${bold(" 3 -")} Poli et courtois tu seras\n${bold(" 4 -")} En fonction de ton profil le bon clan tu choisira\n${bold(" 5 -")} A la vie du clan tu participeras\n${bold(" 6 -")} Dans les temps tu attaqueras\n${bold(" 7 -")} Le discord tu suivras\n${bold(" 8 -")} Des troupes tu donneras\n${bold(" 9 -")} Non préma tu es et resteras\n${bold("10 -")} Si non respect ton exclusion tu accepteras` },
                { name: `---`, value: `Prends tes marques, amuse toi et n'hésites pas à poser des questions ` }
            )
        console.log('embed:', embed)
        //avec le bouton pour accepter les regles
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('accept-rules')
                    .setLabel(`J'accepte et je rejoins l'armée d'Asterix`)
                    .setStyle('SUCCESS'),
            );
        //channel.send({ ephemeral: false, embeds: [embed], components: [row] })


    },
};