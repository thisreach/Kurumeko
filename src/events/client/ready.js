module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    setInterval(client.pickPresence, 10 * 1000);

    console.log(`bot inicializado com sucesso ${client.user.tag}`);
  },
};
