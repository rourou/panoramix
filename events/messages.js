//BDD
const db = require("../datas/db");
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        console.log("message", message.content, " auteur: ", message.author.username, " ID: ", message.author.id, "channelId:", message.channel.id)

        //recherche si on connais un village pour ce membre discord
        let membersCoc = await db.getFullDb("dayZero")
        let tabWithDiscord = []
        Object.keys(membersCoc).filter((element) => {
            if (!!membersCoc[element].discord && membersCoc[element].discord.id !== undefined) {
                tabWithDiscord.push(membersCoc[element])
            }
        })
        if (tabWithDiscord.find(element => element.discord.id === message.author.id)) {
            console.log('User Discord Trouvé')
        } else {
            console.log('User Discord Non trouvé')
        }

        //verif si on appel panoramix
        if (message.content.toLowerCase() === 'panoramix') {
            console.log("appel panoramix")
        }

        //verification si tag (contient # et n'as qu'un seul mot)
        if (message.content.includes('#') && message.content.split(' ').length === 1) {
            console.log("commande #")
        }
    },
};

