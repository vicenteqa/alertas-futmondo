const TelegramBot = require('node-telegram-bot-api');
const dayjs = require('dayjs');
const env = require('../env/env.json');
const getLastMessageFromNews =
    require('../src/FutmondoChat').getLastMessageFromNews;
const fs = require('fs');
const path = require('path');
const token = env.telegram_api_token;
const chatId = env.chat_id;
const bot = new TelegramBot(token, { polling: true });

const lastMsgFile = path.join(__dirname, '../output/lastMsg.txt');

checkNewMessage(chatId);

function checkNewMessage(chatId) {
    const TWO_MIN = 1000 * 60 * 2;

    const msToNextRounded2Min = TWO_MIN - (Date.now() % TWO_MIN);
    setTimeout(() => {
        getLastMessageFromNews().then((msg) => {
            const now = dayjs().format('DD-MM-YYYY HH:mm:ss');
            const lastMessageContent = getLastMessageContent();
            const messageIsClausulazo = msg.includes('ha pagado');

            if (lastMessageContent !== msg && messageIsClausulazo) {
                fs.writeFileSync(lastMsgFile, msg);
                bot.sendMessage(chatId, msg, { parse_mode: 'HTML' });
                console.log(now + ': MSG SENT: ', msg);
            } else console.log(now + ' No new messages');
        });
        checkNewMessage(chatId);
    }, msToNextRounded2Min);
}

function getLastMessageContent() {
    const existLastMsgFile = fs.existsSync(lastMsgFile);
    return existLastMsgFile ? fs.readFileSync(lastMsgFile, 'utf-8') : '';
}
