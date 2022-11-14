const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../schemas/users");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trabalhar")
    .setDescription("Vamos trabalhar vagabundo"),

  async execute(interaction, client, args) {

    var jobs = [
        "🧑‍🏫 Professor",
        "🧑‍⚕️ Doutor",
        "👮 Policial",
        "🧑‍🍳 Chefe",
        "🧑‍🚒 Bombeiro",
        "🚌 Motorista de onibus",
        "🧑‍🔬 Cientista",
        "📮 Fretista",
        "🧑‍🏭 Engenheiro",
        "🧑‍🎨 Artista",
        "🧑‍✈️ Piloto"
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
              `⌛ Você pode trabalhar novamente em **\`${ms(calc).hours} horas ${ms(calc).minutes} minutos ${ms(calc).seconds} segundos\`**`
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
        `Você trabalhou de **\` ${job} \`** e ganhou \`${amount}\``
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
