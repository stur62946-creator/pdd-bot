const http = require('http');
const https = require('https');

const BOT_TOKEN = process.env.BOT_TOKEN;

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('ok');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  // Вот эта строка выведет в логи точный адрес твоего бота
  console.log(`WEBHOOK_URL ДЛЯ MAX: https://${process.env.BOT_ID}.bothost.ru`);
});
