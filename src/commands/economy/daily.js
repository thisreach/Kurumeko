const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../schemas/users");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Resgate seu daily"),

  async execute(interaction, client, args) {

    let userProfile = (await User.findOne({ userId: interaction.user.id }))

    if (!userProfile){
        const newUser = new User({
            userId: interaction.user.id
        })
        await newUser.save()

        userProfile = (await User.findOne({ userId: interaction.id }))
    }

    if (userProfile.cooldowns.daily > Date.now()) {
      const calc = userProfile.cooldowns.daily - Date.now();

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription(
              `⌛ Você coletou seu daily, aguarde ${ms(calc).hours} horas ${
                ms(calc).minutes
              } minutos ${ms(calc).seconds} segundos`
            ),
        ],
        ephemeral: true,
      });
    }

    userProfile.money += 100
    userProfile.cooldowns.daily = Date.now() + 86400000
    userProfile.save()

    return interaction.reply({
        embeds: [ new EmbedBuilder()
          .setColor('Blue')
          .setDescription(`💰 Você coletou do seu daily \` 100 💵 \` dinheiro`) ]
    })

  },
};

function ms(ms) {
  const seconds = ~~(ms / 1000);
  const minutes = ~~(seconds / 60);
  const hours = ~~(minutes / 60);
  const days = ~~(hours / 24);

  return {
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
  };
}


