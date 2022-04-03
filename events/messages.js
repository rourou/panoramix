module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        console.log("message", message.content, " auteur: ", message.author.username, " ID: ", message.author.id, "channelId:", message.channel.id)
    },
};