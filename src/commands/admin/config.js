const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  SelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  SelectMenuOptionBuilder,
} = require("discord.js");
const Guild = require("../../schemas/guild");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Mandar o registro para o canal")
    .addSubcommandGroup((option) =>
      option
        .setName("register")
        .setDescription("Configurar os cargos de registro")
        .addSubcommand((option) =>
          option
            .setName("masculino")
            .setDescription("Configure o cargo masculino")
            .addRoleOption((option) =>
              option
                .setName("boyrole")
                .setDescription("Cargo masculino")
                .setRequired(true)
            )
        )
        .addSubcommand((option) =>
          option
            .setName("feminino")
            .setDescription("Configure o cargo feminino")
            .addRoleOption((option) =>
              option
                .setName("girlrole")
                .setDescription("Cargo feminino")
                .setRequired(true)
            )
        )
        .addSubcommand((option) =>
          option
            .setName("gay")
            .setDescription("Configure o cargo gay")
            .addRoleOption((option) =>
              option
                .setName("gayrole")
                .setDescription("Selecione o cargo não binario")
                .setRequired(true)
            )
        )
        .addSubcommand((option) =>
          option
            .setName("adulto")
            .setDescription("Configure o cargo adulto")
            .addRoleOption((option) =>
              option
                .setName("adultrole")
                .setDescription("Selecione o cargo +18")
                .setRequired(true)
            )
        )
        .addSubcommand((option) =>
          option
            .setName("criança")
            .setDescription("Configure o cargo criança")
            .addRoleOption((option) =>
              option
                .setName("babyrole")
                .setDescription("Selecione o cargo -18")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((option) =>
      option
        .setName("canais")
        .setDescription("Configuração de canais")
        .addSubcommand((option) =>
          option
            .setName("ticket")
            .setDescription("Enviar o ticket")
            .addChannelOption((option) =>
              option.setName("canal").setDescription("Selecione o canal")
            )
        )
        .addSubcommand((option) =>
          option
            .setName("genero")
            .setDescription("Mandar o registro de genero")
            .addChannelOption((option) =>
              option.setName("canal").setDescription("Selecione o canal")
            )
        )
        .addSubcommand((option) =>
          option
            .setName("idade")
            .setDescription("Mandar o registro de idade")
            .addChannelOption((option) =>
              option.setName("canal").setDescription("Selecione o canal")
            )
        )
        .addSubcommand((option) =>
          option
            .setName("welcome")
            .setDescription("Selecionar o canal de mensagem de entrada")
            .addChannelOption((option) =>
              option.setName("canal").setDescription("Selecione o canal")
            )
        )
        .addSubcommand((option) =>
          option
            .setName("punish")
            .setDescription("Selecionar o canal de mensagem de banimento")
            .addChannelOption((option) =>
              option.setName("canal").setDescription("Selecione o canal")
            )
        )
    ),

  async execute(interaction, client, args) {
    const subCommand = interaction.options.getSubcommand();

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      interaction.reply({
        content: `Você não possui permissão para utilzar este comando!`,
        ephemeral: true,
      });
    } else {
      switch (subCommand) {
        case "masculino":
          {
            const role = interaction.options.getRole("boyrole");
            await Guild.updateOne(
              {
                guildId: interaction.guild.id,
              },
              {
                $set: {
                  roleBoy: `${role.id}`,
                },
              }
            );

            const embed = new EmbedBuilder()
              .setDescription(`Você setou ${role} no registro masculino`)
              .setColor("Random")
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              });

            await interaction.reply({
              embeds: [embed],
            });
          }
          break;
        case "feminino":
          {
            const role = interaction.options.getRole("girlrole");
            await Guild.updateOne(
              {
                guildId: interaction.guild.id,
              },
              {
                $set: {
                  roleGirl: `${role.id}`,
                },
              }
            );

            const embed = new EmbedBuilder()
              .setDescription(`Você setou ${role} no registro feminino`)
              .setColor("Random")
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              });

            await interaction.reply({
              embeds: [embed],
            });
          }
          break;
        case "gay":
          {
            const role = interaction.options.getRole("gayrole");
            await Guild.updateOne(
              {
                guildId: interaction.guild.id,
              },
              {
                $set: {
                  roleGay: `${role.id}`,
                },
              }
            );

            const embed = new EmbedBuilder()
              .setDescription(`Você setou ${role} no registro não binario`)
              .setColor("Random")
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              });

            await interaction.reply({
              embeds: [embed],
            });
          }
          break;
        case "adulto":
          {
            const role = interaction.options.getRole("adultrole");
            await Guild.updateOne(
              {
                guildId: interaction.guild.id,
              },
              {
                $set: {
                  roleAdult: `${role.id}`,
                },
              }
            );

            const embed = new EmbedBuilder()
              .setDescription(`Você setou ${role} no registro adulto`)
              .setColor("Random")
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              });

            await interaction.reply({
              embeds: [embed],
            });
          }
          break;
        case "criança":
          {
            const role = interaction.options.getRole("babyrole");
            await Guild.updateOne(
              {
                guildId: interaction.guild.id,
              },
              {
                $set: {
                  roleBaby: `${role.id}`,
                },
              }
            );

            const embed = new EmbedBuilder()
              .setDescription(`Você setou ${role} no registro criança`)
              .setColor("Random")
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              });

            await interaction.reply({
              embeds: [embed],
            });
          }
          break;
        case "ticket":
          {
            if (
              !interaction.member.permissions.has(
                PermissionFlagsBits.ManageGuild
              )
            ) {
              interaction.reply({
                content: `Você não possui permissão para utilzar este comando!`,
                ephemeral: true,
              });
            } else {
              const channel =
                interaction.options.getChannel("canal") || interaction.channel;

              const embed = new EmbedBuilder()
                .setColor("Blue")
                .setAuthor({
                  name: interaction.guild.name,
                  iconURL: interaction.guild.iconURL({ dynamic: true }),
                })
                .setThumbnail(interaction.guild.iconURL({ size: 1024 }))
                .setTitle(`🎫 **|** Ticket`)
                .setDescription(
                  "Clique no botão abaixo para abrir um ticket.\n \n`O mal uso dos tickets pode resultar em futuras punições.`"
                );

              const menu = new SelectMenuBuilder()
                .setCustomId("ticket")
                .setMinValues(1)
                .setMaxValues(1)
                .setOptions(
                  new SelectMenuOptionBuilder({
                    label: "🙋‍♂️ | Suporte Geral",
                    description: "Abra um ticket na categoria Suporte Geral ",
                    value: "suport",
                  }),
                  new SelectMenuOptionBuilder({
                    label: "⛔ | Denúncia",
                    description: "Abra um ticket para fazer uma denúncia ",
                    value: "report",
                  })
                );

              const rowBuilder = new ActionRowBuilder().addComponents(menu);

              await channel.send({
                embeds: [embed],
                components: [rowBuilder],
              });
            }
          }
          break;
        case "genero":
          {
            if (
              !interaction.member.permissions.has(
                PermissionFlagsBits.ManageGuild
              )
            ) {
              interaction.reply({
                content: `Você não possui permissão para utilzar este comando!`,
                ephemeral: true,
              });
            } else {
              const channel =
                interaction.options.getChannel("canal") || interaction.channel;

              let guildProfile = await Guild.findOne({
                guildId: interaction.guild.id,
              });

              const embed = new EmbedBuilder()
                .setTitle("🧬 **__Gênero__**")
                .setDescription(
                  `
                🚹 ${interaction.guild.roles.cache.get(guildProfile.roleBoy)} 
                🚺 ${interaction.guild.roles.cache.get(guildProfile.roleGirl)}
                🚫 ${interaction.guild.roles.cache.get(guildProfile.roleGay)}`
                )
                .setFooter({
                  text: client.user.tag,
                  IconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp(new Date())
                .setThumbnail(
                  "https://cdn.discordapp.com/attachments/978378624828854363/981559746911940609/Genero.png"
                );

              const buttonBoy = new ButtonBuilder()
                .setCustomId("boy")
                .setLabel(`Menino`)
                .setStyle(ButtonStyle.Primary);

              const buttonGirl = new ButtonBuilder()
                .setCustomId("girl")
                .setLabel(`Menina`)
                .setStyle(ButtonStyle.Danger);

              const buttonGay = new ButtonBuilder()
                .setCustomId("gay")
                .setLabel(`Não binario`)
                .setStyle(ButtonStyle.Secondary);

              const buttonSend = new ActionRowBuilder().addComponents(
                buttonBoy,
                buttonGirl,
                buttonGay
              );

              await channel.send({
                embeds: [embed],
                components: [buttonSend],
              });

              await interaction.reply({
                content: `Enviei o registro de gênero no ${channel}`,
              });
            }
          }
          break;
        case "idade":
          {
            if (
              !interaction.member.permissions.has(
                PermissionFlagsBits.ManageGuild
              )
            ) {
              interaction.reply({
                content: `Você não possui permissão para utilzar este comando!`,
                ephemeral: true,
              });
            } else {
              const channel =
                interaction.options.getChannel("canal") || interaction.channel;

              let guildProfile = await Guild.findOne({
                guildId: interaction.guild.id,
              });

              const embed = new EmbedBuilder()
                .setTitle("🧬 **__Idade__**")
                .setDescription(
                  `
                🍻 ${interaction.guild.roles.cache.get(guildProfile.roleAdult)} 
                🔞 ${interaction.guild.roles.cache.get(guildProfile.roleBaby)}`
                )
                .setFooter({
                  text: client.user.tag,
                  IconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp(new Date());

              const adultButton = new ButtonBuilder()
                .setCustomId("adult")
                .setLabel(`+18`)
                .setStyle(ButtonStyle.Secondary);

              const babyButton = new ButtonBuilder()
                .setCustomId("baby")
                .setLabel(`-18`)
                .setStyle(ButtonStyle.Primary);

              const buttonSend = new ActionRowBuilder().addComponents(
                adultButton,
                babyButton
              );

              await channel.send({
                embeds: [embed],
                components: [buttonSend],
              });

              await interaction.reply({
                content: `Enviei o registro de idade no ${channel}`,
              });
            }
          }
          break;
        case "welcome":
          {
            const channel =
              interaction.options.getChannel("canal") || interaction.channel;

            await Guild.updateOne(
              {
                guildId: interaction.guild.id,
              },
              {
                $set: {
                  welcomeMessage: `${channel.id}`,
                },
              }
            );

            const embed = new EmbedBuilder()
              .setDescription(`Você setou o boas-vindas no canal ${channel}`)
              .setColor("Random")
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              });

            await interaction.reply({
              embeds: [embed],
            });
          }
          break;
        case "punish":
          {
            const channel =
              interaction.options.getChannel("canal") || interaction.channel;

            await Guild.updateOne(
              {
                guildId: interaction.guild.id,
              },
              {
                $set: {
                  punishMessage: `${channel.id}`,
                },
              }
            );

            const embed = new EmbedBuilder()
              .setDescription(`Você setou o canal de banimentos no ${channel}`)
              .setColor("Random")
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              });

            await interaction.reply({
              embeds: [embed],
            });
          }
          break;

        default:
          break;
      }
    }
  },
};
