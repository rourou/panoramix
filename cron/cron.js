const cron = require('node-cron');
const { goodMorning } = require('../routines/goodMorning');
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
    //console.log('client:', client)
    // Schedule tasks to be run on the server.

    //taches au demarrage
    //goodMorning(client)
    hourly.run(client)

    //tache de mise a jour de la aaa familly toutes les heures
    cron.schedule('00 * * * *', function () {
        console.log('cron --> Maj members aaa coc');
        hourly.run(client)
    });

    //Bonjour du matin
    cron.schedule('00 06 * * *', function () { //node est deux heures en retard 6h00 est en fait 8h00 ;)
        console.log('cron --> Good morning');
        goodMorning(client)
    });
}

//EXPORT
module.exports = {
    start: start
};