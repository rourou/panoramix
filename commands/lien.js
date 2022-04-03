const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const clash = require('../apiCalls/clash')
const fs = require('fs')

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

        let action = null
        //separation pour les deux style de commandes
        try {
            action = interaction.options.get("action").value
        } catch {
            action = interaction.action
        }
        let tag = null

        //on lit le JSON
        const rawdata = fs.readFileSync(`./datas/membersCoc.json`)
        let membersCoc = JSON.parse(rawdata)

        //mise en pause de la reponse
        //await interaction.deferReply();
        //separation pour les deux style de commandes
        try {
            await interaction.deferReply();
        } catch {
            await interaction.interaction.deferReply();
        }

        console.log('action:', action)
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
                    //separation pour les deux style de commandes
                    let user
                    try {
                        tag = interaction.options.get("tag").value.replaceAll('#', '').toUpperCase()
                        user = interaction.user
                    } catch {
                        tag = interaction.tag.replaceAll('#', '').toUpperCase()
                        user = interaction.interaction.user
                    }

                    if (!membersCoc[`#${tag}`]) {
                        throw 'erreur'
                    }

                    console.log("user", user)

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
                    tag = interaction.options.get("tag").value.replaceAll('#', '').toUpperCase()

                    if (!membersCoc[`#${tag}`]) {
                        throw 'erreur'
                    }

                    console.log("user", interaction.user)

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
                            { name: `C'est fait ${interaction.user.username}`, value: `tu n'est plus le chef du village ${membersCoc[`#${tag}`].nameCoc} ` }
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
                    tag = interaction.options.get("tag").value.replaceAll('#', '').toUpperCase()
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

                    await interaction.editReply({ ephemeral: true, embeds: [embedDemande], components: [rowDemande] });
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