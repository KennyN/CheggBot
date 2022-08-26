const Discord = require('discord.js');
const { info } = require('../config.json');

module.exports = {
    name: 'ping',
    description: 'Ping Command',
    async execute(message, args) {
        
        function delay(time) {
            return new Promise(function(resolve) { 
                setTimeout(resolve, time)
            });
        }

        const exampleEmbed = new Discord.MessageEmbed()
        .setTitle('Some title')
        .attachFiles(['./assets/loading.gif'])
        .setImage('attachment://loading.gif');

        const firstEmbed = await message.channel.send(exampleEmbed);

        await delay(2000);
        console.log("change now");
        const newEmbed = new Discord.MessageEmbed()
            .setColor('#26dd23')
            .setTitle('Success')
            .setDescription(`lets goo`)
            .attachFiles([`./screenshots/dasda.png`])
            .setImage(`attachment://dasda.png`)
            .setFooter(`v${info.version} | lunasoftware.io`);
            firstEmbed.edit(newEmbed);
    }
};