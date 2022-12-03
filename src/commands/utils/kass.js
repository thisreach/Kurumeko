const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kass")
    .setDescription("A Kass é"),

  async execute(interaction, client, args) {

    var fortunes = [
        "Puta.",
        "Macaca.",
        "Legal.",
        "Bonita.",
        "Horrivel.",
        "UwU.",
        "Hentaizeira.",
        "Preta.",
        "Furryzeira.",
        "Lésbica fudida.",
      ];
    
    const kass = fortunes[Math.floor(Math.random() * fortunes.length)]

    const embed = new EmbedBuilder()
    .setColor('Blue')
    .setDescription(`Eu me chamo Kass e eu sou ${kass}`)

    await interaction.reply({
        embeds: [embed]
    })

  },
};
