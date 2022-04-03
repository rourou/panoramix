const cron = require('../cron/cron.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
        //lancement des taches crons
        cron.start(client)
        console.log(`PANORAMIX EST PRET (${new Date().toISOString()})`)
    },
};