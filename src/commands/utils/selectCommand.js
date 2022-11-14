const { SlashCommandBuilder, SelectMenuBuilder, ActionRowBuilder, SelectMenuOptionBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("teste")
    .setDescription("Teste"),

  async execute(interaction, client, args) {

    const menu = new SelectMenuBuilder()
    .setCustomId('teste')
    .setMinValues(1)
    .setMaxValues(1)
    .setOptions(new SelectMenuOptionBuilder({
        label: 'Opa',
        value: 'Hello carai'
    }))

    await interaction.reply({
        components: [new ActionRowBuilder().addComponents(menu)]
    })

  },
};
