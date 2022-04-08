const dbStore = require('./dbStore')

//recup de toute une db
const getFullDb = async (db) => {
    return await dbStore[`${db}`].value()
}
//ajout user sur une table
const addUpdateUser = async (data) => {
    console.log('data:', data)
    if (!data.db.includes("day")) { return }
    if (!data.tag) { return }
    await dbStore[`${data.db}`].get(data.tag).set(data.data ? data.data : null)
    return await dbStore[`${data.db}`].save()
        .then(() => {
            return ("OK")
        }).catch(() => {
            return ("ERREUR")
        })
}
//update timestamp
const updateTimeStamp = async (data) => {
    if (!data.timeStamp) { return }
    await dbStore[`${data.db}`].get("timeStamp").set(data.timeStamp)
    return await dbStore[`${data.db}`].save()
        .then(() => {
            return ("OK")
        }).catch(() => {
            return ("ERREUR")
        })
}
//recherche du timeStamp
const getTimeStamp = async (db) => {
    return await dbStore[`${db}`].get("timeStamp").value()
}
//recherche user sur une table
const getUser = async (data) => {
    return await dbStore[`${data.db}`].get(data.tag).value()
}
//suppression user
const delUser = async (data) => {
    return await dbStore[`${data.db}`].get(data.tag).delete()
}
//ajout clan
const addUpdateClan = async (data) => {
    if (!data.tag) { return }
    await dbStore.clans.get(data.tag).set(data.data ? data.data : null)
    return await dbStore.clans.save()
        .then(() => {
            return ("OK")
        }).catch(() => {
            return ("ERREUR")
        })
}
//suppression clan
const delClan = async (tag) => {
    return await dbStore.clans.get(tag).delete()
}
//ajout config
const addConfig = async (data) => {
    if (!data.key) { return }
    await dbStore.config.get(data.key).set(data.data ? data.data : null)
    return await dbStore.config.save()
        .then(() => {
            return ("OK")
        }).catch(() => {
            return ("ERREUR")
        })
}
//suppr config
const delConfig = async (key) => {
    return await dbStore.config.get(key).delete()
}

module.exports = {
    addUpdateUser: addUpdateUser,
    getFullDb: getFullDb,
    getUser: getUser,
    delUser: delUser,
    updateTimeStamp: updateTimeStamp,
    getTimeStamp: getTimeStamp,
    addUpdateClan: addUpdateClan,
    delClan: delClan,
    addConfig: addConfig,
    delConfig: delConfig
}
