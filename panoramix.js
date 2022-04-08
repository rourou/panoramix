//librairie pour ecriture dans les fichiers
const fs = require('node:fs');
// On importe les classes nécessaire au bon fonctionnement du bot
const { Client, Collection, Intents } = require('discord.js');
//json de config
const { token } = require('./datas/configBot.json');
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
/*###########################################################################################################################################################*/
//deploy commands
const { deployCommands } = require('./deploy-commands')
const launchDeploy = async () => {
    await deployCommands()
}
launchDeploy()
/*###########################################################################################################################################################*/
//initialisation des commandes
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}
/*###########################################################################################################################################################*/
//initialisations des events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
/*###########################################################################################################################################################*/

//login sur discord
client.login(token);