const TelegramBot = require('node-telegram-bot-api');
const env = require('../env/env.json');
const getLastMessageFromNews =
    require('../src/FutmondoChat').getLastMessageFromNews;

const token = env.telegram_api_token;
const chatId = env.chat_id;
const bot = new TelegramBot(token, { polling: true });
let lastMessage = '';

const firstMsg = 'Escuchando mensajes nuevos';
bot.sendMessage(chatId, firstMsg);
console.log('MSG SENT: ', firstMsg);

checkNewMessage(chatId);

function checkNewMessage(chatId) {
    const TWO_MIN = 1000 * 60 * 2;

    const msToNextRounded2Min = TWO_MIN - (Date.now() % TWO_MIN);
    setTimeout(() => {
        getLastMessageFromNews().then((msg) => {
            if (msg !== lastMessage) {
                lastMessage = msg;
                bot.sendMessage(chatId, msg, { parse_mode: 'HTML' });
                console.log('MSG SENT: ', msg);
            }
        });
        checkNewMessage(chatId);
    }, msToNextRounded2Min);
}
