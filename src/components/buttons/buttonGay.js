const Guild = require("../../schemas/guild");

module.exports = {
  data: {
    name: `gay`,
  },

  async execute(interaction, client) {
    let guildProfile = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    let gayRole = interaction.guild.roles.cache.get(guildProfile.roleGay);

    if (interaction.member.roles.cache.get(gayRole.id)) {
      interaction.reply({
        content: `Você perdeu o cargo ${gayRole}!`,
        ephemeral: true,
      });
      interaction.member.roles.remove(gayRole);
    } else {
      interaction.member.roles.add(gayRole);
      interaction.reply({
        content: `Você ganhou o cargo ${gayRole}`,
        ephemeral: true,
      });
    }
  },
};
