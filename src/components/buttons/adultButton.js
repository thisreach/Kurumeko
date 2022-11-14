const Guild = require('../../schemas/guild')

module.exports = {
    data: {
      name: `adult`,
    },
  
    async execute(interaction, client) {
  
      let guildProfile = await Guild.findOne({
        guildId: interaction.guild.id
      })

      let adultRole = interaction.guild.roles.cache.get(guildProfile.roleAdult);
  
      if (interaction.member.roles.cache.get(adultRole.id)) {
        interaction.reply({
          content: `Você perdeu o cargo ${adultRole}!`,
          ephemeral: true,
        });
        interaction.member.roles.remove(adultRole);
      } else {
        interaction.member.roles.add(adultRole);
        interaction.reply({
          content: `Você ganhou o cargo ${adultRole}`,
          ephemeral: true,
        });
      }
    },
  };
  