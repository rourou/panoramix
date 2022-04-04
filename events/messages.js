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
        const userDiscordFound = tabWithDiscord.find(element => element.userDiscord.id === message.author.id)

        if (userDiscordFound) {
            console.log('User Discord Trouvé')
        } else {
            console.log('User Discord Non trouvé')
        }

    },
};

