const TelegramApi = require('node-telegram-bot-api')
const {againOptions, gameOptions} = require('./options')

const token = "7989552745:AAFt44LwqIMbiq75yp86zEgSJMpNxb_8BWA"

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatID) => {
    await bot.sendMessage(chatID, 'Угадай число от 1 до 10');
    const randomNumber = Math.floor(Math.random(10) * 10)
    chats[chatID] = randomNumber;
    await bot.sendMessage(chatID, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/info', description: 'Информация' },
        { command: '/game', description: 'Игра' }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatID = msg.chat.id;
        if (text === '/start') {
            await bot.sendMessage(chatID, "Добро пожаловать!");
            return bot.sendSticker(chatID, 'https://tlgrm.ru/_/stickers/c2b/583/c2b583cc-71f2-3f42-935b-9a9c7ac16fc5/192/21.webp')
        }
        if (text === '/info') {
            return bot.sendMessage(chatID, `Тебя зовут ${msg.from.first_name}`);
        }
        if (text === '/game') {
            return startGame(chatID);
        }
        return bot.sendMessage(chatID, "Я тебя не понимаю")
    })

    bot.on('callback_query', async msg => {
        const chatID = msg.message.chat.id;
        const data = msg.data
        console.log(chats[chatID], data)
        if (data === '/again'){
            return startGame(chatID);
        }
        if (Number(data) === chats[chatID]) {
            return bot.sendMessage(chatID, "Угадал", againOptions)
        } else {
            return bot.sendMessage(chatID, "Не угадал", againOptions)
        }
    })
}

start()