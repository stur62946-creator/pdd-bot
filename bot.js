const { MaxBotApiClient } = require('max-bot-api-client-ts');
const fs = require('fs');
const path = require('path');

// ============================================================
// ЗАМЕНИ ЭТИ СТРОЧКИ НА СВОИ ДАННЫЕ
// ============================================================
const BOT_TOKEN = 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';
const CHANNEL_ID = '77483436379527';
// ============================================================

const client = new MaxBotApiClient({ token: BOT_TOKEN });

// Путь к файлу с вопросами
const QUESTIONS_FILE = path.join(__dirname, 'questions.json');

// Загружаем вопросы
let questions = [];
if (fs.existsSync(QUESTIONS_FILE)) {
    questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf8'));
    console.log(`📚 Загружено ${questions.length} вопросов.`);
}

// Команда /start
client.on('message_new', async (event) => {
    const text = event.message?.text?.toLowerCase();
    const peerId = event.message?.peerId;

    if (text === '/start' && questions.length > 0) {
        const q = questions[0]; // Берём первый вопрос

        // Создаём кнопки
        const keyboard = {
            inline: true,
            buttons: q.options.map((option, index) => [
                {
                    type: 'text',
                    label: option,
                    payload: JSON.stringify({ qId: q.id, answer: index })
                }
            ])
        };

        // Отправляем пост в канал
        await client.messages.send({
            peerId: CHANNEL_ID,
            text: q.text,
            attachment: q.image,
            keyboard: keyboard
        });

        // Подтверждение админу
        await client.messages.send({
            peerId: peerId,
            text: '✅ Пост с опросом отправлен в канал!'
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
        ? '✅ Верно! Молодец!' 
        : `❌ Неверно. Правильный ответ: ${question.options[question.correct]}`;

    await client.messages.send({
        peerId: event.message?.peerId,
        text: response
    });
});

console.log('🤖 Бот для опросов запущен!');