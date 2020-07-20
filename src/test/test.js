const ShenaniBot = require('../bot/index');
const botOptions = require('../config/config');

const bot = new ShenaniBot(botOptions);

(async function test() {
  console.log(await bot.command('!add 8zrr252', 'fantasmicgalaxy'));
  console.log(await bot.command('!add 0rl05d7', 'fantasmicgalaxy'));
  console.log(await bot.command('!add 9tsvnr9', 'fantasmicgalaxy'));
  console.log(await bot.command('!queue', 'fantasmicgalaxy'));
  console.log(await bot.command('!remove 0rl05d7', 'fantasmicgalaxy'));
  console.log(await bot.command('!queue', 'fantasmicgalaxy'));
})();