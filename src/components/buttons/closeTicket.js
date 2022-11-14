module.exports = {
  data: {
    name: `close_ticket`,
  },

  async execute(interaction, client) {
    interaction.reply(
      `Olá ${interaction.user}, este ticket será excluído em 5 segundos...`
    );
    setTimeout(() => {
      try {
        interaction.channel.delete();
      } catch (e) {
        return;
      }
    }, 5000);
  },
};
