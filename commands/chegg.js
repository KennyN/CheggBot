const playwright = require('playwright');
const { firefox } = require('playwright');
const Discord = require('discord.js');
const { info } = require('../config.json');
const fs = require('fs');

module.exports = {
    name: 'chegg',
    description: 'Opens chegg',
    cooldown: 8,

    async execute(message, args) {

        function delay(time) {
            return new Promise(function(resolve) { 
                setTimeout(resolve, time)
            });
        }
        if (message.channel.name.toLowerCase() !== 'chegg-bot') {
            let cheggChannel = message.guild.channels.cache.find(channel => channel.name.toLowerCase() === 'chegg-bot');
            return message.reply(`Incorrect channel. Please use that in ${cheggChannel}.`);
        };
        const embed = new Discord.MessageEmbed()
        .setColor('#ffd100')
        .setTitle('Pending')
        .setDescription('Fetching, please wait.')
        .addFields({
            name: 'Status', 
            value: '0%'
        })
        .setFooter(`v${info.version} | lunasoftware.io`);
        let firstEmbed = await message.channel.send(embed);

        const quarter = new Discord.MessageEmbed()
            .setColor('#ffd100')
            .setTitle('Pending')
            .setDescription('Fetching, please wait.')
            .addFields({
                name: 'Status', 
                value: `${Math.floor(5 + (Math.random() * 30))}%`
            })
            .setFooter(`v${info.version} | lunasoftware.io`);

        const sixty = new Discord.MessageEmbed()
            .setColor('#ffd100')
            .setTitle('Pending')
            .setDescription('Fetching, please wait.')
            .addFields({
                name: 'Status', 
                value: `${Math.floor(36 + (Math.random() * 60))}%`
            })
            .setFooter(`v${info.version} | lunasoftware.io`);
            
            const userDataDir = 'urlpa3h4.default-default';

            // creates instance of FireFox
            const context = await firefox.launchPersistentContext(userDataDir, ({
                proxy: {
                    server: info.proxy.server,
                    username: info.proxy.username,
                    password: info.proxy.password
                },
                headless: false,
                slowMo: 50
            })) 
        try {
            if (!args.length || args.length > 1) {
                const lengthFail = new Discord.MessageEmbed()
                .setColor('#e72118')
                .setTitle('Failure')
                .setDescription('Make sure you are using the command correctly. It should be `!chegg link`')
                .setFooter(`v${info.version} | lunasoftware.io`);
                await context.close();
                 return firstEmbed.edit(lengthFail);
            } else if (!args[0].startsWith('https://www.chegg.com')  || args[0].endsWith('.xml', args[0].length)) {
                const newEmbed = new Discord.MessageEmbed()
                .setColor('#e72118')
                .setTitle('Failure')
                .setDescription('Please enter a valid Chegg link')
                .setFooter(`v${info.version} | lunasoftware.io`);
                await context.close();
                 return firstEmbed.edit(newEmbed);
            }
            
            // Sets new page
            const page = await context.newPage();
        
            console.log("Checking page...");
            await page.goto(args[0], ({
                options: {
                    referer: 'https://www.google.com/'
                }
            }));
            
            firstEmbed.edit(quarter);
            
            // Find out type of header and removes it
            const regularHeader = await page.$('oc-component[data-name="chegg-header"]');
            const prepHeader = await page.$('.header-root-nav-prep-header');
            const textbookHeader = await page.$('div[role="banner"]');
            if (regularHeader) {
                await page.$eval('oc-component[data-name="chegg-header"]', element => element.style.display = "none");
            } else if (prepHeader) {
                await page.$eval('.header-root-nav-prep-header', element => element.style.display = "none");
            } else if (textbookHeader) {
                await page.$eval('div[role="banner"]', element => element.style.display = "none");
            }else {
                console.log("failed to find header");
            }
        
            console.log("Taking screenshot...");
            firstEmbed.edit(sixty);
            let today = Date.now();
            
            // Checks what type of question it is and screenshots that element
            const regularAnswer = await page.$('.answers-wrap');
            const flashcardAnswer = await page.$('section[color="interface_color_11"]');
            const textbookAnswer = await page.$('section[class="main"]');
            const textbookAnswer2 = await page.$('.solution-player-sdk');
            const multiStep = await page.$('div[id="enhanced-content"]');
            if (regularAnswer) {
                const answer = await page.$('.answers-wrap');
                await answer.screenshot( {path:`screenshots/${today}.png`,} );
            } else if (flashcardAnswer) {
                const answer = await page.$('section[color="interface_color_11"]');
                await answer.screenshot( {path:`screenshots/${today}.png`,} );
            } else if (textbookAnswer) {
                const answer = await page.$('section[class="main"]');
                await answer.screenshot( {path:`screenshots/${today}.png`,} );
            } else if (textbookAnswer2) {
                const answer = await page.$('.solution-player-sdk');
                await answer.screenshot( {path:`screenshots/${today}.png`,} );
            } else if (multiStep) {
                const answer = await page.$('div[id="enhanced-content"]');
                await answer.screenshot( {path:`screenshots/${today}.png`,} );
            } else {
                // tells user to enter valid link
                const newEmbed = new Discord.MessageEmbed()
                .setColor('#e72118')
                .setTitle('Failure')
                .setDescription('Please enter a valid Chegg link. If you believe this is an error contact support.')
                .setFooter(`v${info.version} | lunasoftware.io`);
                await context.close();
                 return firstEmbed.edit(newEmbed);
            }

            console.log("Done!");

            const file = new Discord.MessageAttachment(`./screenshots/${today}.png`);

            const newEmbed = new Discord.MessageEmbed()
            .setColor('#26dd23')
            .setTitle('Success')
            .setDescription(`${message.author}, your Chegg answer is ready. Check your DM's.`)
            .addFields({
                name: 'Status', 
                value: `Done`
            })
            .setFooter(`v${info.version} | lunasoftware.io`);
            firstEmbed.edit(newEmbed);

            await message.author.send(`Hi ${message.author}. Here is your Chegg answer:`, file);
            fs.unlinkSync(`./screenshots/${today}.png`); // deletes file

            await delay(5000);
            await context.close();
    } catch(error) {
         await context.close();
        console.error(error);
        const newEmbed = new Discord.MessageEmbed()
            .setColor('#e72118')
            .setTitle('Failure')
            .setDescription(`Could not find an answer for ${args[0]}. Please make sure it is a valid Chegg link. Contact support for any additional help.`)
            .addFields({
                name: 'Status', 
                value: `${error}`
            })
            .setFooter(`v${info.version} | lunasoftware.io`);
            firstEmbed.edit(newEmbed);
            message.reply("Chegg error");
    }

        }
}