module.exports = {
    data: {
        name: 'modalteste'
    },

    async execute(interaction, client){
        await interaction.reply({
            content: 'Ola buceta'
        })
    }
}