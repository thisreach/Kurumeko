const Guild = require("../../schemas/guild");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    let guilddb = await Guild.findOne({
      guildId: member.guild.id,
    });

    if (!guilddb.autoRoleEnable) {
    } else {
      const role = member.guild.roles.cache.get(guilddb.autoRole);

      if (!role) return console.log(`Esse cargo não exite!`);
      try {
        member.roles.add(role.id);
      } catch (error) {
        console.log("[AutoRole]:\n" + error);
      }
    }

    const channel = member.guild.channels.cache.get(guilddb.welcomeMessage);

    if(!channel) return;

    if (!guilddb.welcomeMessageEnable) {
      console.log(`${member} entrou no servidor.`)
    } else {
    const embed = new EmbedBuilder()
    .setAuthor({name: `${member.user.tag}`, iconURL: `${member.user.displayAvatarURL({dynamic: true})}`})
    .setTitle(`BOAS VINDAS!`)
    .setDescription(`${member} *É o novo membro do servidor, seja muito bem vindo(a) em **${member.guild.name}**.*\n\nUma boa curiosidade: Você é o membro **${member.guild.memberCount}** do servidor!`)
    .addFields({name: `Regras:`, value: `<#1048268475405193226>`, inline: true},
    {name: `Resgistre-se:`, value: `<#1048268478102110298>`, inline: true},
    {name: `Interaja Em:`, value: `<#1048268479108759635>`})
    .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true})}`)
    .setFooter({text: `${member.guild.name}`, iconURL: `${member.guild.iconURL({ dynamic: true})}`})
    .setTimestamp(new Date())
  
    channel.send({embeds: [embed], content: `${member}`})
    }
  },
};
