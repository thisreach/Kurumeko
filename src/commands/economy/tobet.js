const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const User = require('../../schemas/users')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("apostar")
    .setDescription("Apostar com algum usuário")
    .addUserOption((option) => 
    option
    .setName('usuário')
    .setDescription('Selecione o usuário')
    .setRequired(true))
    .addNumberOption((option) =>
    option
      .setName("quantidade")
      .setDescription("Digite a quantidade da retirada")
      .setRequired(true)
      .setMinValue(100)
  ),

  async execute(interaction, client, args) {

    const user = interaction.options.getUser("usuário");
    const amount = interaction.options.getNumber('quantidade')

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
            .setDescription(`**Calma!** Você não pode apostar consigo mesmo.`)
        ], ephemeral: true
    })

    if (userProfile.money < amount) {
        interaction.reply(`Você não possui \`${amount}\` moedas para apostar.`)
    } else if (userProfile2.money < amount) {
        interaction.reply({
            content: `O usuário \`${user.tag}\` não possui \`${amount}\` moedas para apostar.`,
            ephemeral: true
        })
    } else {

        const competitors = [user, interaction.user];
        const win = competitors[Math.floor(Math.random() * competitors.length)];


        interaction.reply({
            embeds: [new EmbedBuilder()
            .setTitle('APOSTA')
            .setColor('Blue')
            .setDescription(`Olá ${user}, o usuário ${interaction.user} deseja apostar \`${amount}\` moedas com você!\nClique abaixo para aceitar a aposta.`)],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel("Aceitar aposta!")
                            .setEmoji("💲")
                            .setCustomId(`accept`)
                    )
            ]
        }).then(() => {

            let filter = (msg) => msg.customId === `accept` && msg.user.id === user.id;
            let collect = interaction.channel.createMessageComponentCollector({ filter: filter, max: 1 })

            collect.on("collect", (c) => {

                if (win.id === user.id) {

                    c.reply(`Parabéns ${win}! Você ganhou \`${amount}\` moedas de ${interaction.user} na aposta.`);
                    userProfile.money = userProfile.money - amount; userProfile.save();
                    userProfile2.money = userProfile.money + amount; userProfile2.save();

                } else if (win.id === interaction.user.id) {

                    c.reply(`Parabéns ${win}! Você ganhou \`${amount}\` moedas fornecidas por ${user} na aposta.`);
                    userProfile.money = userProfile.money + amount; userProfile.save();
                    userProfile2.money = userProfile.money - amount; userProfile2.save();

                }

            });

            collect.on("end", () => {
                interaction.editReply({
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setDisabled(true)
                                    .setStyle(ButtonStyle.Success)
                                    .setLabel("Aceitar aposta!")
                                    .setEmoji("💲")
                                    .setCustomId(`accept` + interaction.id)
                            )
                    ]
                })
            })})

    }

  },
};
