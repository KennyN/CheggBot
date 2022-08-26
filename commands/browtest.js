const playwright = require('playwright');
const { firefox } = require('playwright');
const Discord = require('discord.js');
const { info } = require('../config.json');
const fs = require('fs');

module.exports = {
    name: 'browtest',
    description: 'args Command',
    async execute(message, args) {
        console.log('browsertest')
        const page = await context.newPage();
        
            console.log("Checking page...");
            await page.goto('https://google.com');
    }
};