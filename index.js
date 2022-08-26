const Discord = require('discord.js');
const fs = require('fs');
const playwright = require('playwright');
const { firefox } = require('playwright');
const { config } = require('dotenv');
const { info, prefix, token, words_array } = require('./config.json');

const client = new Discord.Client({
    disableEveryone: true
});

client.login(token);
console.log(info.proxy.server);

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); 

config();

client.once('ready', () => {
    console.log('Ready');
    client.user.setActivity(`v${info.version} | lunasoftware.io`, {type: "PLAYING"});
});

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(command);
    client.commands.set(command.name, command);
}


client.on('message', async message => {
    
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;
    if (message.channel.type === "dm") {
        return message.reply(`Commands are only available through servers.`)
    };
    
    const command = client.commands.get(commandName);

    try {
        command.execute(message, args);
    } catch(error) {
        console.error(error);
        message.reply('There was an issue executing that command');
    }


});