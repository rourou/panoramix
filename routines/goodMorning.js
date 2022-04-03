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

        //recup des podium de la veille
        const podiums = {
            donations: await podium("donations"),
            trophies: await podium("trophies"),
            defenseWins: await podium("defenseWins"),
            attackWins: await podium("attackWins"),
        }

        // On créé un nouveau message embarqué
        const embed = new MessageEmbed()
            .setTitle(`Bonjour l'Armée d'Astérix`)
            .setColor(0xffffff)
            .addFields(
                { name: `---`, value: `Aujourd'hui nous sommes le ${dayFete.data}` }
            )
        //ajout des dons
        if (podiums.donations[0].name && podiums.donations[1].name && podiums.donations[2].name) {
            const stringDons = [
                `1- ${podiums.donations[0].name} avec ${podiums.donations[0].diff} troupes`,
                `2- ${podiums.donations[1].name} avec ${podiums.donations[1].diff} troupes`,
                `3- ${podiums.donations[2].name} avec ${podiums.donations[2].diff} troupes`
            ]
            embed.addFields(
                { name: `Bravo aux meilleurs donneurs`, value: stringDons.join("\n") }
            )
        }
        //ajout des rushs
        if (podiums.trophies[0].name && podiums.trophies[1].name && podiums.trophies[2].name) {
            const stringRush = [
                `1- ${podiums.trophies[0].name} avec ${podiums.trophies[0].diff} trophés gagnés`,
                `2- ${podiums.trophies[1].name} avec ${podiums.trophies[1].diff} trophés gagnés`,
                `3- ${podiums.trophies[2].name} avec ${podiums.trophies[2].diff} trophés gagnés`
            ]
            embed.addFields(
                { name: `Bravo aux meilleurs rushers`, value: stringRush.join("\n") }
            )
        }
        //ajout des attaques
        if (podiums.attackWins[0].name && podiums.attackWins[1].name && podiums.attackWins[2].name) {
            const stringAtk = [
                `1- ${podiums.attackWins[0].name} avec ${podiums.attackWins[0].diff} attaques gagnés`,
                `2- ${podiums.attackWins[1].name} avec ${podiums.attackWins[1].diff} attaques gagnés`,
                `3- ${podiums.attackWins[2].name} avec ${podiums.attackWins[2].diff} attaques gagnés`
            ]
            embed.addFields(
                { name: `Bravo aux meilleurs attaquants`, value: stringAtk.join("\n") }
            )
        }
        //ajout des défenses
        if (podiums.defenseWins[0].name && podiums.defenseWins[1].name && podiums.defenseWins[2].name) {
            const stringDef = [
                `1- ${podiums.defenseWins[0].name} avec ${podiums.defenseWins[0].diff} attaques gagnés`,
                `2- ${podiums.defenseWins[1].name} avec ${podiums.defenseWins[1].diff} attaques gagnés`,
                `3- ${podiums.defenseWins[2].name} avec ${podiums.defenseWins[2].diff} attaques gagnés`
            ]
            embed.addFields(
                { name: `Bravo aux meilleurs défenseurs`, value: stringDef.join("\n") }
            )
        }
        //message de fin
        embed.addFields(
            { name: `---`, value: `😃 Je vous souhaite une excellente journée` }
        )

        //envoi du message
        channel.send({ ephemeral: false, embeds: [embed] })

        //sauvegarde du json de la veille pour comparaison demain si pas le meme jour que aujourdui sur le timestamp
        const rawdataYesterday = fs.readFileSync(`./datas/membersCoc-yesterday.json`)
        let membersCocYesterday = JSON.parse(rawdataYesterday)
        const jsonDateTimeStamp = membersCocYesterday.timeStamp
        if (jsonDateTimeStamp.day !== jsonDate.day || jsonDateTimeStamp.month !== jsonDate.month || jsonDateTimeStamp.year !== jsonDate.year) {
            console.log("écriture yesterday")
            let data = JSON.stringify(memberCoc, null, 2)
            await fs.writeFileSync(`./datas/membersCoc-yesterday.json`, data)
        }

    } catch (error) {
        console.log('error:', error)
    }
}

const podium = async (variable) => {
    //on lit le JSON d'hier
    const rawdataYesterday = fs.readFileSync(`./datas/membersCoc-yesterday.json`)
    let membersCocYesterday = JSON.parse(rawdataYesterday)
    //on lit le JSON actuel
    const rawdata = fs.readFileSync(`./datas/membersCoc.json`)
    let membersCoc = JSON.parse(rawdata)

    //construction d'un tableau avec la diff yesterday <-> aujourd'hui
    let tab = []
    for (member in membersCoc) {
        if (member !== "timestamp") {
            //recherche sur yesterday
            try {
                //recherche de la valeur actuelle
                const actual = membersCoc[member][variable]
                //recherche de la valeur d'hier si erreur mettre a actual pour diff a 0
                let yesterday
                try {
                    yesterday = membersCocYesterday[member][variable]
                } catch (error) {
                    yesterday = 0
                }
                //si yesterday est supérieur a aujourd'hui (début de ligue) -> yesterday a 0 mise de coté des trophés ou l'on peut descendre
                if (yesterday > actual && variable !== "trophies") {
                    yesterday = 0
                }
                //si pas de yesterday on le met a 0
                if (!yesterday) {
                    yesterday = 0
                }
                //calcul de la diff
                let diff = actual - yesterday
                //mise en tableau
                tab.push({
                    name: membersCoc[member].nameCoc,
                    diff: diff
                })
            } catch (error) {
                console.log('error', error)
            }
        }
    }
    //tri du tableau en fonction de la diff
    tab.sort((a, b) => b.diff - a.diff);
    //console.log("podium", variable, tab.slice(0, 3))
    return (variable, tab.slice(0, 3))
}

module.exports = {
    goodMorning: goodMorning
}