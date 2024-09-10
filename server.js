const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// Настройка CORS для запросов с фронтенда
const corsOptions = {
    origin: 'https://david20045.github.io',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Генерация пригласительной ссылки
app.post('/generate-invite', (req, res) => {
    const userId = req.body.userId;
    const inviteCode = Date.now().toString();
    const inviteLink = `https://t.me/PixelClickerGameBot?start=${inviteCode}`;
    res.json({ inviteLink });
});

// Проверка подписки на Telegram канал
const TELEGRAM_TOKEN = '7375840877:AAEiITuGMC44sMktZ6cl4qLFN6ZdkT_jBe4'; // Вставьте ваш токен
const CHANNEL_ID = '@PixelClickerGameBot'; // ID вашего канала

app.post('/check-subscription', async (req, res) => {
    const userId = req.body.userId;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getChatMember?chat_id=${CHANNEL_ID}&user_id=${userId}`);
        const data = await response.json();

        if (data.result.status === 'member' || data.result.status === 'administrator' || data.result.status === 'creator') {
            res.json({ subscribed: true });
        } else {
            res.json({ subscribed: false });
        }
    } catch (error) {
        console.error('Ошибка при проверке подписки:', error);
        res.status(500).json({ error: 'Ошибка при проверке подписки' });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});






