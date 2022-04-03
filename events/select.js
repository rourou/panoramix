module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {

        //console.log('interaction:', interaction)
        if (!interaction.isSelectMenu()) return;
        console.log('select.commandName:', interaction.message.interaction.commandName)
        console.log('SelectMenu.values:', interaction.values)
        const command = interaction.client.commands.get(interaction.message.interaction.commandName === "panoramix" ? interaction.values[0] : interaction.message.interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `Il y a eu une erreur a l'execution de cette commande!`, ephemeral: true });
        }


    },
};