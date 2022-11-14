const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Faça uma pergunta a 8ball")
    .addStringOption((option) =>
      option
        .setName("questão")
        .setDescription("Faça uma pergunta")
        .setRequired(true)
    ),

  async execute(interaction, client, args) {
    var fortunes = [
      "Sim.",
      "É certo.",
      "É decididamente assim.",
      "Sem dúvida.",
      "sim definitivamente.",
      "Você pode contar com ele.",
      "A meu ver, sim.",
      "Provavelmente.",
      "Perspectiva boa.",
      "Sinais apontam que sim.",
      "Responder nebuloso, tente novamente.",
      "Pergunte novamente mais tarde.",
      "Melhor não te dizer agora...",
      "Não é possível prever agora.",
      "Concentre-se e pergunte novamente.",
      "Não conte com isso.",
      "Minha resposta é não.",
      "Minhas fontes dizem não.",
      "As perspectivas não são tão boas...",
      "Muito duvidoso.",
    ];
    await interaction.reply(
      fortunes[Math.floor(Math.random() * fortunes.length)]
    );
  },
};
