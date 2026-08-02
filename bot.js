const { Bot } = require('@maxhub/max-bot-api');

const bot = new Bot(process.env.MAX_BOT_TOKEN || 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf');

// Обработчик для команды '/start'
bot.command('start', (ctx) => ctx.reply('Добро пожаловать!'));

// Обработчик для любого другого сообщения
bot.on('message_created', (ctx) => ctx.reply('Новое сообщение'));

// Запускаем бота (Long Poll)
bot.start();
