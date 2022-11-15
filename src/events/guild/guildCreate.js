const db = require('../../modules/guildModule')
const chalk = require('chalk')

module.exports = {
  name: "guildCreate",
  async execute(guild, client) {
    if (!guild.available) return;

	await db.createServer(guild.id);

	console.log(chalk.green(`Entrei em ${guild.name}`));
  },
};
