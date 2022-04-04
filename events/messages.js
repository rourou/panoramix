const memberCoc = require(`../datas/membersCoc.json`)

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        console.log("message", message.content, " auteur: ", message.author.username, " ID: ", message.author.id, "channelId:", message.channel.id)

        //recherche si on connais un village
        let tabWithDiscord = []
        Object.keys(memberCoc).filter((element) => {
            if (!!memberCoc[element].userDiscord && memberCoc[element].userDiscord.id !== undefined) {
                tabWithDiscord.push(memberCoc[element])
            }
        })
        const userDiscordFound = tabWithDiscord.find(element => element.userDiscord.id === '796650034845843466')
        console.log('userDiscordFound:', userDiscordFound)

        if (userDiscordFound) {
            console.log('Trouvé')
        } else {
            console.log('Non trouvé')
        }

    },
};

