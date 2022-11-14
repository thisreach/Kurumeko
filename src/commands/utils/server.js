const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Opções do server")
    .addSubcommand((option) =>
      option.setName("info").setDescription("Informações do servidor.")
    )
    .addSubcommand((option) =>
      option.setName("icon").setDescription("Server icon do servidor.")
    ),

  async execute(interaction, client, args) {
    const subcommands = interaction.options.getSubcommand();

    switch (subcommands) {
      case "info":
        {
          const members = interaction.guild.memberCount;
          const roles = interaction.guild.roles.cache.size;
          const channels = interaction.guild.channels.cache.size;
          const servers = interaction.guild;

          let chats = interaction.guild.channels.cache.filter(
            (a) => a.type === "GUILD_TEXT"
          ).size;
          let calls = interaction.guild.channels.cache.filter(
            (a) => a.type === "GUILD_VOICE"
          ).size;

          let emojis = interaction.guild.emojis.cache.size;
          let boosts = interaction.guild.premiumSubscriptionCount;
          let data = interaction.guild.createdAt.toLocaleDateString("pt-br");

          const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`${interaction.guild.name}`)
            .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
            .addFields(
              {
                name: `📌 Principais:`,
                value: `👑  <@!${interaction.guild.ownerId}>\nMembros: \`${
                  members + 1
                }\`\nImpulsos: \`${boosts}\`\nID: \`${servers.id}\``,
                inline: false,
              },
              {
                name: `💬 Canais:`,
                value: `Geral: \`${channels}\`\nChats: \`${chats}\`\nCalls: \`${calls}\``,
                inline: true,
              },
              {
                name: `💼 Cargos:`,
                value: `\`${roles}\``,
                inline: true,
              },
              {
                name: `😎 Emojis:`,
                value: `\`${emojis}\``,
                inline: true,
              },
              {
                name: `📅 Data de criação:`,
                value: `\`${data}\``,
                inline: false,
              }
            );

          await interaction.reply({
            embeds: [embed],
          });
        }
        break;

      default:
        break;
    }
  },
};
