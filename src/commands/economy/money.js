const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../schemas/users");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("money")
    .setDescription("Veja os comandos de economia")
    .addSubcommand((option) =>
      option
        .setName("ver")
        .setDescription("Veja o dinheiro atual")
        .addUserOption((option) =>
          option.setName("usuário").setDescription("Selecione um usuário")
        )
    )
    .addSubcommand((option) =>
    option
      .setName("pagar")
      .setDescription("Pagar algum usuário")
      .addUserOption((option) =>
        option.setName("usuário").setDescription("Selecione um usuário").setRequired(true)
      )
      .addNumberOption((option) => option.setName('quantidade').setDescription('Selecione a quantidade').setRequired(true))
  )
    .addSubcommand((option) =>
      option.setName("rank").setDescription("Veja os ranks money do servidor.")
    )
    .addSubcommand((option) =>
      option
        .setName("depositar")
        .setDescription("Depositar o seu dinheiro")
        .addNumberOption((option) =>
          option
            .setName("quantidade")
            .setDescription("Digite a quantidade do deposito")
            .setRequired(true)
            .setMinValue(100)
        )
    )
    .addSubcommand((option) =>
    option
      .setName("retirar")
      .setDescription("Retirada do seu dinheiro")
      .addNumberOption((option) =>
        option
          .setName("quantidade")
          .setDescription("Digite a quantidade da retirada")
          .setRequired(true)
          .setMinValue(100)
      )
  ),

  async execute(interaction, client, args) {
    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "ver":
        {
          const user =
            interaction.options.getUser("usuário") || interaction.member.user;
          let userProfile =
            (await User.findOne({ userId: user.id })) ||
            new User({ userId: user.id });

          const embed = new EmbedBuilder()
            .setTitle(`${user.username} dinheiro atual`)
            .setDescription(
              `OBS: Essas são os detalhes de banco e carteira do usuário`
            )
            .setColor("Blue")
            .setThumbnail(user.displayAvatarURL())
            .setFields(
              {
                name: "Carteira",
                value: `**\` ${userProfile.money} 💵 \`**`,
                inline: true,
              },
              {
                name: "Banco",
                value: `**\` ${userProfile.bank} 💵 \`**`,
                inline: true,
              }
            );

          await interaction.reply({
            embeds: [embed],
          });
        }
        break;
      case "pagar":
       {

        const user = interaction.options.getUser('usuário');
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

        if (amount > userProfile.money) {
          interaction.reply(`Você não possui \`${amount}\` moedas, possui apenas \`${userProfile.money}\` moedas.`);
      } else {
         userProfile.money = userProfile.money - amount; userProfile.save();
         userProfile2.money = userProfile.money + amount; userProfile2.save();

          interaction.reply(`Você enviou \`${amount}\` moedas para ${user} com sucesso.`)
      }


       }
        break;
      case "rank":
        {
          await interaction.deferReply();

          let users = await User.find().then((users) => {
            return users.filter(
              async (user) => await interaction.guild.members.fetch(user.userId)
            );
          });

          const sortedUsers = users
            .sort((a, b) => {
              return b.money + b.bank - (a.money + a.bank);
            })
            .slice(0, 10);

          return interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: `🏆 - ${interaction.guild.name} Ranks`,
                })
                .setColor("Blue")
                .setDescription(
                  sortedUsers
                    .map((user, index) => {
                      return `**\` [ ${index + 1} ] \`** : **<@${
                        user.userId
                      }>** : \` ${format(user.money + user.bank)} 💵 \``;
                    })
                    .join("\n")
                ),
            ],
          });
        }
        break;
      case "depositar":
        {
          const user = interaction.member.user,
            amount = interaction.options.getNumber("quantidade");
          (userProfile =
            (await User.findOne({ id: user.id })) || new User({ id: user.id })),
            (embed = new EmbedBuilder().setColor("Blue"));

          if (userProfile.money < amount)
            return interaction.reply({
              embeds: [
                embed.setDescription(`💰 Você precisa de \`${ amount - userProfile.money } 💵 \` para depositar no banco`),
              ],
              ephemeral: true,
            });

          userProfile.money -= amount;
          userProfile.bank += amount;
          userProfile.save();

          return interaction.reply({
            embeds: [
              embed.setDescription(
                `Você depositou \` ${amount} 💵 \` na sua conta do banco`
              ),
            ],
          });
        }
        break;
        case 'retirar':
          {

        const user = interaction.member.user,
        amount = interaction.options.getNumber("quantidade")
        userProfile = await User.findOne({ id: user.id }) || new User({ id: user.id }),
        embed = new EmbedBuilder()
        .setColor('Blue')

        if (userProfile.bank < amount) return interaction.reply({
            embeds: [ embed.setDescription(`Você precisa de \` ${amount - userProfile.bank} 💵 \` para retirar do banco`) ],
            ephemeral: true
        })

        userProfile.bank -= amount
        userProfile.money += amount
        userProfile.save()

        return interaction.reply({
            embeds: [ embed.setDescription(`Você retirou \` ${amount} 💵 \` da sua conta do banco`) ]
        })

          }
          break;

      default:
        break;
    }
  },
};

function format(number, precision = 2) {
  return number.toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: precision,
  });
}
