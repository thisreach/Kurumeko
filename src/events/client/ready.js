module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    setInterval(client.pickPresence, 10 * 1000);
    await client.commands.clear();

    client.guilds.cache.forEach(guild => guild.commands.set(client.commandArray))

    console.log(`bot inicializado com sucesso ${client.user.tag}`);
  },
};
