const playwright = require('playwright');
const { firefox } = require('playwright');
const fs = require('fs');

module.exports = {
    name: 'google',
    description: 'Opens Google',

    async execute(message, args) {

            function delay(time) {
                return new Promise(function(resolve) { 
                    setTimeout(resolve, time)
                });
            }
            const email = "19knguyen@haddontwpschools.com";
            const password = "instagram1116";
            const userDataDir = '/Users/Kenny/Desktop/Luna/urlpa3h4.default-default';
            

            const context = await firefox.launchPersistentContext(userDataDir, ({
                    headless: false,
                    slowMo: 50
            }))

            const page = await context.newPage();


            try {
                await page.goto("https://google.com");
                await page.click('a:has-text("Sign in")');
                await page.type('id=identifierId', email);
                await delay(2000);
                await page.click('span:has-text("next")');
            
                await page.click('input[type=checkbox]');
                await page.type('input[name="password"]', password);
                await page.click('span:has-text("next")');

                await delay(2000);
                await page.goto("https://mail.google.com");
            } catch(error) {
                console.error(error);
                return message.channel.send('An error has occured try again later');
            }

        }
}