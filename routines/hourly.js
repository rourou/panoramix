const fs = require('node:fs');
const clash = require('../apiCalls/clash')
const clans = require('../datas/clans.json')
const memberCoc = require(`../datas/membersCoc.json`)
//moment
const moment = require('moment')
moment.locale('fr')

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const getRandomNoDiscord = () => {
    let tab = []
    for (const member in memberCoc) {
        if (member !== "timeStamp") {

            if (memberCoc[member].userDiscord) {
                if (!memberCoc[member].userDiscord.username) {
                    tab.push(memberCoc[member])
                }
            } else {
                tab.push(memberCoc[member])
            }
        }
    }
    let randomNumber = getRandomInt(tab.length)
    let userRandom = tab[randomNumber]
    return userRandom

}

const run = async (client) => {

    let members = memberCoc

    //recup de la date
    const jsonDate = {
        day: moment().date(),
        month: moment().month(),
        year: moment().year()
    }

    //recherche d'un membre aléatoirement
    const userNoDiscordRandom = await getRandomNoDiscord()
    console.log('userNoDiscordRandom:', userNoDiscordRandom)
    //envoi msg si trouvé
    // if (userNoDiscordRandom) {
    //     //recuperation et envoi a la commande !!! ATTENTION bien adapté la commande a recevoir les deux interaction différentes !!!
    //     const command = client.commands.get("lien");
    //     await command.execute({
    //         client: client,
    //         action: "demande",
    //         tag: userNoDiscordRandom.tagCoc,
    //         channel: "flood",
    //         user: 'N/A',
    //         commandInterne: true
    //     })
    // }

    //mise a jour des infos via api
    for (const clanShearch in clans) {

        let infosClan = await clash.getClan(clans[clanShearch].tag)

        if (infosClan.data) {
            console.log('memberList start')
            for (const member of infosClan.data.memberList) {
                //recherche des infos du joueur
                const infosPlayer = await clash.getPlayer(`${member.tag.replaceAll('#', '').toUpperCase()}`)
                //console.log('nameCoc:', member.name)
                members = {
                    ...members,
                    [member.tag]: {
                        ...members[member.tag],
                        nameCoc: member.name,
                        tagCoc: member.tag,
                        donations: member.donations,
                        trophies: member.trophies,
                        defenseWins: infosPlayer.data.defenseWins,
                        attackWins: infosPlayer.data.attackWins
                    }
                }
            }
            console.log('memberList finie')
        }
    }

    //ajout du timestamp
    members = {
        ...members,
        timeStamp: jsonDate
    }
    //ecriture dans le json de cache
    let data = JSON.stringify(members, null, 2)
    await fs.writeFileSync(`./datas/membersCoc.json`, data)
}

//EXPORT
module.exports = {
    run: run
}
