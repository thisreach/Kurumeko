const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot")
    .setDescription("Opções da Kurumeko")
    .addSubcommand((option) =>
      option.setName("ping").setDescription("Ping do bot")
    ),

  async execute(interaction, client, args) {
    let subcommands = interaction.options.getSubcommand();

    switch (subcommands) {
      case "ping":
        {
          await interaction.reply(
            `:ping_pong: **|** **Lâtencia:** ${
              Date.now() - interaction.createdTimestamp
            }ms **Latência da API:** ${Math.round(client.ws.ping)}ms`
          );
        }

        break;

      default:
        break;
    }
  },
};
