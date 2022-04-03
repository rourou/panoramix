const moment = require('moment')
/*
//librairie pour ecriture dans les fichiers
const fs = require('node:fs');
// On importe les classes nécessaire au bon fonctionnement du bot
const { Client, Collection, Intents } = require('discord.js');
//json de config
const { token, guildId } = require('./datas/config.json');
// On instancie le client Discord
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.on('ready', async () => {

    console.log("Bot online!");
    const guild = await client.guilds.cache.get(guildId);
    console.log('Found guild ', guild.name)
    const role = await guild.roles.cache.find(r => r.name === "Nouveau venu");
    console.log('Found role', role.name);
    const members = await guild.members.fetch()//[0].find(m => m.userId === '859296945804935199') //.cache.get('859296945804935199')//.map(m => m.username === 'RouGourou');//'796650034845843466');
    //console.log('members:', members)
    const foundmember = members.find(m => m.id === '859296945804935199')
    console.log('foundmember:', foundmember)


})
//login sur discord
client.login(token);
*/
const test = async () => {

}

//const { goodMorning } = require('./routines/goodMorning')
//goodMorning(client)
moment.locale('fr')
const jsonDate = {
    day: moment().date(),
    month: moment().month(),
    year: moment().year()
}
console.log(jsonDate)