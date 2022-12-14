const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../schemas/users");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trabalhar")
    .setDescription("Vamos trabalhar vagabundo"),

  async execute(interaction, client, args) {

    var jobs = [
        "ð§âð« Professor",
        "ð§ââï¸ Doutor",
        "ð® Policial",
        "ð§âð³ Chefe",
        "ð§âð Bombeiro",
        "ð Motorista de onibus",
        "ð§âð¬ Cientista",
        "ð® Fretista",
        "ð§âð­ Engenheiro",
        "ð§âð¨ Artista",
        "ð§ââï¸ Piloto"
    ]

    const user = interaction.member.user;
    const userProfile =
      (await User.findOne({ userId: user.id })) ||
      new User({ userId: user.id });

    if (userProfile.cooldowns.work > Date.now()){
        const calc = userProfile.cooldowns.work - Date.now()
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription(
              `â VocÃª pode trabalhar novamente em **\`${ms(calc).hours} horas ${ms(calc).minutes} minutos ${ms(calc).seconds} segundos\`**`
            ),
        ],
        ephemeral: true,
      });
    }

    const amount = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
    const job = jobs[Math.floor(Math.random() * jobs.length)];

    userProfile.money += amount;
    userProfile.cooldowns.work = Date.now() + 1000 * 60 * 60;
    userProfile.save();

    const embed = new EmbedBuilder()
      .setDescription(
        `VocÃª trabalhou de **\` ${job} \`** e ganhou \`${amount}\``
      )
      .setColor("Blue");

    return interaction.reply({ embeds: [embed] });
  },
};

function ms(ms) {
    const seconds = ~~(ms / 1000)
    const minutes = ~~(seconds / 60)
    const hours = ~~(minutes / 60)
    const days = ~~(hours / 24)

    return { days, hours: hours % 24, minutes: minutes % 60, seconds: seconds % 60 }
}
