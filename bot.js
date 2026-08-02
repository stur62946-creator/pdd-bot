const axios = require('axios');

// === Берём данные из переменных окружения (не хардкод!) ===
const BOT_TOKEN = process.env.MAX_BOT_TOKEN || process.env.MAX_TOKEN;
const CHANNEL_ID = '77483436379527';  // Твой ID канала
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

// Обработчик событий (бот слушает)
process.on('message', async (event) => {
  try {
    // Если это команда /start от админа
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
        // Отправляем в канал
        await sendMessage(CHANNEL_ID, q.text, keyboard, q.image);
        // Отправляем подтверждение админу
        await sendMessage(peerId, '✅ Пост отправлен в канал!');
      }
    }

    // Если это нажатие на кнопку
    if (event.type === 'message_payload') {
      const payload = JSON.parse(event.message?.payload || '{}');
      const q = questions[0];
      const isCorrect = payload.answer === q.correct;
      const resp = isCorrect ? '✅ Верно!' : `❌ Неверно. Правильный ответ: ${q.options[q.correct]}`;
      await sendMessage(event.message?.peer_id, resp);
    }
  } catch (err) {
    console.error('❌ Ошибка:', err.message);
  }
});

// Держим процесс живым
console.log('🤖 Бот запущен и слушает команды...');
setInterval(() => {}, 1 << 30);
