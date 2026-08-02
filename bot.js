const { MaxBotApiClient } = require('@max.messenger/bot-api');

const BOT_TOKEN = process.env.MAX_BOT_TOKEN || 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';

const client = new MaxBotApiClient({
  token: BOT_TOKEN,
  longPoll: true // Включаем режим Long Poll
});

client.on('message_new', async (event) => {
  const text = event.message?.text?.toLowerCase();
  const peerId = event.message?.peerId;

  if (text === '/start') {
    await client.messages.send({
      peerId: peerId,
      text: '✅ Бот работает! Команда /start получена.'
    });
    console.log('✅ Ответил на /start');
  }
});

console.log('🤖 Бот запущен (официальный SDK). Жду /start...');
