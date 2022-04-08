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

            const embed = new MessageEmbed()
                .setColor('#ffffff')
                .addFields(
                    { name: `Salut`, value: `${message.author.toString()}!` },
                )

            message.reply({
                ephemeral: true, embeds: [embed]
            })/*, fetchReply: true
            })
                .then(() => {
                    message.channel.awaitMessages({ max: 1, time: 30000, errors: ['time'] })
                        .then(collected => {
                            console.log('collected:', collected)
                            message.channel.send(`${collected.content} got the correct answer!`);
                        })
                        .catch(collected => {
                            console.log('collected:', collected)
                            message.channel.send('Looks like nobody got the answer this time.');
                        });
                });*/

        }

        //verification si tag (contient # et n'as qu'un seul mot)
        if (message.content.includes('#') && message.content.split(' ').length === 1) {
            console.log("commande #")
        }




    },
};

