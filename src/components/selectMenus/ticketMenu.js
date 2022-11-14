const { EmbedBuilder, ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: {
      name: "ticket",
    },
    async execute(interaction, client) {

        let option = interaction.values[0]
        if (option === "report") {
        const name = `⛔ Denúncia de  de ${interaction.user.username}`;
        const category = "1022539800957431899" // Coloque o ID da categoria que deseja que fique 

        if (!interaction.guild.channels.cache.get(category)) category = null;

        if (interaction.guild.channels.cache.find(c => c.name === name)) {
          interaction.reply({ content: `Você já possui um ticket aberto em ${interaction.guild.channels.cache.find(c => c.name === name)}!`, ephemeral: true })
        } else {
          interaction.guild.channels.create({
            name: name,
            type: ChannelType.GuildText,
            parent: category,
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: [
                  PermissionFlagsBits.ViewChannel
                ]
              },
              {
                id: interaction.user.id,
                allow: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.AttachFiles,
                  PermissionFlagsBits.EmbedLinks,
                  PermissionFlagsBits.AddReactions
                ]
              }
            ]
          }).then((channel) => {
            interaction.reply({ content: `Olá ${interaction.user}, seu ticket foi aberto em ${channel}!`, ephemeral: true })
            const embed = new EmbedBuilder()
              .setColor("Random")
              .setDescription(`Olá ${interaction.user}, seu ticket foi criado na categoria Denúncia.

          Para acelerarmos, faça as seguintes coisas:
          > Nick do acusado
          > Nick da vitima (Opcional)
          > Anexo, screenshot ou vídeo 
          > Motivo`);
            const button = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("close_ticket")
                .setLabel("Fechar ticket")
                .setEmoji("🗑️")
                .setStyle(ButtonStyle.Danger)
            );

            channel.send({ embeds: [embed], components: [button] }).then(m => {
              m.pin()
            })
        })
    }
  } else if (option === "suport"){
    const name = `📨 Ticket de ${interaction.user.username}`;
    const category = "1022539800957431899" // Coloque o ID da categoria que deseja que fique 

    if (!interaction.guild.channels.cache.get(category)) category = null;

    if (interaction.guild.channels.cache.find(c => c.name === name)) {
      interaction.reply({ content: `Você já possui um ticket aberto em ${interaction.guild.channels.cache.find(c => c.name === name)}!`, ephemeral: true })
    } else {
      interaction.guild.channels.create({
        name: name,
        type: ChannelType.GuildText,
        parent: category,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [
              PermissionFlagsBits.ViewChannel
            ]
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.AttachFiles,
              PermissionFlagsBits.EmbedLinks,
              PermissionFlagsBits.AddReactions
            ]
          }
        ]
      }).then((channel) => {
        interaction.reply({ content: `Olá ${interaction.user}, seu ticket foi aberto em ${channel}!`, ephemeral: true })
        const embed = new EmbedBuilder()
          .setColor("Random")
          .setDescription(`Olá ${interaction.user}, seu ticket foi criado na categoria Suporte Geral
      
      Para acelerarmos, faça as seguintes coisas:
      > Manda sua dúvida, ou o motivo do ticket`);
        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("close_ticket")
            .setLabel("Fechar ticket")
            .setEmoji("🗑️")
            .setStyle(ButtonStyle.Danger)
        );

        channel.send({ embeds: [embed], components: [button] }).then(m => {
          m.pin()
        })
    })
}
  }
    },
  };