const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
} = require("discord.js");
const Guild = require("../../schemas/guild");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("registrar")
    .setDescription("Registrar um usuário")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Selecione um usuario")
        .setRequired(true)
    ),

  async execute(interaction, client, args) {
    
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      interaction.reply(`Você não tem permissão para executar este comando.`);
    } else {
      const { guild } = interaction;

      let guildProfile = await Guild.findOne({
        guildId: interaction.guild.id,
      });

      const user = interaction.options.getUser("usuario");
      const userMember = guild.members.cache.get(user.id);

      let boy = interaction.guild.roles.cache.get(guildProfile.roleBoy);
      let girl = interaction.guild.roles.cache.get(guildProfile.roleGirl);
      let gay = interaction.guild.roles.cache.get(guildProfile.roleGay);
      let adult = interaction.guild.roles.cache.get(guildProfile.roleAdult);
      let baby = interaction.guild.roles.cache.get(guildProfile.roleBaby);

      const genre = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`**Irei começar registrar o usuário ${user.tag}**`)
        .addFields({
          name: `💻 - Registrador:`,
          value: `${interaction.user} - (${interaction.user.id})`,
        });

      const age = new EmbedBuilder()
        .setTitle("Idade")
        .setDescription("Escolha a idade do membro utilizando o menu abaixo")
        .setColor("Blue");

      const completed = new EmbedBuilder()
        .setTitle("Registro completo!")
        .setDescription(
          `
> Registrador: ${interaction.user}
> Registrado: ${user.username}`
        )
        .setColor("Blue");

      const genremenu = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("genremenu")
          .setPlaceholder("Gênero")
          .setOptions(
            new SelectMenuOptionBuilder({
              label: "Homem",
              emoji: "♂️",
              description: "Genero masculino",
              value: "boymenu",
            }),
            new SelectMenuOptionBuilder({
              label: "Mulher",
              emoji: "♀️",
              description: "Genero feminino",
              value: "girlmenu",
            }),
            new SelectMenuOptionBuilder({
              label: "Não binario",
              emoji: "🌈",
              description: "Não binario",
              value: "gaymenu",
            })
          )
      );

      const agemenu = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("agemenu")
          .setPlaceholder("Idade")
          .addOptions([
            {
              label: "-18",
              emoji: "🔞",
              description: "Menos de 18 anos",
              value: "babymenu",
            },
            {
              label: "+18",
              emoji: "🍺",
              description: "Maior de 18 anos",
              value: "adultmenu",
            },
          ])
      );

      const genreCollect = await interaction.channel.send({
        embeds: [genre],
        components: [genremenu],
      });

      const filter = (interaction) => interaction.isSelectMenu();

      const collect = genreCollect.createMessageComponentCollector({
        filter,
      });
      collect.on("collect", async (collected) => {
        let ticket = collected.values[0];
        collected.deferUpdate();

        if (ticket === "boymenu") {
          userMember.roles.add(boy);
        }

        if (ticket === "girlmenu") {
          userMember.roles.add(girl);
        }

        if (ticket === "gaymenu") {
          userMember.roles.add(gay);
        }

        const ageCollect = await interaction.channel.send({
          embeds: [age],
          components: [agemenu],
        });

        genreCollect.delete();

        const filter = (interaction) => interaction.isSelectMenu();

        const collect = ageCollect.createMessageComponentCollector({
          filter,
        });
        collect.on("collect", async (collected) => {
          let ticket = collected.values[0];
          collected.deferUpdate();

          if (ticket === "babymenu") {
            userMember.roles.add(baby);
          }

          if (ticket === "adultmenu") {
            userMember.roles.add(adult);
          }

          ageCollect.delete();
          interaction.channel.send({ embeds: [completed] });
        });
      });
    }
  },
};
