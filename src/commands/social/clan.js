const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageCollector,
} = require("discord.js");
const User = require("../../schemas/users");
const Clan = require("../../schemas/clan");
const { clanPage } = require("../../structures/clanPage");
const config = require("../../utils/default.js");
const humanizeDuration = require("humanize-duration");

const pendings = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clan")
    .setDescription("Comandos do clã")
    .addSubcommand((option) =>
      option
        .setName("criar")
        .setDescription("Criar seu clan")
        .addStringOption((option) =>
          option
            .setName("nome")
            .setDescription("Selecione o nome do seu clã")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option.setName("excluir").setDescription("Excluir seu clã")
    )
    .addSubcommand((option) =>
      option
        .setName("depositar")
        .setDescription("Depositar o dinheiro para seu clã")
        .addStringOption((option) =>
          option
            .setName("quantidade")
            .setDescription("Selecione a quantidade ou digite all")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("retirar")
        .setDescription("Retirar o dinheiro do seu clã")
        .addStringOption((option) =>
          option
            .setName("quantidade")
            .setDescription("Selecione a quantidade ou digite all")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("info")
        .setDescription("Ver a informação do clã")
        .addStringOption((option) =>
          option
            .setName("tag")
            .setDescription("Digite a tag do clã para ver a informação dele")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("convidar")
        .setDescription("Convidar o usuário")
        .addUserOption((option) =>
          option
            .setName("usuário")
            .setDescription("Selecione o usuário")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("expulsar")
        .setDescription("Expulsar usuário")
        .addUserOption((option) =>
          option
            .setName("usuário")
            .setDescription("Selecione o usuário")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option.setName("sair").setDescription("Sair do clã")
    )
    .addSubcommand((option) =>
      option
        .setName("lista")
        .setDescription("Lista de todos os clãs")
        .addIntegerOption((option) =>
          option.setName("página").setDescription("Seleciona a página")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("transferir")
        .setDescription("Transferir o clã para algum usuário")
        .addUserOption((option) =>
          option
            .setName("usuário")
            .setDescription("Selecione o usuário")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("aliança")
        .setDescription("Fazer aliança com algum clã")
        .addStringOption((option) =>
          option
            .setName("tipo")
            .setDescription("Seleciona o tipo")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("tag")
            .setDescription("Selecione a tag do clã")
            .setRequired(true)
        )
    )
    .addSubcommandGroup((option) =>
      option
        .setName("comprar")
        .setDescription("Faça compras ou upgrade no seu clã")
        .addSubcommand((option) =>
          option
            .setName("chat")
            .setDescription("Compre um chat para os membros do seu clã")
        )
        .addSubcommand((option) =>
          option
            .setName("upgrade")
            .setDescription("Faça upgrade no level do seu clã")
        )
        .addSubcommand((option) =>
          option
            .setName("cargo")
            .setDescription("Tenha um cargo exclusivo para o seu clã")
            .addStringOption((option) =>
              option.setName("cor").setDescription("Selecione uma cor")
            )
        )
        .addSubcommand((option) =>
          option
            .setName("renomear")
            .setDescription("Renomear do seu clã")
            .addStringOption((option) =>
              option
                .setName("nome")
                .setDescription("Coloque o nome do novo clã")
            )
        )
    )
    .addSubcommand((option) =>
      option
        .setName("atualizar")
        .setDescription("Atualizar os cargos dos seus membros")
    )
    .addSubcommandGroup((option) =>
      option
        .setName("config")
        .setDescription("Configuração do seu clã")
        .addSubcommand((option) =>
          option
            .setName("icone")
            .setDescription("Trocar o icone do seu clã")
            .addStringOption((option) =>
              option.setName("imagem").setDescription("URL da imagem")
            )
        )
    ),

  async autocomplete(interaction, client) {
    const focusedValue = interaction.options.getFocused();
    const choices = ["adicionar", "remover"];
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },

  async execute(interaction, client, args) {
    const subCommands = interaction.options.getSubcommand();

    switch (subCommands) {
      case "criar":
        {
          await interaction.deferReply({ ephemeral: false });

          const clanName = interaction.options.getString("nome");
          const clanTag = clanName.toLowerCase().replace(/ /g, "-");
          const clanIcon =
            "https://media.discordapp.net/attachments/1044067361549983754/1044653065111867432/unknown.png?width=554&height=554";

          let userProfile = await User.findOne({
            userId: interaction.user.id,
          });

          if (!userProfile) {
            const newUser = new User({
              userId: interaction.user.id,
            });
            await newUser.save();

            userProfile = await User.findOne({ userId: interaction.id });
          }

          const clan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_owner: interaction.user.id,
          });
          if (clan) return interaction.editReply("Você já tem um clã");

          const inClan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_members: interaction.user.id,
          });
          if (inClan) return interaction.editReply("Você já está em um clã");

          const aClanN = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_name: clanName,
          });
          if (aClanN)
            return interaction.editReply(
              "Esse nome de clã já está sendo usado"
            );

          const aClanT = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_tag: clanTag,
          });
          if (aClanT)
            return interaction.editReply(
              "Esse nome de clã já está sendo usado"
            );

          if (clanName.length > config.clan.clan_character)
            return interaction.editReply(
              `Por favor coloque o nome do seu clã com \`${config.clan.clan_character}\` características`
            );

          if (userProfile.money < config.clan.create_clan)
            return interaction.editReply(
              `Você precisa de \`$${formatNumbers(
                config.clan.create_clan
              )}\` para criar um clã `
            );

          userProfile.money -= config.clan.create_clan;
          await userProfile.save();

          const newClan = new Clan({
            guild_id: interaction.guild.id,
            clan_name: clanName,
            clan_tag: clanTag,
            clan_icon:
              "https://media.discordapp.net/attachments/1044067361549983754/1044653065111867432/unknown.png?width=554&height=554",
            clan_banner:
              "https://media.discordapp.net/attachments/1044067361549983754/1044652953786654730/unknown.png?width=1080&height=278",
            clan_owner: interaction.user.id,
            clan_created: Date.now(),
            clan_members: [interaction.user.id],
            clan_description: "Sem descrição",
            clan_alliance: [],
            clan_role: "",
            clan_money: 0,
            clan_level: 1,
            member_limit: config.clan.max_member,
          });

          await newClan.save().then(() => {
            const embed = new EmbedBuilder()
              .setColor("Blue")
              .setTitle("Novo clã criado")
              .setDescription(`O clã \`[${clanName}]\` foi criado`)
              .setThumbnail(clanIcon)
              .setFooter({ text: `Tag do clã: ${clanTag}` });

            return interaction.editReply({
              embeds: [embed],
            });
          });
        }
        break;
      case "excluir":
        await interaction.deferReply({ ephemeral: false });

        const clan = await Clan.findOne({
          guild_id: interaction.guild.id,
          clan_owner: interaction.user.id,
        });
        if (!clan)
          return interaction.editReply(
            "Você não é dono do clã ou você não tem clã"
          );

        await clan.delete().then(() => {
          const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("Clã deletado")
            .setDescription(`\`${interaction.user.tag}\` *O clã foi deletado*`)
            .setThumbnail(clan.clan_icon)
            .setFooter({ text: `Tag do clã: ${clan.clan_tag}` });

          return interaction.editReply({ embeds: [embed] });
        });
        break;
      case "depositar":
        {
          await interaction.deferReply({ ephemeral: true });

          const amount = interaction.options.getString("quantidade");

          const filters = ["+", "-"];

          for (const message in filters) {
            if (amount.includes(filters[message]))
              return interaction.editReply("Você não pode fazer isso!");
          }

          if (amount != parseInt(amount) && amount != "all")
            return interaction.editReply(
              "Por favor digite uma quantidade ou all"
            );

          const clan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_owner: interaction.user.id,
          });
          if (!clan) return interaction.editReply("Você não é o dono do clã");

          const userProfile = await User.findOne({
            userId: interaction.user.id,
          });

          if (amount > userProfile.money) {
            const embed = new EmbedBuilder()
              .setColor("Blue")
              .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.avatarURL({ dynamic: true }),
              })
              .setDescription(
                `Você não tem dinheiro suficiente para depositar este valor.`
              )
              .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
          }

          if (amount.toLowerCase() == "all") {
            /// Depositar tudo
            const embed = new EmbedBuilder()
              .setColor("Blue")
              .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.avatarURL({ dynamic: true }),
              })
              .setDescription(
                `Você depositou \`$${formatNumbers(
                  userProfile.money
                )}\` no banco do clã`
              )
              .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            clan.clan_money += userProfile.money;
            userProfile.money = 0;

            await userProfile.save();
            await clan.save();
          } else {
            /// DEPOSITAR QUANTIDADE
            clan.clan_money += parseInt(amount);
            userProfile.money -= parseInt(amount);

            const embed = new EmbedBuilder()
              .setColor("Blue")
              .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.avatarURL({ dynamic: true }),
              })
              .setDescription(
                `Você depositou \`$${formatNumbers(amount)}\` no banco do clã.`
              )
              .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            await user.save();
            await clan.save();
          }
        }
        break;
      case "retirar":
        {
          await interaction.deferReply({ ephemeral: true });

          const amount = interaction.options.getString("quantidade");

          const filters = ["+", "-"];

          for (const message in filters) {
            if (amount.includes(filters[message]))
              return interaction.editReply("Você não pode fazer isso!");
          }

          if (amount != parseInt(amount) && amount != "all")
            return interaction.editReply(
              "Por favor digite uma quantidade ou all"
            );

          const clan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_owner: interaction.user.id,
          });
          if (!clan) return interaction.editReply("Você não é o dono do clã");

          const userProfile = await User.findOne({
            userId: interaction.user.id,
          });

          if (amount > clan.clan_money) {
            const embed = new EmbedBuilder()
              .setColor("Blue")
              .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.avatarURL({ dynamic: true }),
              })
              .setDescription(
                `O seu clã não tem essa quantidade para a retirada.`
              )
              .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
          }

          if (amount.toLowerCase() == "all") {
            /// Retirar tudo
            const embed = new EmbedBuilder()
              .setColor("Blue")
              .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.avatarURL({ dynamic: true }),
              })
              .setDescription(
                `Você retirou \`$${formatNumbers(
                  clan.clan_money
                )}\` do banco do seu clã.`
              )
              .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            userProfile.money += clan.clan_money;
            clan.clan_money = 0;

            await userProfile.save();
            await clan.save();
          } else {
            /// Retirar quantidade
            clan.clan_money -= parseInt(amount);
            userProfile.money += parseInt(amount);

            const embed = new EmbedBuilder()
              .setColor("Blue")
              .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.avatarURL({ dynamic: true }),
              })
              .setDescription(
                `Você retirou \`$${formatNumbers(
                  amount
                )}\` do banco do seu clã.`
              )
              .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            await userProfile.save();
            await clan.save();
          }
        }
        break;
      case "info": {
        await interaction.deferReply({ ephemeral: false });

        const clanName = interaction.options.getString("tag");

        const clan = await Clan.findOne({
          guild_id: interaction.guild.id,
          clan_tag: clanName,
        });
        if (!clan) return interaction.editReply("Esse clã não foi encontrado.");

        const embed = new EmbedBuilder()
          .setAuthor({
            name: `Clã ${clan.clan_name}`,
            iconURL: interaction.guild.iconURL({ dynamic: true }),
          })
          .setColor("Blue")
          .setDescription(`Utilize \`/clan rank\` para ver os tops clãs.`)
          .addFields({
            name: "Nome:",
            value: `\`${clan.clan_name}\``,
            inline: true,
          })
          .addFields({
            name: "Dono:",
            value: `\`${client.users.cache.get(clan.clan_owner).username}\``,
            inline: true,
          })
          .addFields({
            name: "Level:",
            value: `\`${clan.clan_level}\``,
            inline: true,
          })
          .addFields({
            name: "Money:",
            value: `\`$${formatNumbers(clan.clan_money)}\``,
            inline: true,
          })
          .addFields({
            name: "Alianças:",
            value: `\`${clan.clan_alliance.length}/5\``,
            inline: true,
          })
          .addFields({
            name: "Membros:",
            value: `\`${clan.clan_members.length}/${clan.member_limit}\``,
            inline: true,
          })
          .setThumbnail(clan.clan_icon)
          .setTimestamp()
          .setFooter({ text: `Tag do clã: ${clan.clan_tag}` });

        return interaction.editReply({ embeds: [embed] });
      }
      case "convidar":
        {
          await interaction.deferReply({ ephemeral: false });

          const user = interaction.options.getUser("usuário");

          if (interaction.user.id == user.id)
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`WARNING`)
                  .setColor("Red")
                  .setDescription(
                    `**Calma!** Você não pode convidar você mesmo.`
                  ),
              ],
              ephemeral: true,
            });

          if (user.bot)
            return interaction.editReply("Você não pode adicionar bots.");

          for (const requester in pendings) {
            const receiver = pendings[requester];
            if (requester === interaction.user.id) {
              interaction.editReply("Você já tem um convite de perdente");
              return;
            } else if (receiver === interaction.user.id) {
              interaction.editReply("Você já tem um convite de recebimento");
              return;
            } else if (requester === user.id) {
              interaction.editReply("Este usuário já tem um convite pendente");
              return;
            } else if (receiver === user.id) {
              interaction.editReply("Este usuário já recebeu um convite");
              return;
            }
          }

          let userProfile = await User.findOne({ userId: interaction.user.id });

          if (!userProfile) {
            const newUser = new User({
              userId: interaction.user.id,
            });
            await newUser.save();

            userProfile = await User.findOne({ userId: interaction.id });
          }

          const clan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_owner: interaction.user.id,
          });
          if (!clan) return interaction.editReply("Você não é dono do clã");

          /// Quando o usuário tiver em outro clã
          const inClan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_members: user.id,
          });
          if (inClan)
            return interaction.editReply(
              "Esse usuário se encontra em outro clã"
            );

          if (clan.clan_members.includes(user.id))
            return interaction.editReply("Esse usuário já é do seu clã");
          if (clan.clan_members.length >= clan.member_limit)
            return interaction.editReply("Seu clã está cheio");

          const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("Convite de clã")
            .setDescription(
              `\`${user.tag}\`, você recebeu um convite de clã: Digite [sim/não]`
            )
            .setFooter({
              text: `Tag do clã: ${clan.clan_tag} | Você tem 30 segundos para aceitar.`,
            });

          const boxed = await interaction.editReply({ embeds: [embed] });

          pendings[interaction.user.id] = user.id;

          const filter = (u) =>
            u.author.id === user.id &&
            (u.content.toLowerCase() === "sim" ||
              u.content.toLowerCase() === "não");
          const collector = new MessageCollector(interaction.channel, {
            filter: filter,
            time: 30000,
          });

          collector.on("collect", async (message) => {
            const content = message.content.toLowerCase();
            if (content === "sim".toLocaleLowerCase()) {
              await clan.clan_members.push(user.id);

              await clan.save().then(async () => {
                const embed = new EmbedBuilder()
                  .setColor("Blue")
                  .setTitle("Convite de clã")
                  .setDescription(`\`${user.tag}\` *Aceitou o convite de clã*`)
                  .setThumbnail(clan.clan_icon)
                  .setFooter({ text: `Tag do clã: ${clan.clan_tag}` });

                // Deletar pedido do clã
                delete pendings[interaction.user.id];
                await message.reply({ embeds: [embed] });
                return collector.stop();
              });
            } else if (content === "não".toLocaleLowerCase()) {
              const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Convite de clã")
                .setDescription(
                  `\`${user.tag}\` *Não aceitou o convite do clã*`
                )
                .setThumbnail(clan.clan_icon)
                .setFooter({ text: `Tag do clã: ${clan.clan_tag}` });

              // Deletar pedido do clã
              delete pendings[interaction.user.id];
              await message.reply({ embeds: [embed] });
              return collector.stop();
            }
          });

          collector.on("end", async (collected, reason) => {
            if (reason === "time") {
              // Deletar pedido do clá
              delete pendings[interaction.user.id];
              await boxed.edit({ content: "Sem respostas.", embeds: [] });
              return collector.stop();
            }
          });
        }
        break;
      case "expulsar":
        {
          await interaction.deferReply({ ephemeral: true });

          const user = interaction.options.getUser("usuário");

          const clan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_owner: interaction.user.id,
          });
          if (!clan) return interaction.editReply("Você não é dono do clã");

          if (user.id === interaction.user.id)
            return interaction.editReply("Você não pode expulsar a si mesmo");
          if (!clan.clan_members.includes(user.id))
            return interaction.editReply("Esse usuário não é do seu clã");
          if (clan.clan_members.length === 1)
            return interaction.editReply(
              "Você não pode chutar o último membro do seu clã"
            );

          await clan.clan_members.splice(clan.clan_members.indexOf(user.id), 1);
          await clan.save().then(() => {
            const embed = new EmbedBuilder()
              .setColor("Blue")
              .setTitle("Expulso do clã")
              .setDescription(`\`${user.tag}\` *Foi expulso do seu clã*`)
              .setThumbnail(clan.clan_icon)
              .setFooter({ text: `Tag do clã: ${clan.clan_tag}` });

            return interaction.editReply({ embeds: [embed] });
          });
        }
        break;
      case "sair":
        {
          await interaction.deferReply({ ephemeral: false });

          const clan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_members: interaction.user.id,
          });
          if (!clan) return interaction.editReply("Você não está em um clã");

          const owner = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_owner: interaction.user.id,
          });
          if (owner)
            return interaction.editReply(
              "Você não pode sair do clã, você é dono"
            );

          await clan
            .updateOne({ $pull: { clan_members: interaction.user.id } })
            .then(() => {
              const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Saiu do clã")
                .setDescription(`\`${interaction.user.tag}\` *Saiu do clã*`)
                .setThumbnail(clan.clan_icon)
                .setFooter({ text: `Tag do clã: ${clan.clan_tag}` });

              return interaction.editReply({ embeds: [embed] });
            });
        }
        break;
      case "lista":
        {
          await interaction.deferReply({ ephemeral: true });

          const args = interaction.options.getInteger("página");

          const clan = await Clan.find({ guild_id: interaction.guild.id });

          let pagesNum = Math.ceil(clan.length / 10);
          if (pagesNum === 0) pagesNum = 1;

          const clanStrings = [];
          for (let i = 0; i < clan.length; i++) {
            const e = clan[i];
            clanStrings.push(
              `**${i + 1}. ${e.clan_name}** \`[${humanizeDuration(
                Date.now() - e.clan_created,
                { largest: 1 }
              )}]\` • ${client.users.cache.get(e.clan_owner).tag}
                    `
            );
          }

          const pages = [];
          for (let i = 0; i < pagesNum; i++) {
            const str = clanStrings.slice(i * 10, i * 10 + 10).join("");

            const embed = new EmbedBuilder()
              .setAuthor({
                name: `Clãs - ${interaction.guild.name}`,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
              })
              .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
              .setColor("Blue")
              .setDescription(`${str == "" ? "  Sem clãs" : "\n" + str}`)
              .setFooter({
                text: `Página • ${i + 1}/${pagesNum} | ${
                  clan.length
                } • Total de clãs`,
              });

            pages.push(embed);
          }

          if (!args) {
            if (pages.length == pagesNum && clan.length > 10)
              clanPage(client, interaction, pages, 30000, clan.length);
            else return interaction.editReply({ embeds: [pages[0]] });
          } else {
            if (isNaN(args))
              return interaction.editReply("A página deve ser um número.");
            if (args > pagesNum)
              return interaction.editReply(
                `Existe apenas ${pagesNum} páginas acessíveis.`
              );
            const pageNum = args == 0 ? 1 : args - 1;
            return interaction.editReply({ embeds: [pages[pageNum]] });
          }
        }
        break;
      case "transferir":
        {
          await interaction.deferReply({ ephemeral: true });

          const user = interaction.options.getUser("usuário");

          const clan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_owner: interaction.user.id,
          });
          if (!clan) return interaction.editReply("Você não é dono do clã");

          if (user.id === interaction.user.id)
            return interaction.editReply(
              "Você não pode transferir seu clã para si mesmo"
            );
          if (user.bot)
            return interaction.editReply(
              "Você não pode transferir seu clã para um bot"
            );

          clan.clan_owner = user.id;

          await clan.save().then(() => {
            const embed = new EmbedBuilder()
              .setColor("Blue")
              .setTitle("Transferencia de clã")
              .setDescription(
                `\`${interaction.user.tag}\` *Seu clã foi transferido para* \`${user.tag}\``
              )
              .setThumbnail(clan.clan_icon)
              .setFooter({ text: `Tag do clã: ${clan.clan_tag}` });

            return interaction.editReply({ embeds: [embed] });
          });
        }
        break;
      case "aliança":
        {
          await interaction.deferReply({ ephemeral: true });

          let clanName = interaction.options.getString("tag");

          const clan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_tag: clanName,
          });
          if (!clan)
            return interaction.editReply(
              "Esse clã não foi encontrado ou você não é dono do clã"
            );

          let currentClan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_owner: interaction.user.id,
          });

          if (
            interaction.options._hoistedOptions.find(
              (c) => c.value === "adicionar"
            )
          ) {
            if (clan.clan_owner === interaction.user.id)
              return interaction.editReply(
                "Você não pode adicionar seu próprio clã à sua aliança"
              );

            if (currentClan.clan_alliance.length >= config.clan.max_alliance)
              return interaction.editReply("Sua aliança está cheia");
            if (currentClan.clan_alliance.includes(clan.clan_tag))
              return interaction.editReply("Este clã já está em sua aliança");

            await currentClan.clan_alliance.push(clan.clan_name);
            await currentClan.save().then(() => {
              const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Aliança de clãs")
                .setDescription(
                  `\`${clan.clan_name}\` *Foi adicionado na aliança*`
                )
                .setThumbnail(clan.clan_icon)
                .setFooter({ text: `Tag do clã: ${clan.clan_tag}` });

              return interaction.editReply({ embeds: [embed] });
            });
          }

          if (
            interaction.options._hoistedOptions.find(
              (c) => c.value === "remover"
            )
          ) {
            if (clan.clan_owner === interaction.user.id)
              return interaction.editReply(
                "Você não pode remover seu próprio clã para sua aliança"
              );

            if (!currentClan.clan_alliance.includes(clan.clan_name))
              return interaction.editReply("Este clã não está em sua aliança");

            await currentClan.clan_alliance.splice(
              currentClan.clan_alliance.indexOf(clan.clan_name),
              1
            );
            await currentClan.save().then(() => {
              const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Aliança de clã")
                .setDescription(
                  `\`${clan.clan_name}\` *Você removeu esse clã da aliança*`
                )
                .setThumbnail(clan.clan_icon)
                .setFooter({ text: `Tag do clã: ${clan.clan_tag}` });

              return interaction.editReply({ embeds: [embed] });
            });
          }
        }
        break;
      case "chat":
        {
          await interaction.deferReply({ ephemeral: true });

          const clan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_owner: interaction.user.id,
          });
          if (!clan) return interaction.editReply("Você não é dono do clã");

          const role = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_role: { $in: interaction.member.roles.cache.map((r) => r.id) },
          });
          if (!role)
            return interaction.editReply(
              "Você precisar um cargo para comprar um chat"
            );

          const channel = interaction.guild.channels.cache.find(
            (channel) => channel.name === `${clan.clan_tag}-chat`
          );
          if (channel)
            return interaction.editReply(
              `Você já tem um chat para seu clã: ${channel}`
            );

          if (clan.clan_money < config.clan.chat_cost)
            return interaction.editReply(
              `Você precisa de \`$${formatNumbers(
                config.clan.chat_cost
              )}\` para comprar o chat do seu clã`
            );
          if (clan.clan_level < config.clan.chat_level)
            return interaction.editReply(
              `Seu clã precisa ser \`${config.clan.chat_level}\` para comprar um chat`
            );

          clan.clan_money -= config.clan.chat_cost;
          await clan.save();

          const category = "1048269739983642694"; // Coloque o ID da categoria que deseja que fique, caso contrario ficará fora de categoria

          if (!interaction.guild.channels.cache.get(category)) category = null;

          await interaction.guild.channels
            .create({
              name: `${clan.clan_tag}-chat`,
              type: 0,
              topic: `Chat do clã ${clan.clan_name}`,
              parent: category,
              permissionOverwrites: [
                {
                  id: interaction.guild.roles.everyone,
                  deny: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
                },
                {
                  id: clan.clan_owner,
                  allow: [
                    "ViewChannel",
                    "SendMessages",
                    "ReadMessageHistory",
                    "AttachFiles",
                    "ManageMessages",
                  ],
                },
                {
                  id: clan.clan_role,
                  allow: [
                    "ViewChannel",
                    "SendMessages",
                    "ReadMessageHistory",
                    "AttachFiles",
                  ],
                },
              ],
            })
            .then(async (channel) => {
              await channel.send(
                `Seja bem-vindo ao chat do seu clã ${interaction.member}`
              );
              const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Chat do clã")
                .setDescription(
                  `\`${interaction.user.tag}\` *comprou um chat de clã*`
                )
                .setThumbnail(clan.clan_icon)
                .setFooter({ text: `Tag do clã: ${clan.clan_tag}` });

              return interaction.editReply({ embeds: [embed] });
            });
        }
        break;
      case "upgrade":
        {
          await interaction.deferReply({ ephemeral: true });

          const clan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_owner: interaction.user.id,
          });
          if (!clan) return interaction.editReply("Você não é dono de clã");

          if (clan.clan_level === config.clan.max_lvl_upgrade)
            return interaction.editReply("Seu clã já está no level máximo");
          const formatUpgrade =
            config.clan.upgrade_start *
            Math.pow(config.clan.multiple_upgrade, clan.clan_level);
          if (clan.clan_money < formatUpgrade)
            return interaction.editReply(
              `Você precisa de \`$${formatNumbers(
                formatUpgrade
              )}\` para upar seu clã`
            );

          clan.clan_money -= formatUpgrade;
          clan.clan_level++;
          clan.member_limit += config.clan.increase_member;

          await clan.save().then(() => {
            const embed = new EmbedBuilder()
              .setColor("Blue")
              .setTitle("Upgrade")
              .setDescription(
                `\`${interaction.user.tag}\` *Você upo seu clã para o level* \`${clan.clan_level}\``
              )
              .setThumbnail(clan.clan_icon)
              .setFooter({ text: `Tag do clã: ${clan.clan_tag}` });

            return interaction.editReply({ embeds: [embed] });
          });
        }
        break;
      case "cargo":
        {
          await interaction.deferReply({ ephemeral: true });

          const args = interaction.options.getString("cor");
          if (!args.startsWith("#"))
            return interaction.editReply(
              "Por favor, utilize alguma hax color valida."
            );

          const clan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_owner: interaction.user.id,
          });
          if (!clan) return interaction.editReply("Você é dono do clã");

          const role = interaction.guild.roles.cache.find(
            (role) => role.name === `${clan.clan_name}`
          );
          if (role)
            return interaction.editReply(
              "Você já tem um cargo exclusivo para o seu clã"
            );

          if (clan.clan_money < config.clan.role_cost)
            return interaction.editReply(
              `Você precisa de \`$${formatNumbers(
                config.clan.role_cost
              )}\` para comprar uma tag do seu clã`
            );
          if (clan.clan_level < config.clan.role_level)
            return interaction.editReply(
              `Seu clã precisa ser level \`${config.clan.role_level}\` parar comprar um cargo`
            );

          clan.clan_money -= config.clan.role_cost;
          await clan.save();

          await interaction.guild.roles
            .create({
              name: `${clan.clan_name}`,
              color: args,
              permissions: ["ViewChannel"],
              mentionable: true,
            })
            .then(async (role) => {
              await clan.updateOne({ clan_role: role.id }).then(async () => {
                await clan.clan_members.forEach(async (member) => {
                  await interaction.guild.members
                    .fetch(member)
                    .then(async (member) => {
                      await member.roles.add(role);
                    });
                  const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("Tag do clã")
                    .setDescription(
                      `\`${interaction.user.tag}\` *Você comprou um cargo para o seu clã*`
                    )
                    .setThumbnail(clan.clan_icon)
                    .setFooter({ text: `Tag do clã: ${clan.clan_tag}` });

                  return interaction.editReply({ embeds: [embed] });
                });
              });
            });
        }
        break;
      case "renomear":
        {
          await interaction.deferReply({ ephemeral: true });
          const clanName = interaction.options.getString("nome");
          const clanTag = clanName.toLowerCase().replace(/ /g, "-");

          const clan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_owner: interaction.user.id,
          });
          if (!clan) return interaction.editReply("Você não é dono do clã");

          if (clan.clan_name === clanName)
            return interaction.editReply("Você já tem esse nome");
          if (clan.clan_tag === clanTag)
            return interaction.editReply("Você já tem esse nome");
          if (clan.clan_money < config.clan.rename_cost)
            return interaction.editReply(
              `Você precisa de \`$${formatNumbers(
                config.clan.rename_cost
              )}\` para renomear o seu clã`
            );
          if (clan.clan_level < config.clan.rename_level)
            return interaction.editReply(
              `Seu clã precisa ser level \`${config.clan.rename_level}\` para usar isso.`
            );

          if (args.length > config.clan.rename_character)
            return interaction.editReply("Por favor, use no máximo 50 letras");

          clan.clan_money -= config.clan.rename_cost;
          clan.clan_name = args;
          await clan.save().then(() => {
            const embed = new EmbedBuilder()
              .setColor("Blue")
              .setTitle("Renomear clã")
              .setDescription(
                `${interaction.user} *o nome do seu clã foi trocado.*`
              )
              .setThumbnail(clan.clan_icon)
              .setFooter({ text: `Tag do clã: ${clan.clan_tag}` });

            return interaction.editReply({ embeds: [embed] });
          });
        }
        break;
      case "atualizar":
        {
          await interaction.deferReply({ ephemeral: true });

          const clan = await Clan.findOne({
            guild_id: interaction.guild.id,
            clan_owner: interaction.user.id,
          });
          if (!clan) return interaction.editReply("Você não é dono do clã");

          await clan.clan_members.forEach(async (member) => {
            await interaction.guild.members
              .fetch(member)
              .then(async (member) => {
                await member.roles.add(clan.clan_role);
              });

            const embed = new EmbedBuilder()
              .setColor("Blue")
              .setTitle("Atualização")
              .setDescription(
                `\`${interaction.user.tag}\` *Você atualizou o seu clã.*`
              )
              .setThumbnail(clan.clan_icon)
              .setFooter({ text: `Tag do clã: ${clan.clan_tag}` });

            return interaction.editReply({ embeds: [embed] });
          });
        }
        break;
      case "icone": {
        await interaction.deferReply({ ephemeral: true });

        let args = interaction.options.getString("imagem");

        const clan = await Clan.findOne({
          guild_id: interaction.guild.id,
          clan_owner: interaction.user.id,
        });
        if (!clan) return interaction.editReply("Você não é dono do clã");

        if (!args.startsWith("http"))
          return interaction.editReply("*Por favor, coloque um link validos*");
        let ends = [".png", ".gif", ".jpg", ".jpeg", ".webp"];
        if (!ends.some((e) => args.endsWith(e)))
          return interaction.editReply(
            `*Por favor, coloque uma imagem que*, *\`termine com ${ends.join(
              ", "
            )}\`*`
          );

        clan.clan_icon = args;
        await clan.save().then(() => {
          const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("Ícone do clã")
            .setDescription(
              `\`${interaction.user.tag}\` Você trocou o ícone do clã`
            )
            .setThumbnail(clan.clan_icon)
            .setFooter({ text: `Clan Tag: ${clan.clan_tag}` });

          return interaction.editReply({ embeds: [embed] });
        });
      }
      default:
        break;
    }
  },
};

function formatNumbers(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
