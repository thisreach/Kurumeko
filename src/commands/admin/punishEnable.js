const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const Guild = require("../../schemas/guild");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("punishmessage")
      .setDescription("Ativar ou desativar canais de boas-vindas")
      .addSubcommand((option) =>
        option.setName("ativar").setDescription("Ativar boas-vindas")
      )
      .addSubcommand((option) =>
        option.setName("desativar").setDescription("Desativar boas-vindas")
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
  
              if (guilddb.punishMessageEnable) {
                return interaction.reply({
                  content: `A opção de ban message já se encontra ativado`,
                });
              } else {
                await Guild.updateOne(
                  {
                    guildId: interaction.guild.id,
                  },
                  {
                    $set: {
                      punishMessageEnable: true,
                    },
                  }
                );
              }
  
              const embed = new EmbedBuilder()
                .setTitle("**BAN MESSAGE ATIVADO**")
                .setDescription(`Você ativou o ban message`)
                .setColor("Green")
                .setAuthor({
                  name: interaction.user.username,
                  iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                });
  
              await interaction.reply({
                embeds: [embed],
              });
            }
            break;
          case "desativar":
            {
              let guilddb = await Guild.findOne({
                guildId: interaction.guild.id,
              });
  
              if (!guilddb.punishMessageEnable) {
                return interaction.reply({
                  content: `A opção de ban message já se encontra desativado`,
                });
              } else {
                await Guild.updateOne(
                  {
                    guildId: interaction.guild.id,
                  },
                  {
                    $set: {
                      punishMessageEnable: false,
                    },
                  }
                );
              }
  
              const embedOff = new EmbedBuilder()
                .setTitle("**BAN MESSAGE DESATIVADO**")
                .setDescription(`Você desativou o ban message`)
                .setColor("Red")
                .setAuthor({
                  name: interaction.user.username,
                  iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                });
  
              await interaction.reply({
                embeds: [embedOff],
              });
            }
            break;
  
          default:
            break;
        }
      }
    },
  };
  