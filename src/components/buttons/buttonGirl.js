const Guild = require("../../schemas/guild");

module.exports = {
  data: {
    name: `girl`,
  },

  async execute(interaction, client) {
    
    let guildProfile = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    let girlRole = interaction.guild.roles.cache.get(guildProfile.roleGirl);

    if (interaction.member.roles.cache.get(girlRole.id)) {
      interaction.reply({
        content: `Você perdeu o cargo ${girlRole}!`,
        ephemeral: true,
      });
      interaction.member.roles.remove(girlRole);
    } else {
      interaction.member.roles.add(girlRole);
      interaction.reply({
        content: `Você ganhou o cargo ${girlRole}`,
        ephemeral: true,
      });
    }
  },
};
