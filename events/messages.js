const memberCoc = require(`../datas/membersCoc.json`)

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        console.log("message", message.content, " auteur: ", message.author.username, " ID: ", message.author.id, "channelId:", message.channel.id)

        //recherche si on connais un village
        const userDiscordFound = memberCoc.find((element) => element.userDiscord.id === message.author.id)

        if (userDiscordFound) {
            console.log('userDiscordFound:', !!userDiscordFound)
        } else {
            console.log('userDiscordFound:', !userDiscordFound)
        }

    },
};