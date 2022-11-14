const Guild = require('../../schemas/guild')

module.exports = {
  data: {
    name: `boy`,
  },

  async execute(interaction, client) {

    let guildProfile = await Guild.findOne({
      guildId: interaction.guild.id
    })

    let boyRole = interaction.guild.roles.cache.get(guildProfile.roleBoy);

    if (
      interaction.member.roles.cache.get(
        boyRole.id,)
    ) {
      interaction.reply({
        content: `Você perdeu o cargo ${boyRole}!`,
        ephemeral: true,
      });
      interaction.member.roles.remove(boyRole);
    } else {
      interaction.member.roles.add(boyRole);
      interaction.reply({
        content: `Você ganhou o cargo ${boyRole}`,
        ephemeral: true,
      });
    }
  },
};
