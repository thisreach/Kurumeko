const { SlashCommandBuilder } = require('discord.js');
const akinator = require("discord.js-akinator");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("akinator")
    .setDescription("Joga o jogo akinator"),

  async execute(interaction, client, args) {

    akinator(interaction, {
        language: "pt", 
        childMode: "false", 
        gameType: "character", 
        useButtons: "false", 
        embedColor: "Random"
    });

  },
};
