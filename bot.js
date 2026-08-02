const axios = require('axios');

const BOT_TOKEN = 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';
const CHANNEL_ID = '77483436379527';
const API_URL = 'https://api.max.ru/messages.send';

async function sendPost(peerId, text, keyboard) {
  await axios.post(API_URL, {
    peer_id: peerId,
    text: text,
    keyboard: keyboard,
    attachment: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Road_sign_3.27.svg/1200px-Road_sign_3.27.svg.png'
  }, {
    headers: { Authorization: `Bearer ${BOT_TOKEN}` }
  });
}

console.log('🤖 Бот запущен!');
