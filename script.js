// Инициализация переменных
let coins = parseInt(localStorage.getItem('coins')) || 0;
let profitPerHour = parseInt(localStorage.getItem('profitPerHour')) || 0;
let lastUpdateTime = parseInt(localStorage.getItem('lastUpdateTime')) || Date.now();
let invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0;
let friendsRegistered = parseInt(localStorage.getItem('friendsRegistered')) || 0; // Количество зарегистрированных друзей
let telegramSubscribed = localStorage.getItem('telegramSubscribed') === 'true'; // Проверка подписки на Telegram

// Обновление экрана с монетами
function updateCoinsDisplay() {
    document.getElementById('coins').textContent = `Монеты: ${Math.floor(coins)}`;
    document.getElementById('profit-per-hour').textContent = `Прибыль в час: ${profitPerHour}`;
    localStorage.setItem('coins', coins);
    localStorage.setItem('profitPerHour', profitPerHour);
    localStorage.setItem('invitedFriends', invitedFriends);
    localStorage.setItem('friendsRegistered', friendsRegistered); // Сохраняем количество зарегистрированных друзей
    localStorage.setItem('telegramSubscribed', telegramSubscribed); // Сохраняем состояние подписки на Telegram
    updateInviteTaskStatus(); // Обновление состояния приглашений
}

// Функция нажатия на тапалку
function tap() {
    coins += 1;
    animateTap();
    updateCoinsDisplay();
}

// Анимация нажатия на тапалку
function animateTap() {
    const tapImage = document.querySelector('.tap-image');
    tapImage.classList.add('tapped');
    setTimeout(() => tapImage.classList.remove('tapped'), 100);
}

// Функция покупки карточек
function buyCard(type) {
    let price, profit;

    if (type === 'tree') {
        price = 100;
        profit = 1000;
    } else if (type === 'stone') {
        price = 200;
        profit = 2000;
    } else if (type === 'leaf') {
        price = 300;
        profit = 3000;
    }

    if (coins >= price) {
        coins -= price;
        profitPerHour += profit;
        alert(`Вы купили ${type}, теперь ваша прибыль: ${profitPerHour} монет в час!`);
        updateCoinsDisplay();
    } else {
        alert("Недостаточно монет.");
    }
}

// Функция для начисления монет за прошедшее время
function addCoinsForElapsedTime() {
    const currentTime = Date.now();
    const timeElapsed = (currentTime - lastUpdateTime) / 1000;

    if (timeElapsed > 0) {
        const coinsToAdd = (profitPerHour / 3600) * timeElapsed;
        coins += coinsToAdd;
    }

    lastUpdateTime = currentTime;
    localStorage.setItem('lastUpdateTime', lastUpdateTime);
}

// Таймер для начисления прибыли каждую секунду
setInterval(function() {
    coins += profitPerHour / 3600;
    updateCoinsDisplay();
}, 1000);

// Переключение между экранами
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Генерация ссылки для приглашения друга
function generateInviteLink() {
    const inviteLink = `https://t.me/PixelClickerGameBot?start=${Date.now()}`;
    document.getElementById('invite-link').textContent = inviteLink;
    navigator.clipboard.writeText(inviteLink);
    alert('Ссылка скопирована в буфер обмена!');
}

// Выполнение задания: Подписка на Telegram
function completeTelegramTask() {
    // В реальном приложении сюда можно добавить логику проверки подписки через Telegram API
    if (!telegramSubscribed) {
        coins += 1000000;
        telegramSubscribed = true;
        localStorage.setItem('telegramSubscribed', 'true');
        updateCoinsDisplay();
        alert('Вы подписались на Telegram-канал и получили 1 000 000 монет!');
    } else {
        alert('Вы уже подписаны на Telegram-канал!');
    }
}

// Функция для завершения заданий по приглашению друзей
function collectInviteReward(count) {
    if (count === 1 && friendsRegistered >= 1) {
        coins += 5000;
        friendsRegistered -= 1;
        updateCoinsDisplay();
        alert('Вы получили 5000 монет за приглашение одного друга!');
    } else if (count === 5 && friendsRegistered >= 5) {
        coins += 2000000;
        friendsRegistered -= 5;
        updateCoinsDisplay();
        alert('Вы получили 2 000 000 монет за приглашение 5 друзей!');
    } else {
        alert(`Для получения награды нужно пригласить ${count} друзей.`);
    }
}

// Обновление статуса выполнения заданий по приглашению друзей
function updateInviteTaskStatus() {
    document.getElementById('invite-one-reward').style.display = friendsRegistered >= 1 ? 'block' : 'none';
    document.getElementById('invite-five-reward').style.display = friendsRegistered >= 5 ? 'block' : 'none';
}

// Функция для отображения экрана при запуске
function showScreenOnStart() {
    const urlParams = new URLSearchParams(window.location.search);
    const startapp = urlParams.get('start');
    if (startapp) {
        // Выполняем действия в зависимости от параметра start
        showScreen('exchange'); // Пример: автоматически открываем экран Биржа
    } else {
        showScreen('exchange'); // По умолчанию открываем экран Биржа
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    addCoinsForElapsedTime();
    updateCoinsDisplay();
    showScreenOnStart(); // Проверка и отображение нужного экрана при запуске
});
