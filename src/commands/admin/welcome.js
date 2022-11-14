const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const Guild = require("../../schemas/guild");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("welcome")
      .setDescription("Ativar ou desativar canais de boas-vindas")
      .addSubcommand((option) =>
        option.setName("ativar").setDescription("Ativar boas-vindas")
      )
      .addSubcommand((option) =>
        option.setName("desativar").setDescription("Desativar boas-vindas")
      ),
  
    async execute(interaction, client, args) {
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        interaction.reply(`Você não tem permissão para executar este comando.`);
      } else {
        const subCommands = interaction.options.getSubcommand();
  
        switch (subCommands) {
          case "ativar":
            {
              let guilddb = await Guild.findOne({
                guildId: interaction.guild.id,
              });
  
              if (guilddb.welcomeMessageEnable) {
                return interaction.reply({
                  content: `A opção de boas-vindas já se encontra ativado`,
                });
              } else {
                await Guild.updateOne(
                  {
                    guildId: interaction.guild.id,
                  },
                  {
                    $set: {
                      welcomeMessageEnable: true,
                    },
                  }
                );
              }
  
              const embed = new EmbedBuilder()
                .setTitle("**BOAS-VINDAS ATIVADO**")
                .setDescription(`Você ativou o welcome`)
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
  
              if (!guilddb.welcomeMessageEnable) {
                return interaction.reply({
                  content: `A opção de boas-vindas já se encontra desativado`,
                });
              } else {
                await Guild.updateOne(
                  {
                    guildId: interaction.guild.id,
                  },
                  {
                    $set: {
                      welcomeMessageEnable: false,
                    },
                  }
                );
              }
  
              const embedOff = new EmbedBuilder()
                .setTitle("**BOAS-VINDAS DESATIVADO**")
                .setDescription(`Você desativou o welcome`)
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
  