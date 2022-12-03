const Guild = require('../../schemas/guild')

module.exports = {
  data: {
    name: `baby`,
  },

  async execute(interaction, client) {

    let guildProfile = await Guild.findOne({
      guildId: interaction.guild.id
    })

    const babyRole = interaction.guild.roles.cache.get(guildProfile.roleBaby);

    if (interaction.member.roles.cache.get(babyRole.id)) {
      interaction.reply({
        content: `Você perdeu o cargo ${babyRole}!`,
        ephemeral: true,
      });
      interaction.member.roles.remove(babyRole);
    } else {
      interaction.member.roles.add(babyRole);
      interaction.reply({
        content: `Você ganhou o cargo ${babyRole}`,
        ephemeral: true,
      });
    }
  },
};
