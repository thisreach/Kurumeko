const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("destrancar")
    .setDescription("Destrancar um canal")
    .addChannelOption((option) =>
      option.setName("canal").setDescription("Selecione o canal")
    ),

  async execute(interaction, client, args) {

    if (!interaction.member.permissions.has("MANAGE_CHANNELS")) {
        interaction.reply({ content: `Você não possui a permissão para poder utilizar este comando.`})
    } else {

    const channel =interaction.options.getChannel("canal") || interaction.channel;

    const embed = new EmbedBuilder()
    .setTitle("Canal Destrancado🔓")
    .setColor('Random')
    .setDescription(`O canal ${channel} foi destrancado por ${interaction.user} `)

    await interaction.reply({ embeds: [embed] }).then(msg => {
        channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true }).catch(e => {
            console.log(e)
            interaction.reply({ content: `Ops, algo deu errado ao tentar destrancar este chat.`})
        })
    })

    }
  },
};
