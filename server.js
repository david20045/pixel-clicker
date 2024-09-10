const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

let users = {}; // userId: {inviteCount, telegramSubscribed, invitedFriends, ...}
let invites = {}; // inviteCode: userId

app.use(bodyParser.json());
app.use(express.static('public'));

// Генерация уникальной пригласительной ссылки
app.post('/generate-invite', (req, res) => {
    const { userId } = req.body;
    const inviteCode = crypto.randomBytes(16).toString('hex');
    const inviteLink = `https://t.me/PixelClickerGameBot/PixelClickerGame?start=${inviteCode}&referrer=${userId}`;

    if (!users[userId]) {
        users[userId] = {
            inviteCount: 0,
            telegramSubscribed: false,
            invitedFriends: 0
        };
    }

    invites[inviteCode] = userId; // Сохраняем код приглашения и его владельца
    res.json({ inviteLink });
});

// Проверка подписки на Telegram
app.post('/check-subscription', async (req, res) => {
    const { userId } = req.body;

    // Подключение к Telegram API (замените на реальные данные)
    const telegramToken = 'YOUR_TELEGRAM_BOT_TOKEN';
    const chatId = 'YOUR_TELEGRAM_CHAT_ID'; // Это ID вашего канала или группы

    try {
        const response = await axios.get(`https://api.telegram.org/bot${telegramToken}/getChatMember`, {
            params: {
                chat_id: chatId,
                user_id: userId
            }
        });

        if (response.data.result.status === 'member') {
            if (!users[userId]) {
                users[userId] = { telegramSubscribed: true };
            } else {
                users[userId].telegramSubscribed = true;
            }
            res.json({ subscribed: true });
        } else {
            res.json({ subscribed: false });
        }
    } catch (error) {
        console.error('Ошибка при проверке подписки:', error);
        res.status(500).json({ error: 'Ошибка при проверке подписки' });
    }
});

// Регистрация приглашённого друга
app.post('/register-friend', (req, res) => {
    const { inviteCode, referrerId } = req.body;

    if (invites[inviteCode]) {
        const referrer = invites[inviteCode];
        if (users[referrer]) {
            users[referrer].invitedFriends += 1;
            users[referrer].inviteCount += 1; // Увеличиваем счётчик приглашений

            // Возвращаем количество приглашённых друзей и статус задания
            const referrerData = users[referrer];
            const task1Completed = referrerData.invitedFriends >= 1;
            const task2Completed = referrerData.invitedFriends >= 5;
            
            res.json({
                success: true,
                invitedFriends: referrerData.invitedFriends,
                task1Completed,
                task2Completed
            });
        } else {
            res.json({ success: false, error: 'Referrer not found' });
        }
    } else {
        res.json({ success: false, error: 'Invalid invite code' });
    }
});

app.listen(port, () => {
    console.log(`Сервер работает на порту ${port}`);
});
