const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: "messageCreate",
    async execute(message, client) {

        if(!message.guild) return;
        if(message.author?.bot) return;

        const guild = message.guild;

        if(!guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
        if(message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

        setTimeout(() => {

            if(url.test(message) || message.content.includes('discord.gg/')) {
                message.channel.send({content: `${message.author.username}, aqui não é permitido links` }).then(mg => setTimeout(mg.delete.bind(mg), 10000 ))
                message.delete();
        
                return;
            }
        
                
            }, 2000);

    }
}