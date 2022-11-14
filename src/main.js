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

const antiSpam = new antispam({
  warnThreshold: 3, 
  muteTreshold: 6,
  kickTreshold: 9, 
  banTreshold: 12, 
  warnMessage: "Poderia parar de floodar!", 
  muteMessage: "Você foi mutado por floodar!", 
  kickMessage: "Você foi kickado por floodar!", 
  banMessage: "Você foi mutado por floodar!", 
  unMuteTime: 60, 
  verbose: true, 
  removeMessages: true, 
  ignoredPermissions: [PermissionFlagsBits.Administrator], 
});