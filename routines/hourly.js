const fs = require('node:fs');
const clash = require('../apiCalls/clash')
//BDD
const db = require("../datas/db");

const run = async (client) => {

    //mise a jour des infos via api
    const clanFamilly = await db.getFullDb("clans")
    for (const clanShearch in clanFamilly) {
        if (clanShearch !== "timeStamp") {
            let infosClan = await clash.getClan(clanShearch.replaceAll('#', '').toUpperCase())
            //record en bdd 
            await db.addUpdateClan({
                tag: infosClan.data.tag,
                data: {
                    infosCoc: infosClan.data
                }
            })

            if (infosClan.data) {
                console.log(`memberList start - ${infosClan.data.name}`)
                for (const member of infosClan.data.memberList) {
                    //recherche des infos du joueur
                    const infosPlayer = await clash.getPlayer(`${member.tag.replaceAll('#', '').toUpperCase()}`)
                    //recherche en bdd
                    const getUser = await db.getUser({
                        db: "dayZero",
                        tag: member.tag,
                    })
                    //record en bdd dayZero
                    await db.addUpdateUser({
                        db: "dayZero",
                        tag: member.tag,
                        data: {
                            coc: infosPlayer.data,
                            discord: getUser ? getUser.discord : null
                        }
                    })
                }
                console.log(`memberList finie - ${infosClan.data.name}`)
            }
        }
    }

    //mise a jour du timeStamp
    await db.updateTimeStamp({
        db: "dayZero",
        timeStamp: new Date()
    })
}

//EXPORT
module.exports = {
    run: run
}