const { SlashCommandBuilder } = require('discord.js');
const User = require('../../schemas/users')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sobremim")
    .setDescription("Mude seu sobre mim do perfil")
    .addStringOption((option) => option.setName('aboutme').setDescription('Digite oq deseja colocar.').setRequired(true)),

  async execute(interaction, client, args) {

    const aboutme = interaction.options.getString('aboutme');

    let userProfile = await User.findOne({
        userId: interaction.id
    })

    if (!userProfile){
        const newUser = new User({
            userId: interaction.user.id
        })
        await newUser.save()

        userProfile = (await User.findOne({ userId: interaction.id }))
    }

    await User.updateOne(
        {
          userId: interaction.id,
        },
        {
          $set: {
            aboutme: `${aboutme}`,
          },
        }
      );

    await interaction.reply({
        content: `Você mudou seu sobre mim para: \`${aboutme}\``, ephemeral: true
    })


  },
};
