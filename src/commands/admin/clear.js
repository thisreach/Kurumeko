const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Deletar uma quantia de mensagens")
    .addNumberOption((option) =>
      option.setName("quantidade").setDescription("Selecione a quantidade").setRequired(true)
    ),

  async execute(interaction, client, args) {
    const number = interaction.options.getNumber("quantidade");

    if (
      !interaction.member.permissions.has(
        PermissionFlagsBits.ManageMessages
      )
    ) {
      interaction.reply({
        content: `Você não possui permissão para utilizar este comando.`,
        ephemeral: true,
      });
    } else {
      if (parseInt(number) > 99 || parseInt(number) <= 0) {
        const embed = new EmbedBuilder()
          .setColor("Random")
          .setDescription(`\`/clear [1 - 99]\``);

        await interaction.reply({ embeds: [embed] });
      } else {
        interaction.channel.bulkDelete(parseInt(number));

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL({ dynamic: true }),
          })
          .setDescription(
            `O canal de texo ${interaction.channel} teve \`${number}\` mensagens deletadas por \`${interaction.user.username}\`.`
          );

        await interaction.reply({ embeds: [embed] });

        setTimeout(() => {
          interaction.deleteReply();
        }, 5000);
      }
    }
  },
};
