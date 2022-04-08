//json de config
const { channelFlood } = require('../datas/configBot.json');
// On importe les classes nécessaire au bon fonctionnement du bot
const { MessageEmbed } = require('discord.js');

const run = async (client) => {

    const channel = await client.channels.fetch(channelFlood) //id du flood
        .then((channel) => { return channel })
        .catch((err) => { return null })

    // On créé un nouveau message embarqué
    const embed = new MessageEmbed()
        .setTitle(`Fin de semaine`)
        .setColor(0xffffff)
        .addFields(
            { name: `---`, value: `Reposez vous les guerriers une autre semaine pleine d'aventures vous attends` }
        )

    //envoi du message
    //console.log('embed:', embed)
    channel.send({ ephemeral: false, embeds: [embed] })

}

module.exports = {
    run: run
}