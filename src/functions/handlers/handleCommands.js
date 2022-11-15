const fs = require("fs");
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandsFolders = fs.readdirSync("./src/commands");
    for (const folder of commandsFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith("js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
      }
    }


    const clientID = "974786151053414420";
    const guildID = "1020839188511326278";
    const rest = new REST({ version: 10 }).setToken(process.env.TOKEN);

    try {
      console.log("Iniciado atualização do aplicativo (/) comandos.");

      await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
        body: client.commandArray,
      });

      console.log("Todos os aplicativos foram atualizados (/)");
    } catch (error) {
      console.error(error);
    }
  };
};
