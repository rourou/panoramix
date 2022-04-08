const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');
const { guildId } = require('../datas/configBot.json')

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {

        if (!interaction.isButton()) return;
        console.log("Button: ", interaction.customId, "User: ", interaction.user.username);

        if (interaction.customId.includes("command")) {
            //detail de la valeur du bouton pour extraction de la commande et options
            split = interaction.customId.split("|")
            let commandButton = {
                interaction: interaction
            }
            for (const item of split) {
                commandButton = {
                    ...commandButton,
                    [`${item.split(":")[0]}`]: item.split(":")[1]
                }
            }
            console.log('commandButton:', commandButton)
            //recuperation et envoi a la commande !!! ATTENTION bien adapté la commande a recevoir les deux interaction différentes !!!
            const command = interaction.client.commands.get(commandButton.command);
            console.log('command:', command)
            await command.execute(commandButton)
            return
        }

        //recherche des infos de la guild
        const guild = await interaction.client.guilds.cache.get(guildId);

        //recherche des roles dans la guild
        const roleNouveau = await guild.roles.cache.find(r => r.name === "Nouveau venu");
        const roleRecrue = await guild.roles.cache.find(r => r.name === "Recrue");
        const roleAllie = await guild.roles.cache.find(r => r.name === "Alliés");
        const roleFw = await guild.roles.cache.find(r => r.name === "DEFI FW");

        //recherche du membre
        const members = await guild.members.fetch()
        const member = members.find(m => m.id === interaction.user.id)
        console.log('Found member', member.username)

        switch (interaction.customId) {
            case "accept-rules":

                await member.roles.add(roleNouveau).then(res => console.log("Add role OK", res))

                const embed = new MessageEmbed()
                    .setColor('#ffffff')
                    .addFields(
                        { name: `Merci`, value: `${interaction.user.toString()}, je te donne les accès au reste du discord 😉` },
                        { name: `\u200B`, value: `Mais avant d'aller plus loin, dis moi, pourquoi nous rejoins tu ?` },
                        { name: `\u200B`, value: `Es-tu un joueur à la recherche d'un clan ?\nClique sur le bouton ${bold("Recrue")}` },
                        { name: `\u200B`, value: `Tu fais parti d un clan alliés ou tu souhaite une interaction entre ton clan et le groupe Armée D asterix ?\nClique sur le bouton ${bold("Allié")}` },
                        { name: `\u200B`, value: `Tu viens pour défier ${bold("L ARMÉE D ASTERIX")} suite à nos annonces de défi ?\nClique sur le bouton ${bold("Défi")}` },
                    )

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('role-recrue')
                            .setLabel(`Recrue`)
                            .setStyle('PRIMARY'),
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('role-allie')
                            .setLabel(`Allié`)
                            .setStyle('SUCCESS'),
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('role-fw')
                            .setLabel(`Défi`)
                            .setStyle('DANGER'),
                    );

                await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] })
                break;

            case "role-recrue":

                await member.roles.add(roleRecrue).then(res => console.log("Add role OK", res))

                const embedRecrue = new MessageEmbed()
                    .setColor('#ffffff')
                    .addFields(
                        { name: `Une Recrue`, value: `Encore Bienvenue` },
                        { name: `\u200B`, value: `Viens te présenter dans le salon présentation\ntu sera très vite contacté par l équipe ${bold("STAFF")}` },
                    )

                await interaction.reply({ ephemeral: false, embeds: [embedRecrue] })
                break;

            case "role-fw":

                await member.roles.add(roleFw).then(res => console.log("Add role OK", res))

                const embedFw = new MessageEmbed()
                    .setColor('#ffffff')
                    .addFields(
                        { name: `Un Défi`, value: `Les défis ont adore, prends garde a toi 😁` },
                        { name: `\u200B`, value: `tu sera très vite contacté par l équipe ${bold("STAFF")}` },
                    )

                await interaction.reply({ ephemeral: false, embeds: [embedFw] })
                break;

            case "role-allie":

                await member.roles.add(roleAllie).then(res => console.log("Add role OK", res))

                const embedAllie = new MessageEmbed()
                    .setColor('#ffffff')
                    .addFields(
                        { name: `Un Allié`, value: `C'est gentil de nous rendre visite` },
                        { name: `\u200B`, value: `tu sera très vite contacté par l équipe ${bold("STAFF")}` },
                    )

                await interaction.reply({ ephemeral: false, embeds: [embedAllie] })
                break;

            default:
                break;
        }

    },
};