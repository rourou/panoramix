module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {


        //console.log('interaction:', interaction)
        if (!interaction.isCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);
        console.log('interaction.commandName:', interaction.commandName)
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `Il y a eu une erreur a l'execution de cette commande!`, ephemeral: true });
        }


    },
};