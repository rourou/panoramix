const { MessageEmbed } = require('discord.js');
const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');
//json de config
const { channelEnd } = require('../datas/configBot.json');

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(member) {

        //console.log('memberAdd:', memberAdd)
        //const channelList = await member.client.channels.cache.map(channel => `${channel.id} - ${channel.name}`)
        //console.log('channelList:', channelList)

        const channel = await member.client.channels.fetch(channelEnd) //channel des departs
            .then((channel) => { return channel })
            .catch((err) => { return null })
        //console.log('channel:', channel)

        // On créé un nouveau message embarqué
        const embed = new MessageEmbed()
            .setTitle(`Au revoir !`)
            .setColor(0xffffff)
            .setDescription(`${member.user.toString()} est parti vers de nouveaux horizons`)
            .setThumbnail(member.user.displayAvatarURL())
        channel.send({ ephemeral: false, embeds: [embed] })


    },
};