const cron = require('node-cron');
const goodMorning = require('../routines/goodMorning');
const sunday = require('../routines/sunday');
const hourly = require('../routines/hourly');

/*
  * * * * *
  | | | | |
  | | | | day of week
  | | | month
  | | day of month
  | hour
  minute
*/

function start(client) {
    console.log('START CRON')

    //taches au demarrage
    //goodMorning(client)
    hourly.run(client)

    //tache de mise a jour de la aaa familly toutes les heures
    cron.schedule('00,30 * * * *', function () {
        console.log('cron --> Maj members aaa coc');
        hourly.run(client)
    });

    //Bonjour du matin
    cron.schedule('00 08 * * *', function () {
        console.log('cron --> Good morning');
        goodMorning.run(client)
    });

    //Message du dimanche Soir
    cron.schedule('00 20 * * sunday', function () {
        console.log('cron --> Message du Dimanche');
        sunday.run(client)
    });
}

//EXPORT
module.exports = {
    start: start
};