const express = require('express');
const cors = require('cors'); // Подключаем библиотеку CORS
const fetch = require('node-fetch'); // Для запросов к Telegram API

const app = express();
app.use(express.json()); // Позволяет серверу принимать JSON-данные

// Настройка CORS для разрешения запросов с твоего фронтенд-домена
const corsOptions = {
    origin: 'https://david20045.github.io', // Разрешаем запросы с домена GitHub Pages
    optionsSuccessStatus: 200 // Для старых браузеров
};

app.use(cors(corsOptions)); // Применяем CORS ко всем маршрутам

// Пример простого маршрута для проверки работы сервера
app.get('/', (req, res) => {
    res.send('Сервер работает!');
});

// Маршрут для генерации пригласительной ссылки
app.post('/generate-invite', (req, res) => {
    const userId = req.body.userId; // Получаем ID пользователя
    const inviteCode = Date.now().toString(); // Генерируем уникальный код

    // Формируем правильную ссылку для Telegram
    const inviteLink = `https://t.me/PixelClickerGameBot?start=${inviteCode}`;
    res.json({ inviteLink }); // Возвращаем ссылку на клиент
});

// Маршрут для проверки подписки на Telegram
const TELEGRAM_TOKEN = '7375840877:AAEiITuGMC44sMktZ6cl4qLFN6ZdkT_jBe4'; // Ваш токен
const CHANNEL_ID = '@yourchannel'; // Замените на ID или название вашего Telegram-канала

app.post('/check-subscription', async (req, res) => {
    const userId = req.body.userId; // Получаем ID пользователя для проверки подписки

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

// Используем динамический порт от Heroku или порт 3000 для локальной разработки
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});






