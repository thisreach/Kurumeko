module.exports = {
  data: {
    name: "teste",
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: "Hello carai",
    });
  },
};
