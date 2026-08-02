const { MaxBotApiClient } = require('max-bot-api-client-ts');
const fs = require('fs');
const path = require('path');

// ============================================================
// Твои данные
// ============================================================
const BOT_TOKEN = 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';
const CHANNEL_ID = '77483436379527';
// ============================================================

const client = new MaxBotApiClient({ token: BOT_TOKEN });

// База вопросов (тестовая)
const questions = [
  {
    id: 1,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Road_sign_3.27.svg/1200px-Road_sign_3.27.svg.png',
    text: 'Что означает знак 3.27?',
    options: ['Остановка запрещена', 'Стоянка запрещена', 'Движение запрещено', 'Пешеходный переход'],
    correct: 0
  }
];

// Команда /start
client.on('message_new', async (event) => {
  const text = event.message?.text?.toLowerCase();
  const peerId = event.message?.peerId;

  if (text === '/start') {
    const q = questions[0];
    const keyboard = {
      inline: true,
      buttons: q.options.map((opt, index) => [
        {
          type: 'text',
          label: opt,
          payload: JSON.stringify({ qId: q.id, answer: index })
        }
      ])
    };

    // Отправляем в канал
    await client.messages.send({
      peerId: CHANNEL_ID,
      text: q.text,
      attachment: q.image,
      keyboard: keyboard
    });

    // Подтверждаем админу
    await client.messages.send({
      peerId: peerId,
      text: '✅ Пост отправлен в канал!'
    });
  }
});

// Обработка нажатий на кнопки
client.on('message_payload', async (event) => {
  const payload = JSON.parse(event.message?.payload || '{}');
  const question = questions.find(item => item.id === payload.qId);
  if (!question) return;

  const isCorrect = payload.answer === question.correct;
  const response = isCorrect
    ? '✅ Верно!'
    : `❌ Неверно. Правильный ответ: ${question.options[question.correct]}`;

  await client.messages.send({
    peerId: event.message?.peerId,
    text: response
  });
});

console.log('🤖 Бот запущен (официальный клиент)');
