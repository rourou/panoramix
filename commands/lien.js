const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const clash = require('../apiCalls/clash')
const fs = require('fs')
//json de config
const { channelFlood } = require('../datas/config.json');

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

        //on lit le JSON des membres
        const rawdata = fs.readFileSync(`./datas/membersCoc.json`)
        let membersCoc = JSON.parse(rawdata)

        let action = null
        let tag = null
        let user = null
        //recup de l'action et du tag et user en fonction des deux types de commandes
        try {
            action = interaction.options.get("action").value
            tag = interaction.options.get("tag").value.replaceAll('#', '').toUpperCase()

        } catch {
            action = interaction.action
            tag = interaction.tag.replaceAll('#', '').toUpperCase()

        }

        //mise en pause de la reponse les deux style de commandes si interaction
        if (!interaction.commandInterne) {
            try {
                await interaction.deferReply();
                user = interaction.user
            } catch {
                await interaction.interaction.deferReply();
                user = interaction.interaction.user
            }
        }
        console.log('action:', action)
        console.log('tag', tag)
        console.log('user', user)

        switch (action) {

            case "list":
                let tabMembersLink = ['_']
                let tabMembersNoLink = ['_']
                for (const member in membersCoc) {
                    if (member !== "timeStamp") {
                        if (!!membersCoc[member].userDiscord && !!membersCoc[member].userDiscord.username) {
                            tabMembersLink.push(`${membersCoc[member].nameCoc} --> ${membersCoc[member].userDiscord.username}`)
                        } else {
                            tabMembersNoLink.push(`${membersCoc[member].nameCoc} --> ${membersCoc[member].tagCoc}`)
                        }
                    }
                }

                const embedLink = new MessageEmbed()
                    .setColor('#ffffff')
                    .setTitle(`Joueurs avec liens`)
                //ajout du field avec lien
                const stringTabLink = tabMembersLink.join("\n")
                for (let i = 0; i < stringTabLink.length; i += 1000) {
                    const cont = stringTabLink.substring(i, Math.min(stringTabLink.length, i + 1000));
                    embedLink.addField("\u200B", cont);
                }

                const embedNoLink = new MessageEmbed()
                    .setColor('#ffffff')
                    .setTitle(`Joueurs sans liens`)
                //ajout du field sans lien
                const stringTabNoLink = tabMembersNoLink.join("\n")
                for (let i = 0; i < stringTabNoLink.length; i += 1000) {
                    const cont = stringTabNoLink.substring(i, Math.min(stringTabNoLink.length, i + 1000));
                    embedNoLink.addField("\u200B", cont);
                }

                await interaction.editReply({ ephemeral: false, embeds: [embedLink, embedNoLink] })
                break;


            case "add":

                try {

                    if (!membersCoc[`#${tag}`]) {
                        throw 'erreur'
                    }

                    membersCoc = {
                        ...membersCoc,
                        [`#${tag}`]: {
                            ...membersCoc[`#${tag}`],
                            userDiscord: { ...user }
                        }
                    }
                    //ecriture dans le json 
                    let data = JSON.stringify(membersCoc, null, 2)
                    await fs.writeFileSync(`./datas/membersCoc.json`, data)

                    const embedAdd = new MessageEmbed()
                        .setColor('#ffffff')
                        .addFields(
                            { name: `Merci ${user.username}`, value: `Je t'ai bien enregistré comme chef du village ${membersCoc[`#${tag}`].nameCoc} ` }
                        )


                    //separation pour les deux style de commandes
                    try {
                        await interaction.editReply({ ephemeral: false, embeds: [embedAdd] });
                    } catch {
                        await interaction.interaction.editReply({ ephemeral: false, embeds: [embedAdd] });
                    }

                } catch (error) {
                    console.log('error:', error)
                    const embedError = new MessageEmbed()
                        .setColor('#ffffff')
                        .addFields(
                            { name: `😮 Une erreur c'est produite`, value: `as tu renseigné un tag valide?` },
                        )

                    //separation pour les deux style de commandes
                    try {
                        await interaction.editReply({ ephemeral: true, embeds: [embedError] });
                    } catch {
                        await interaction.interaction.editReply({ ephemeral: true, embeds: [embedError] });
                    }
                }

                break;

            case "suppr":

                try {

                    if (!membersCoc[`#${tag}`]) {
                        throw 'erreur'
                    }

                    membersCoc = {
                        ...membersCoc,
                        [`#${tag}`]: {
                            ...membersCoc[`#${tag}`],
                            userDiscord: null
                        }
                    }
                    //ecriture dans le json 
                    let data = JSON.stringify(membersCoc, null, 2)
                    await fs.writeFileSync(`./datas/membersCoc.json`, data)

                    const embedSuppr = new MessageEmbed()
                        .setColor('#ffffff')
                        .addFields(
                            { name: `C'est fait ${user.username}`, value: `tu n'est plus le chef du village ${membersCoc[`#${tag}`].nameCoc} ` }
                        )

                    await interaction.editReply({ ephemeral: false, embeds: [embedSuppr] });

                } catch (error) {
                    console.log('error:', error)
                    const embedError = new MessageEmbed()
                        .setColor('#ffffff')
                        .addFields(
                            { name: `😮 Une erreur c'est produite`, value: `as tu renseigné un tag valide?` },
                        )

                    await interaction.editReply({ ephemeral: true, embeds: [embedError] });
                }

                break;

            case "demande":

                try {
                    const playerCoc = await clash.getPlayer(tag)

                    const rowDemande = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId(`command:lien|action:add|tag:${tag}`)
                                .setLabel(`Je suis le chef de ${playerCoc.data.name}`)
                                .setStyle('PRIMARY'),
                        )

                    const embedDemande = new MessageEmbed()
                        .setColor('#ffffff')
                        .addFields(
                            { name: `😱 J'ai perdu le chef de ce village`, value: `\u200B` },
                            { name: `Nom`, value: `${playerCoc.data.name || 'inconnu'}`, inline: true },
                            { name: `HDV`, value: `${playerCoc.data.townHallLevel || 'inconnu'}`, inline: true },
                            { name: `Clan`, value: `${playerCoc.data.clan.name || 'inconnu'}`, inline: true },
                            { name: `\u200B`, value: `👇🏻 Clique sur le bouton si tu en es tu le chef ` },
                        )

                    if (interaction.channel === "flood") {
                        const channel = await client.channels.fetch(channelFlood) //id du flood
                            .then((channel) => { return channel })
                            .catch((err) => { return null })

                        //envoi du message
                        channel.send({ ephemeral: true, embeds: [embedDemande], components: [rowDemande] })
                    } else {
                        await interaction.editReply({ ephemeral: true, embeds: [embedDemande], components: [rowDemande] });
                    }

                } catch (error) {
                    console.log('error:', error)
                    const embedError = new MessageEmbed()
                        .setColor('#ffffff')
                        .addFields(
                            { name: `😮 Une erreur c'est produite`, value: `as tu renseigné un tag valide?` },
                        )

                    await interaction.editReply({ ephemeral: true, embeds: [embedError] });
                }

                break;

            default:
                await interaction.editReply("pas encore fonctionnel");
                break;
        }



    },
};