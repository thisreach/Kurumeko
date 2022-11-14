const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Veja a ping do client"),

  async execute(interaction, client, args) {

    await interaction.reply({
      content: `Meu ping é de ${client.ws.ping}`
    })

  },
};
