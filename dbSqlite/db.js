const sqlite3 = require('sqlite3').verbose();
const dbToday = new sqlite3.Database('./dbSqlite/dbToday.sqlite');
const dbYesterday = new sqlite3.Database('./dbSqlite/dbYesterday.sqlite');

//creation de la table si elle n'existe pas
const verifExist = () => {
    dbToday.serialize(function () {
        dbToday.run("CREATE TABLE if not exists users (tag TEXT, discord TEXT, coc TEXT)");
    });
    dbYesterday.serialize(function () {
        dbYesterday.run("CREATE TABLE if not exists users (tag TEXT, discord TEXT, coc TEXT)");
    });
}

//enregistrement dans la table
const addUser = (data) => {
    const insert = dbToday.prepare(`INSERT INTO users (tag, coc, discord) VALUES (@tag, @coc, @discord)`)
    insert.run(data.tag, JSON.stringify(data.coc), JSON.stringify(data.discord))
    insert.finalize()
}

//recherche dans la table
const foundChargeIdInDb = async (id) => {
    return await new Promise((resolve, reject) => {
        db.get(`SELECT rowid AS id, chargeId, event, date FROM charges where chargeId='${id}'`, (err, row) => {
            //console.log('row:', row)
            if (err) {
                reject(null)
            } else {
                resolve(row)
            }
        })
    })
}

//recup de toute la table
const recupDb = async () => {
    return await new Promise((resolve, reject) => {
        dbToday.all(`SELECT rowid AS id, tag, coc, discord FROM users`, (err, rows) => {
            console.log('rows:', rows)
            if (err) {
                reject(null)
            } else {
                resolve(rows)
            }
        })
    })
}

//suppression dans la table
const deleteChargeIdInDb = async (id) => {
    return await new Promise((resolve, reject) => {
        try {
            db.get(`DELETE FROM charges where chargeId='${id}'`, (err) => {
                if (err) {
                    reject("err:", err)
                } else {
                    resolve("OK")
                }
            })
        } catch (error) {
            console.log('error:', error)
            reject("error:", error)
        }
    })
}

module.exports = {
    addUser: addUser,
    foundChargeIdInDb: foundChargeIdInDb,
    deleteChargeIdInDb: deleteChargeIdInDb,
    recupDb: recupDb
}
//creation au demarrage si elle n'existe pas
verifExist()
//affichage de toutes les entrées au démarrage
const testRecupDb = async () => {
    console.log("users in BDD : ", await recupDb())
}
testRecupDb()

// EXEMPLES
addUser({
    tag: `#${Math.floor(Math.random() * 1000)}`,
    coc: {
        name: "test",
        info: "testtttt"
    },
    discord: ""
})

/*
const testFound = async () => {
    console.log(await foundChargeIdInDb("id984"))
}
testFound()

const deleteCharge = async () => {
    console.log(await deleteChargeIdInDb("ch_3Kj3TLBLsf1gq6zz0y53pgxTfgfgfg"))
}
deleteCharge()
*/