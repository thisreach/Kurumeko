const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Veja a ping do client"),

  async execute(interaction, client, args) {

    await interaction.reply(
      `:ping_pong: **|** **Lâtencia:** ${
        Date.now() - interaction.createdTimestamp
      }ms **Latência da API:** ${Math.round(client.ws.ping)}ms`
    );

  },
};
