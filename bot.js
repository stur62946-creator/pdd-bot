const { Bot } = require('@maxhub/max-bot-api');

const BOT_TOKEN = 'f9LHodD0cOKXMHP37xldc4aOnIDrcWurLnRAdVE8lw6xo_7If_pFn9UDZ4LUxEouW9xZORdBt-jMoJFdlPvJ';

const bot = new Bot(BOT_TOKEN);

bot.command('start', (ctx) => {
  ctx.reply('Привет! Ты написал /start');
});

bot.start();

console.log('🤖 Бот запущен с официальным SDK Max.');
