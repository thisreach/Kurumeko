const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const anime_image = require("anime-images-api");
const API = new anime_image();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beijo")
    .setDescription("Beijo um usuário")
    .addUserOption((option) =>
      option
        .setName("usuário")
        .setDescription("Selecione o usuário que deseja beijar")
        .setRequired(true)
    ),

  async execute(interaction, client, args) {
    let user = interaction.options.getUser("usuário");
    let { image } = await API.sfw.kiss();

    const embed = new EmbedBuilder()
      .setDescription(
        `**${interaction.user} Deu um beijo em ${user}.**`
      )
      .setColor("Random")
      .setTimestamp()
      .setImage(image)
      .setFooter({
        text: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });


      let button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId("kiss-button")
        .setLabel("Retribuir")
        .setStyle(ButtonStyle.Secondary)
    );

    const embed2 = new EmbedBuilder()
      .setDescription(
        `**${user} Retribuiu o beijo para ${interaction.user}.**`
      )
      .setColor("Random")
      .setTimestamp()
      .setImage(image)
      .setFooter({
        text: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    await interaction.reply({ embeds: [embed], components: [button] }).then(() => {
      const filter = (i) =>
        i.customId === "kiss-button" && i.user.id === user.id;
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        max: 1,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "kiss-button") {
          i.reply({ embeds: [embed2] });
        }
      });
    });
  },
};
