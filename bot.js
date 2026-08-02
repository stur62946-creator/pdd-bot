const axios = require('axios');

// ============================================================
// Твои данные
// ============================================================
const BOT_TOKEN = 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';
const CHANNEL_ID = '77483436379527';
const API_URL = 'https://api.max.ru/messages.send';
const LONG_POLL_URL = 'https://api.max.ru/longpoll';

// Вопрос для теста
const questions = [
  {
    id: 1,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Road_sign_3.27.svg/1200px-Road_sign_3.27.svg.png',
    text: 'Что означает знак 3.27?',
    options: ['Остановка запрещена', 'Стоянка запрещена', 'Движение запрещено', 'Пешеходный переход'],
    correct: 0
  }
];

// Функция для отправки сообщения
async function sendMessage(peerId, text, keyboard = null, attachment = null) {
  const payload = { peer_id: peerId, text: text };
  if (keyboard) payload.keyboard = keyboard;
  if (attachment) payload.attachment = attachment;

  await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${BOT_TOKEN}` }
  });
}

// Функция для создания кнопок
function createKeyboard(options) {
  return {
    inline: true,
    buttons: options.map((opt, index) => [
      {
        type: 'text',
        label: opt,
        payload: JSON.stringify({ answer: index })
      }
    ])
  };
}

// === LONG POLL (Бот слушает сообщения) ===
async function startLongPoll() {
  console.log('⏳ Подключаемся к Long Poll...');
  
  while (true) {
    try {
      // Получаем события из Long Poll
      const response = await axios.get(LONG_POLL_URL, {
        headers: { Authorization: `Bearer ${BOT_TOKEN}` }
      });

      if (response.data && response.data.events) {
        for (const event of response.data.events) {
          // Если это новое сообщение
          if (event.type === 'message_new') {
            const text = event.message?.text?.toLowerCase();
            const peerId = event.message?.peer_id;

            // Если написали /start
            if (text === '/start') {
              const q = questions[0];
              const keyboard = createKeyboard(q.options);

              // 1. Отправляем пост в канал
              await sendMessage(CHANNEL_ID, q.text, keyboard, q.image);

              // 2. Отправляем ответ админу в ЛС
              await sendMessage(peerId, '✅ Пост с опросом отправлен в канал!');
            }
          }

          // Если это нажатие на кнопку
          if (event.type === 'message_payload') {
            const payload = JSON.parse(event.message?.payload || '{}');
            const peerId = event.message?.peer_id;
            const q = questions[0];
            
            const isCorrect = payload.answer === q.correct;
            const responseText = isCorrect 
              ? '✅ Верно! Молодец!' 
              : `❌ Неверно. Правильный ответ: ${q.options[q.correct]}`;

            // Отправляем ответ в ЛС тому, кто нажал
            await sendMessage(peerId, responseText);
          }
        }
      }
    } catch (err) {
      console.error('❌ Ошибка Long Poll:', err.message);
    }
    
    // Небольшая задержка, чтобы не нагружать сервер
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Запускаем бота
console.log('🤖 Бот запущен! Жду команду /start...');
startLongPoll();
