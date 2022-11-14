const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const User = require("../../schemas/users");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("divorciar")
    .setDescription("Divorciar do usuário que está casado."),

  async execute(interaction, client, args) {
    let userProfile = await User.findOne({
      userId: interaction.user.id,
    });

    if (!userProfile || !userProfile.marry.married) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`WARNING`)
            .setColor("Red")
            .setDescription(`Você não está casado com ninguém.`),
        ],
        ephemeral: true,
      });
    }

    const marry = await client.users.fetch(userProfile.marry.with);

    const embed = new EmbedBuilder()
      .setTitle(`Divórcio 💔`)
      .setDescription(
        `${interaction.user}, tem certeza que deseja se divorciar de ${marry.username}?`
      )
      .setColor("Blue");

    const button = new ButtonBuilder()
      .setCustomId("acceptDivorce")
      .setLabel("Sim")
      .setStyle(ButtonStyle.Success);

    const button2 = new ButtonBuilder()
      .setCustomId("denyDivorce")
      .setLabel("Não")
      .setStyle(ButtonStyle.Danger);

    const rowAction = new ActionRowBuilder().addComponents(button, button2);

    await interaction
      .reply({
        embeds: [embed],
        components: [rowAction],
        fetchReply: true,
      })
      .then((msg) => {
        const collector = msg.createMessageComponentCollector({
          idle: 1000 * 60 * 10,
        });

        collector.on("collect", async (i) => {
          if (i.user.id != interaction.user.id)
            return i.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`WARNING`)
                  .setColor("RED")
                  .setDescription(
                    `Só quem solicitou o comando pode usar o botão.`
                  ),
              ],
              ephemeral: true,
            });

          collector.stop();

          if (i.customId == "acceptDivorce") {
            await User.updateOne(
              {
                userId: interaction.user.id,
              },
              {
                $set: {
                  "marry.married": false,
                  "marry.with": 0,
                },
              }
            );

            await User.updateOne(
              {
                userId: marry.id,
              },
              {
                $set: {
                  "marry.married": false,
                  "marry.with": 0,
                },
              }
            );

            interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`💔 Pelo visto o amor acabou...`)
                  .setColor("Red")
                  .setDescription(
                    `Você acaba de se divorciar de ${marry.username}.`
                  ),
              ],
              components: [],
            });
          }

          if (i.customId == "denyDivorce") {
            interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`A vida continua...`)
                  .setColor("Green")
                  .setDescription(`O divórcio foi cancelado.`),
              ],
              components: [],
            });
          }
        });
      });
  },
};
