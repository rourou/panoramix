//librairie pour ecriture dans les fichiers
const fs = require('node:fs');
const memberCoc = require(`../datas/membersCoc.json`)
// On importe les classes nécessaire au bon fonctionnement du bot
const { MessageEmbed } = require('discord.js');
//json de config
const { channelFlood } = require('../datas/config.json');
//api-tierces
const { getFeteDuJour } = require('../apiCalls/api-tierces')
//moment
const moment = require('moment')
moment.locale('fr')

const goodMorning = async (client) => {
    console.log("Lancement du good Morning");

    //recup de la date
    const jsonDate = {
        day: moment().date(),
        month: moment().month(),
        year: moment().year()
    }

    try {

        const channel = await client.channels.fetch(channelFlood) //id du flood
            .then((channel) => { return channel })
            .catch((err) => { return null })

        //recup fete du jour
        const dayFete = await getFeteDuJour(jsonDate)
        //console.log('dayFete:', dayFete.data)

        //recup des best de la veille
        const best = {
            donations: await findBest("donations"),
            trophies: await findBest("trophies")
        }

        // On créé un nouveau message embarqué
        const embed = new MessageEmbed()
            .setTitle(`Bonjour l'Armée d'Astérix`)
            .setColor(0xffffff)
            .addFields(
                { name: `---`, value: `Aujourd'hui nous sommes le ${dayFete.data}` }
            )
        //ajout des dons
        if (best.donations.name) {
            embed.addFields(
                { name: `Dons`, value: `Hier, ${best.donations.name} a été le meilleur donneur avec un total de ${best.donations.diff} emplacements de troupes` }
            )
        }
        //ajout des rushs
        if (best.trophies.name) {
            embed.addFields(
                { name: `Rush`, value: `Hier, ${best.trophies.name} a été le meilleur rusher avec ${best.trophies.diff} trophés gagnés` }
            )
        }
        //message de fin
        embed.addFields(
            { name: `---`, value: `😃 Je vous souhaite une excellente journée` }
        )
        console.log('embed', embed)
        //envoi du message
        channel.send({ ephemeral: false, embeds: [embed] })

        //sauvegarde du json de la veille pour comparaison demain
        let data = JSON.stringify(memberCoc, null, 2)
        await fs.writeFileSync(`./datas/membersCoc-yesterday.json`, data)


    } catch (error) {
        console.log('error:', error)
    }
}

const findBest = (variable) => {

    //on lit le JSON d'hier
    const rawdataYesterday = fs.readFileSync(`./datas/membersCoc-yesterday.json`)
    let membersCocYesterday = JSON.parse(rawdataYesterday)
    //on lit le JSON actuel
    const rawdata = fs.readFileSync(`./datas/membersCoc.json`)
    let membersCoc = JSON.parse(rawdata)
    //variable de résultat
    let best = {
        name: "",
        diff: 0
    }
    for (member in membersCoc) {
        if (member !== "timestamp") {
            //recherche sur yesterday
            try {
                const actual = membersCoc[member][variable]
                const yesterday = membersCocYesterday[member][variable]
                let diff = actual - yesterday
                if (diff > best.diff) {
                    best = {
                        name: membersCoc[member].nameCoc,
                        diff: diff
                    }
                }
            } catch (error) {
                console.log('error')
            }
        }
    }
    console.log(`best-${variable}`, best)
    return best
}
console.log(findBest("trophies"))
module.exports = {
    goodMorning: goodMorning
}