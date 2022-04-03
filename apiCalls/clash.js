
const fs = require('fs')
const Axios = require('axios')
const tokenClash = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImYxOGI1NzlhLTg0YjktNGRmYi05Y2JjLTZhNTM3MWFmYjlhMSIsImlhdCI6MTY0NTI5MDE3OCwic3ViIjoiZGV2ZWxvcGVyLzYyZGRkOGE0LWFkMjgtZWVmNi01MTEwLWFlZGUyNjllMDBmMSIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjgyLjY2LjE0Ny4yNiJdLCJ0eXBlIjoiY2xpZW50In1dfQ.fMqB4bxkxXgnucnDvFIatEI67D7BxhxWENdG0hXk_DOBw3g-3n-474HGE539QTRieBDwgei2uylZ8hSQfMu6Yg"

//get joueur
async function getClan(tag) {

    const url = `https://api.clashofclans.com/v1/clans/%23${tag}`
    const infoClan = await Axios.get(
        url,
        {
            headers: {
                "Authorization": `Bearer ${tokenClash}`
            }
        }).then((result) => {
            return ({
                data: result.data,
                statusCode: 200
            })
        }).catch((error) => {
            console.log('error:', error)
            return ({
                data: "N/A",
                statusCode: 400
            })
        })
    return (infoClan);
}

//get joueur
async function getPlayer(tag) {

    const url = `https://api.clashofclans.com/v1/players/%23${tag}`
    const infoPlayer = await Axios.get(
        url,
        {
            headers: {
                "Authorization": `Bearer ${tokenClash}`
            }
        }).then((result) => {
            return ({
                data: result.data,
                statusCode: 200
            })
        }).catch((error) => {
            console.log('error:', error)
            return ({
                data: "N/A",
                statusCode: 400
            })
        })
    return (infoPlayer);
}

//mise a jour aaa family
async function majAaa() {

    //declaration des variables
    let aaaFamily
    let familyTag =
    {
        "armee": "2JQ82LG",
        "asterix": "yv902cu",
        "alpah-corp": "2LYU98Q2"
    }

    //parcours de tout les tag
    for (let tag in familyTag) {
        console.log('###### Recup infos Clan:', tag, ' ######')

        players = {}
        infoClan = {}
        //recup des infos du clan
        let getInfoClan = await getClan(familyTag[tag])
        //si pas d'erreur
        if (getInfoClan.statusCode == 200) {
            //parcours de tout les membres pour recup des infos plus precises
            for (let member of getInfoClan.data.memberList) {
                console.log('-->', member.name)
                const tagMember = member.tag.split('#')
                const temp = await getPlayer(tagMember[1])
                players = {
                    ...players,
                    [member.tag]: temp.data
                }
            }
            //envoi dans le resultat de clan
            infoClan = {
                ...getInfoClan.data,
                memberList: players
            }
            //ecriture dans le json de fin
            aaaFamily = {
                ...aaaFamily,
                [tag]: infoClan
            }
        }

    }
    //ajout de la date
    aaaFamily = {
        ...aaaFamily,
        Maj: new Date()
    }
    //ecriture dans le json de cache
    let data = JSON.stringify(aaaFamily, null, 2)
    await fs.writeFileSync(`./data/aaa-family.json`, data)

    console.log('AAA familly mise a jour')

}

//EXPORT
module.exports = {
    getClan: getClan,
    getPlayer: getPlayer,
    majAaa: majAaa
};