const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const moment = require("moment");
const Guild = require("../../schemas/guild");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("punir")
    .setDescription("Punir um usuário")
    .addSubcommand((option) =>
      option
        .setName("ban")
        .setDescription("Banir um usuário")
        .addUserOption((option) =>
          option
            .setName("usuário")
            .setDescription("Selecione um usuário")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("motivo").setDescription("Digite um motivo")
        )
    ),

  async execute(interaction, client, args) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      interaction.reply(`Você não tem permissão para executar este comando.`);
    } else {
      const subCommands = interaction.options.getSubcommand();

      switch (subCommands) {
        case "ban":
          {
            let guildProfile = await Guild.findOne({
              guildId: interaction.guild.id,
            });

            const user = interaction.options.getUser("usuário");
            const reason =
              interaction.options.getString("motivo") || `Sem motivo`;

            const channel = client.channels.cache.get(
              guildProfile.punishMessage
            );

            if (
              !interaction.channel
                .permissionsFor(interaction.client.user)
                .has(PermissionFlagsBits.BanMembers)
            )
              return interaction.reply({
                content: `Eu preciso da permissão BAN_MEMBERS, para funcionar`,
                ephemeral: true,
              });

            if (user.id === interaction.user.id)
              return interaction.reply({
                content: `Você não pode se proprio banir.**`,
                ephemeral: true,
              });

            if (user.id === client.user.id)
              return interaction.reply({
                content: `Você não pode me banir.**`,
                ephemeral: true,
              });

            if (user.id === interaction.guild.ownerId)
              return interaction.reply({
                content: `Você não pode banir o dono do servidor.**`,
                ephemeral: true,
              });

            const memberEmbed = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `**${user.tag} foi banido com sucesso! Quem mandou quebrar as regras?!**`
              )
              .addFields(
                { name: `📜 - Motivo:`, value: `\`${reason}\`` },
                {
                  name: `🏠 - Servidor:`,
                  value: ` \`${interaction.guild.name}\``,
                },
                {
                  name: `👤 - Usuário Banido:`,
                  value: `${user.tag} - (${user.id})`,
                },
                {
                  name: `💻 - Autor do banimento:`,
                  value: `${interaction.user} - (${interaction.user.id})`,
                },
                {
                  name: `⏰ - Horário`,
                  value: `<t:${moment(
                    interaction.createdTimestamp
                  ).unix()}>(<t:${~~(
                    new Date(interaction.createdTimestamp) / 1000
                  )}:R>)`,
                }
              )
              .setThumbnail(
                interaction.user.displayAvatarURL({ dynamic: true })
              )
              .setFooter({
                text: interaction.guild.name,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
              });

            if (!guildProfile.punishMessageEnable) {
            } else {
              const banEmbed = new EmbedBuilder()
                .setColor("Blue")
                .setThumbnail(
                  user.displayAvatarURL({
                    dinamyc: true,
                    size: 2048,
                    format: "png",
                  })
                )
                .setTitle(`📢 | Novo banimento.`)
                .setFooter({
                  text: `Banido Por: ${interaction.user.tag}`,
                  iconURL: interaction.user.displayAvatarURL({ dinamyc: true }),
                })
                .addFields(
                  {
                    name: `👤 - Usuário banido:`,
                    value: `⭐ - Menção:\n${user}`,
                  },
                  {
                    name: `🏷️ - TAG:`,
                    value: `(${user.tag})`,
                  },
                  {
                    name: `🆔 - ID:`,
                    value: `(${user.id})`,
                  },
                  {
                    name: `🏠 - Servidor:`,
                    value: `(${interaction.guild.name})`,
                  },
                  {
                    name: `💻 - Autor do banimento:`,
                    value: ` ${interaction.user} - (${interaction.user.id})`,
                  },
                  {
                    name: `📜 - Motivo`,
                    value: `( ${reason} )`,
                  },
                  {
                    name: `⏰ - Horário`,
                    value: `<t:${moment(
                      interaction.createdTimestamp
                    ).unix()}>(<t:${~~(
                      new Date(interaction.createdTimestamp) / 1000
                    )}:R>)`,
                  }
                );

              interaction.guild.members
                .ban(user, { reason: [reason] })
                .then(() => {
                  channel.send({ embeds: [banEmbed] });
                })
                .catch((e) => {
                  interaction.reply({
                    content: `*Não foi possivel banir ${user}(\`${user.id}\`) do servidor**`,
                    ephemeral: true,
                  });
                });
            }

            interaction.guild.members
              .ban(user, { reason: [reason] })
              .then(() => {
                interaction.reply({
                  embeds: [memberEmbed],
                });
              });
          }
          break;

        default:
          break;
      }
    }
  },
};
