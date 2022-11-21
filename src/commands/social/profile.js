const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../schemas/users')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("perfil")
    .setDescription("Veja o embed de perfil")
    .addUserOption((option) => option.setName('usuário').setDescription('Selecione um usuário')),

  async execute(interaction, client, args) {

    const user = interaction.options.getUser("user") || interaction.user

    const bot = user ? user.bot : interaction.user.bot;
    if (bot) return interaction.editReply("Você não pode ver o perfil dos bots")
    
    let userProfile = (await User.findOne({ userId: user.id }))

    if (!userProfile){
      const newUser = new User({
          userId: interaction.user.id
      })
      await newUser.save()

      userProfile = (await User.findOne({ userId: user.id }))
  }

    if(userProfile.marry.with && !client.users.cache.get(userProfile.marry.with)){
      await client.users.fetch(userProfile.marry.with, true);
    }

    const avatarURL = user ? user.displayAvatarURL({ format: "png", size: 512 }) : interaction.user.displayAvatarURL({ format: "png", size: 512 });
    const userTag = user ? user.tag : user.user.tag;
    const userUsername = user ? user.username : user.user.username;

    const marryUser = !userProfile.marry.with ? "Não está casado" : client.users.cache.get(userProfile.marry.with).tag;

    const embed = new EmbedBuilder()
    .setColor('Blue')
    .setAuthor({ name: userTag, iconURL: avatarURL })
    .setThumbnail(avatarURL)
    .setDescription(`Você está visualizando o perfil de ${user}`)
    .addFields({ name: "Nome:", value: `\`${userUsername}\``, inline: true})
    .addFields({ name: "Rank:", value: `\`Embreve 💠\``, inline: true})
    .addFields({ name: "Casado:", value: `\`💞 ${marryUser}\``, inline: true})
    .addFields({ name: "Instagram:", value: `\`${userProfile.instagram}\``, inline: true})

    await interaction.reply({
        embeds: [embed]
    })


  },
};
