//recup librairie
const StormDB = require("stormdb");
//recuperation de tous les fichiers db
const fileDayZero = new StormDB.localFileEngine("./datas/dbs/dayZero.json", { async: true })
const fileDayOne = new StormDB.localFileEngine("./datas/dbs/dayOne.json", { async: true })
const fileDayTwo = new StormDB.localFileEngine("./datas/dbs/dayTwo.json", { async: true })
const fileDayThree = new StormDB.localFileEngine("./datas/dbs/dayThree.json", { async: true })
const fileDayFour = new StormDB.localFileEngine("./datas/dbs/dayFour.json", { async: true })
const fileDayFive = new StormDB.localFileEngine("./datas/dbs/dayFive.json", { async: true })
const fileDaySix = new StormDB.localFileEngine("./datas/dbs/daySix.json", { async: true })
const fileDaySeven = new StormDB.localFileEngine("./datas/dbs/daySeven.json", { async: true })
const fileDayEight = new StormDB.localFileEngine("./datas/dbs/dayEight.json", { async: true })
const fileDayNine = new StormDB.localFileEngine("./datas/dbs/dayNine.json", { async: true })
const fileDayTen = new StormDB.localFileEngine("./datas/dbs/dayTen.json", { async: true })
const fileClans = new StormDB.localFileEngine("./datas/dbs/clans.json", { async: true })
//initialisation des db
const dbDayZero = new StormDB(fileDayZero);
const dbDayOne = new StormDB(fileDayOne);
const dbDayTwo = new StormDB(fileDayTwo);
const dbDayThree = new StormDB(fileDayThree);
const dbDayFour = new StormDB(fileDayFour);
const dbDayFive = new StormDB(fileDayFive);
const dbDaySix = new StormDB(fileDaySix);
const dbDaySeven = new StormDB(fileDaySeven);
const dbDayEight = new StormDB(fileDayEight);
const dbDayNine = new StormDB(fileDayNine);
const dbDayTen = new StormDB(fileDayTen);
const dbClans = new StormDB(fileClans);

// set default db value if db is empty
const initDbs = async () => {

    await dbDayZero.default({ timeStamp: new Date() })
    await dbDayZero.save()

    await dbDayOne.default({ timeStamp: new Date() })
    await dbDayOne.save()

    await dbDayTwo.default({ timeStamp: new Date() })
    await dbDayTwo.save()

    await dbDayThree.default({ timeStamp: new Date() })
    await dbDayThree.save()

    await dbDayFour.default({ timeStamp: new Date() })
    await dbDayFour.save()

    await dbDayFive.default({ timeStamp: new Date() })
    await dbDayFive.save()

    await dbDaySix.default({ timeStamp: new Date() })
    await dbDaySix.save()

    await dbDaySeven.default({ timeStamp: new Date() })
    await dbDaySeven.save()

    await dbDayEight.default({ timeStamp: new Date() })
    await dbDayEight.save()

    await dbDayNine.default({ timeStamp: new Date() })
    await dbDayNine.save()

    await dbDayTen.default({ timeStamp: new Date() })
    await dbDayTen.save()

    await dbClans.default({ timeStamp: new Date() })
    await dbClans.save()
}
//init de la DB si vide
initDbs()

//export du store de databases
module.exports = {
    dayZero: dbDayZero,
    dayOne: dbDayOne,
    dayTwo: dbDayTwo,
    dayThree: dbDayThree,
    dayFour: dbDayFour,
    dayFive: dbDayFive,
    daySix: dbDaySix,
    daySeven: dbDaySeven,
    dayEight: dbDayEight,
    dayNine: dbDayNine,
    dayTen: dbDayTen,
    clans: dbClans
}