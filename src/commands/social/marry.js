const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const User = require('../../schemas/users')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("casar")
    .setDescription("Casar com algum usuário")
    .addUserOption((option) => option.setName('usuário').setDescription('Selecione um usuário').setRequired(true)),

  async execute(interaction, client, args) {

    const user = interaction.options.getUser("usuário")

    let userProfile = (await User.findOne({ userId: interaction.user.id }))
    let userProfile2 = (await User.findOne({ userId: user.id }))

    if (!userProfile){
        const newUser = new User({
            userId: interaction.user.id
        })
        await newUser.save()

        userProfile = (await User.findOne({ userId: interaction.id }))
    }

    if (!userProfile2){
        const newUser = new User({
            userId: user.id
        })
        await newUser.save()

        userProfile2 = (await User.findOne({ userId: user.id }))
    }


    if (interaction.user.id == user.id) return interaction.reply({
        embeds: [new EmbedBuilder()
            .setTitle(`WARNING`)
            .setColor("Red") 
            .setDescription(`**Calma!** Você não pode se casar consigo mesmo.`)
        ], ephemeral: true
    })

    if (userProfile.marry.married) return interaction.reply({
        embeds: [new EmbedBuilder()
            .setTitle(`WARNING`)
            .setColor("Red")
            .setDescription(`**Calma!** Você já está casado com alguém.`)
        ], ephemeral: true
    })

    if (userProfile2.marry.married) return interaction.reply({
        embeds: [new EmbedBuilder()
            .setTitle(`WARNING`)
            .setColor("Red")
            .setDescription(`**Calma!** ${user} já está casado com alguém.`)
        ], ephemeral: true
    })

    button = new ButtonBuilder()
    .setCustomId('acceptMarry')
    .setLabel('Aceitar')
    .setStyle(ButtonStyle.Success)

    button2 = new ButtonBuilder()
    .setCustomId('rejectMarry')
    .setLabel('Recusar')
    .setStyle(ButtonStyle.Danger)

    const rowAction = new ActionRowBuilder()
    .addComponents(button, button2)

    const embed = new EmbedBuilder()
    .setTitle('💒 Casamento 💍')
    .setDescription(`Ei ${user}. ${interaction.user} quer viver um romance(casar) com você, aceitas?`)
    .setColor('DarkVividPink')

    await interaction.reply({
        embeds: [embed],
        components: [rowAction], 
        fetchReply: true
    }).then((msg) => {
        const collector = msg.createMessageComponentCollector({
          idle: 1000 * 60 * 10,
        });

        collector.on("collect", async (i) => {
          if (i.user.id != user.id)
            return i.reply({
              embeds: [new EmbedBuilder()
                .setTitle(`WARNING`)
                .setColor("Red")
                .setDescription(
                  `Só quem recebeu o pedido de casamento pode usar o botão.`
                )],
              ephemeral: true,
            });

            collector.stop();

            if (i.customId == "acceptMarry") {

                await User.updateOne({
                    userId: interaction.user.id
                }, {
                    $set: {
                        "marry.married": true,
                        "marry.with": user.id
                    }
                })

                await User.updateOne({
                    userId: user.id
                }, {
                    $set: {
                        "marry.married": true,
                        "marry.with": interaction.user.id
                    }
                })


                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setTitle(`FESTAS E FESTAS`)
                        .setColor("Green")
                        .setDescription(`${user} aceitou o pedido de casamento de ${interaction.user}!`)
                    ], components: []
                })

            }

            
            if (i.customId == "denyMarry") {
                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setTitle(`Sinto a sua dor amigo...`)
                        .setColor("Red")
                        .setDescription(`${user} recusou o pedido de casamento de ${interaction.user}.`)
                    ], components: []
                })

            }

        });
      });
  },
};
