const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require('canvas')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xbox")
    .setDescription("Desbloqueia uma conquista")
    .addStringOption((option) =>
      option
        .setName("conquista")
        .setDescription("Digita a conquista")
        .setRequired(true)
    ),

  async execute(interaction, client, args) {

    const string = interaction.options.getString("conquista");

    if (string.length > 25) {
      return interaction.reply({
        content: `**Por favor escreva um texto com no maximo \`25\` letras**`,
        ephemeral: true,
      });
    } else {
      const canvas = Canvas.createCanvas(1018, 560);
      const ctx = canvas.getContext("2d");

      const xbox = await Canvas.loadImage(
        `https://cdn.discordapp.com/attachments/1016929140747808848/1038985166074433557/conquistaXbox.png`
      );

      ctx.drawImage(xbox, 0, 0, canvas.width, canvas.height);
      ctx.font = "48px sans-serif";
      ctx.fillStyle = "#d8d8d8";
      if (string.length < 8) {
        ctx.fillText(`${string}`, 425, 349);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), {
          name: "xbox.png",
        });
        const embed = new EmbedBuilder()
          .setColor("Green")
          .setImage("attachment://xbox.png");

        interaction.reply({
          files: [attachment],
          content: `**- 🔔**`,
          embeds: [embed],
        });
      } else {
        ctx.fillText(`${string}`, 236, 349);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), {
          name: "xbox.png",
        });
        const embedXbox = new EmbedBuilder()
          .setColor("Green")
          .setImage("attachment://xbox.png");

        interaction.reply({
          files: [attachment],
          content: `- 🔔 Nova conquista`,
          embeds: [embedXbox],
        });
      }
    }
  },
};
