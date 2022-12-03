const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot")
    .setDescription("Veja alguns comandos do bot")
    .addSubcommand((option) =>
      option.setName("info").setDescription("Veja as informações sobre o bot.")
    ),

  async execute(interaction, client, args) {
    const owner = "Reach#4864";
    const language = "JavaScript";
    const members = client.users.cache.size;
    const servers = client.guilds.cache.size;
    const channels = client.channels.cache.size;

    const embed = new EmbedBuilder().setColor("Blue").setFields(
      {
        name: "Dono",
        value: `\`${owner}\``,
        inline: true,
      },
      {
        name: "Linguagem",
        value: `\`${language}\``,
        inline: true,
      },
      {
        name: "Membros",
        value: `\`${members}\``,
        inline: true,
      },
      {
        name: "Servidores",
        value: `\`${servers}\``,
        inline: true,
      },
      {
        name: "Canais",
        value: `\`${channels}\``,
        inline: true,
      }
    );

    await interaction.reply({
      embeds: [embed],
    });
  },
};
