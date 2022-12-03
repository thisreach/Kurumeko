const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const Guild = require("../../schemas/guild");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("autorole")
    .addSubcommand((option) =>
      option.setName("ativar").setDescription("Ativar autorole")
    )
    .addSubcommand((option) =>
      option.setName("desativar").setDescription("Desativar autorole")
    )
    .addSubcommand((option) =>
      option
        .setName("setar")
        .setDescription("Setar o cargo do autorole")
        .addRoleOption((option) =>
          option
            .setName("cargo")
            .setDescription("Selecione o cargo")
            .setRequired(true)
        )
    ),

  async execute(interaction, client, args) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      interaction.reply(`Você não tem permissão para executar este comando.`);
    } else {
      const subCommands = interaction.options.getSubcommand();

      switch (subCommands) {
        case "ativar":
          {
            let guilddb = await Guild.findOne({
              guildId: interaction.guild.id,
            });

            if (guilddb.autoRoleEnable) {
              return interaction.reply({
                content: `O autorole já se encontra ativado`,
              });
            } else {
              await Guild.updateOne(
                {
                  guildId: interaction.guild.id,
                },
                {
                  $set: {
                    autoRoleEnable: true,
                  },
                }
              );
            }

            const embed = new EmbedBuilder()
              .setTitle("**AUTOROLE ATIVADO**")
              .setDescription(`Você ativou o autorole`)
              .setColor("Green")
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              });

            await interaction.reply({
              embeds: [embed], ephemeral: true
            });
          }
          break;
        case "desativar":
          {
            let guilddb = await Guild.findOne({
              guildId: interaction.guild.id,
            });

            if (!guilddb.autoRoleEnable) {
              return interaction.reply({
                content: `O autorole já se encontra desativado`,
              });
            } else {
              await Guild.updateOne(
                {
                  guildId: interaction.guild.id,
                },
                {
                  $set: {
                    autoRoleEnable: false,
                  },
                }
              );
            }

            const embedOff = new EmbedBuilder()
              .setTitle("**AUTOROLE DESATIVADO**")
              .setDescription(`Você desativou o autorole`)
              .setColor("Red")
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              });

            await interaction.reply({
              embeds: [embedOff], ephemeral: true
            });
          }
          break;
        case "setar":
          {
            const role = interaction.options.getRole("cargo");
            await Guild.updateOne(
              {
                guildId: interaction.guild.id,
              },
              {
                $set: {
                  autoRole: `${role.id}`,
                },
              }
            );

            const embedRole = new EmbedBuilder()
              .setDescription(`Você setou ${role} no autorole`)
              .setColor("Random")
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              });

            await interaction.reply({
              embeds: [embedRole], ephemeral: true
            });
          }
          break;

        default:
          break;
      }
    }
  },
};
