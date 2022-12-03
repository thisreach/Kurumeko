const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

const clanPage = async (client, message, pages, timeout, clanLenght) => {
  if (!message && !message.channel) throw new Error("Channel is inaccessible.");
  if (!pages) throw new Error("As páginas não são dadas.");

  const button = new ButtonBuilder()
    .setCustomId("back")
    .setLabel("⬅")
    .setStyle(ButtonStyle.Primary);

  const button2 = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("➡")
    .setStyle(ButtonStyle.Primary);

  const actionRow = new ActionRowBuilder().addComponents(button, button2);

  let page = 0;
    const curPage = await message.editReply({ embeds: [pages[page].setFooter({ text: `Página • ${page + 1}/${pages.length} | ${clanLength} • Total de clãs`})], components: [actionRow], allowedMentions: { repliedUser: false } });
    if(pages.length == 0) return;

    const filter = (m) => m.user.id === message.user.id;
    const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });

    collector.on('collect', async (interaction) => {
            if(!interaction.deferred) await interaction.deferUpdate();
            if (interaction.customId === 'back') {
                page = page > 0 ? --page : pages.length - 1;
            } else if (interaction.customId === 'next') {
                page = page + 1 < pages.length ? ++page : 0;
            }
            curPage.edit({ embeds: [pages[page].setFooter({ text: `Página • ${page + 1}/${pages.length} | ${clanLength} • Total de clãs` })], components: [actionRow] })
        });
    collector.on('end', () => {
        const disabled = new ActionRowBuilder()
            .addComponents(button.setDisabled(true), button2.setDisabled(true))
        curPage.edit({ embeds: [pages[page].setFooter({ text: `Páginas • ${page + 1}/${pages.length} | ${clanLength} • Total de clãs` })], components: [disabled] })
    });
    return curPage;
};

module.exports = { clanPage };
