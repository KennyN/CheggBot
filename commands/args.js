const { DiscordAPIError } = require("discord.js");
const Discord = require('discord.js');
const { info } = require('../config.json');

module.exports = {
    name: 'args',
    description: 'args Command',
    execute(message, args) {
        if (!args.length) {
            const embed = new Discord.MessageEmbed()
            .setColor('#ff3a3a')
            .setTitle('ERROR')
            .setDescription('No arguments provided')
            .setFooter(`v${info.version} | lunasoftware.io`);

            return message.channel.send(embed);
        }
        message.channel.send(`Command: arg\nArgs: ${args}`);
    }
};