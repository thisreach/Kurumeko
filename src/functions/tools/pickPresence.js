const { ActivityType } = require('discord.js')

module.exports = (client) => {
    client.pickPresence = async () => {
        const options = [
            {
                type: ActivityType.Watching,
                text: "Olá, me chamo Kurumeko",
                status: "online"
            },
            {
                type: ActivityType.Listening,
                text: "Para a sua diversão!",
                status: "idle"
            },
            {
                type: ActivityType.Playing,
                text: "Espero oque para me adicionar?",
                status: "dnd"
            }
        ];
        const option = Math.floor(Math.random() * options.length);

        client.user
        .setPresence({
            activities: [{
                name: options[option].text,
                type: options[option].type,
            }],
            status: options[option].status
        });
    };
};