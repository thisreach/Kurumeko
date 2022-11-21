require("dotenv").config();
const { TOKEN, DatabaseToken } = process.env;
const fs = require("fs");
const { connect } = require("mongoose");
const antispam = require('discord-anti-spam')
const { Client, Collection, GatewayIntentBits, Partials, PermissionFlagsBits } = require("discord.js");

const client = new Client({
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: true,
  },
  partials: [
    Partials.GuildMember,
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.Reaction,
  ],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
  ],
});

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(TOKEN);
(async () => {
  await connect(DatabaseToken).catch(console.error);
})();

process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));
