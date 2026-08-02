const { Bot } = require('@maxhub/max-bot-api');

const BOT_TOKEN = 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';

const bot = new Bot(BOT_TOKEN);

bot.command('start', (ctx) => {
  ctx.reply('✅ Бот работает! Привет!');
});

bot.start();

console.log('🤖 Бот запущен (официальный пакет). Жду /start...');
