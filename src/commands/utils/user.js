const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const User = require('../../schemas/users')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Informações do usuário")
    .addSubcommand((option) => option.setName("info").setDescription("Veja informações do usuário").
    addUserOption(option => option.setName("usuário").setDescription("Selecione o usuário")))
    .addSubcommand((option) => option.setName("avatar").setDescription("Veja o icone de um usuário").
    addUserOption(option => option.setName("usuário").setDescription("Selecione o usuário"))),

  async execute(interaction, client, args) {

    const subCommands = interaction.options.getSubcommand();

    switch (subCommands) {
        case "info":{

            const userInfo = interaction.options.getUser('usuário') || interaction.user
            const userAvatar = userInfo.displayAvatarURL({ size: 4096, dynamic: true, format: "png"})
            const data = userInfo.createdAt.toLocaleDateString("pt-br");
            const userProfile = (await User.findOne({ userId: interaction.id }));

            const embedInfo = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({name: `${userInfo.username}`, iconURL: userInfo.displayAvatarURL({ dynamic: true })})
            .setThumbnail(userAvatar)
            .setFields(
                {
                    name: 'Tag',
                    value: `\`${userInfo.tag}\``,
                    inline: true
                },
                {
                    name: 'ID',
                    value: `\`${userInfo.id}\``,
                    inline: true
                },
                {
                    name: 'Data de crianção da conta',
                    value: `\`${data}\``,
                    inline: false
                },
            );

            await interaction.reply({
                embeds: [embedInfo]
            })
        }
            break;
            case "avatar":{
                const userAvatar = interaction.options.getUser('usuário') || interaction.user;
                const userImage = userAvatar.displayAvatarURL({ size: 4096, dynamic: true, format: "png"})

                const embedAvatar = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`${userAvatar.username}`)
                .setFooter({text: `Sua imagem de ${userAvatar.username} está pronta`})
                .setImage(userImage)

                const buttonAvatar = new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Abrir no navegador')
                    .setURL(userImage)

                await interaction.reply({
                    embeds: [embedAvatar], components: [new ActionRowBuilder().addComponents(buttonAvatar)]
                })
            }
            break;
    
        default:
            break;
    }

  },
};
