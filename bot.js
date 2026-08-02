const axios = require('axios');

// Твои данные
const BOT_TOKEN = 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';
const CHANNEL_ID = '77483436379527';
const API_URL = 'https://api.max.ru/messages.send';

// Тестовый вопрос
const questions = [
  {
    id: 1,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Road_sign_3.27.svg/1200px-Road_sign_3.27.svg.png',
    text: 'Что означает знак 3.27?',
    options: ['Остановка запрещена', 'Стоянка запрещена', 'Движение запрещено', 'Пешеходный переход'],
    correct: 0
  }
];

// Функция отправки
async function sendMessage(peerId, text, keyboard = null, attachment = null) {
  const payload = { peer_id: peerId, text: text };
  if (keyboard) payload.keyboard = keyboard;
  if (attachment) payload.attachment = attachment;

  await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${BOT_TOKEN}` }
  });
}

// Глобальный обработчик события (вместо http-сервера)
// Важно: на bothost.ru этот код запускается как обычный процесс,
// а события приходят через вызов этого модуля
process.on('message', async (event) => {
  try {
    if (event.type === 'message_new') {
      const text = event.message?.text?.toLowerCase();
      const peerId = event.message?.peer_id;

      if (text === '/start') {
        const q = questions[0];
        const keyboard = {
          inline: true,
          buttons: q.options.map((opt, index) => [
            { type: 'text', label: opt, payload: JSON.stringify({ answer: index }) }
          ])
        };
        await sendMessage(CHANNEL_ID, q.text, keyboard, q.image);
        await sendMessage(peerId, '✅ Пост отправлен в канал!');
      }
    }

    if (event.type === 'message_payload') {
      const payload = JSON.parse(event.message?.payload || '{}');
      const q = questions[0];
      const isCorrect = payload.answer === q.correct;
      const resp = isCorrect ? '✅ Верно!' : `❌ Неверно. Правильный ответ: ${q.options[q.correct]}`;
      await sendMessage(event.message?.peer_id, resp);
    }
  } catch (err) {
    console.error('Ошибка обработки:', err.message);
  }
});

// Просто держим процесс живым
console.log('🤖 Бот запущен в режиме Callback...');
setInterval(() => {}, 1 << 30); // бесконечный таймер, чтобы процесс не завершился
