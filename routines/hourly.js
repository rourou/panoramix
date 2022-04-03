const fs = require('node:fs');
const clash = require('../apiCalls/clash')
const clans = require('../datas/clans.json')
const memberCoc = require(`../datas/membersCoc.json`)
//moment
const moment = require('moment')
moment.locale('fr')

const run = async (client) => {

    let members = memberCoc

    //recup de la date
    const jsonDate = {
        day: moment().date(),
        month: moment().month(),
        year: moment().year()
    }

    //recherche d'un membre aléatoirement
    let membersArray = Object.keys(members)
    let random = getRandomInt(membersArray.length)
    console.log('random', random, "/", membersArray.length)
    let userRandom = members[membersArray[random]]
    console.log('userRandom', userRandom)
    //envoi d'un message si pas de user discord
    // if (!!userRandom.userDiscord && !!userRandom.userDiscord.username) {
    //     //recuperation et envoi a la commande !!! ATTENTION bien adapté la commande a recevoir les deux interaction différentes !!!
    //     const command = client.commands.get("lien");
    //     await command.execute({
    //         command: "lien",
    //         action: "demande",
    //         tag: userRandom.tagCoc,
    //         client: client
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
                console.log('nameCoc:', member.name)
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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}