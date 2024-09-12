// Инициализация переменных
let coins = parseInt(localStorage.getItem('coins')) || 0;
let profitPerHour = parseInt(localStorage.getItem('profitPerHour')) || 0;
let lastUpdateTime = parseInt(localStorage.getItem('lastUpdateTime')) || Date.now();
let invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0; // Количество приглашённых друзей
let friendsRegistered = parseInt(localStorage.getItem('friendsRegistered')) || 0; // Количество зарегистрированных друзей
let telegramSubscribed = localStorage.getItem('telegramSubscribed') === 'true'; // Проверка подписки на Telegram
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || {}; // Выполненные задания

// Обновление экрана с монетами
function updateCoinsDisplay() {
    document.getElementById('coins').textContent = `Монеты: ${Math.floor(coins)}`;
    document.getElementById('profit-per-hour').textContent = `Прибыль в час: ${profitPerHour}`;
    document.getElementById('invited-friends-count').textContent = `Приглашено друзей: ${invitedFriends}`;
    
    // Сохраняем данные
    localStorage.setItem('coins', coins);
    localStorage.setItem('profitPerHour', profitPerHour);
    localStorage.setItem('invitedFriends', invitedFriends);
    localStorage.setItem('friendsRegistered', friendsRegistered);
    localStorage.setItem('telegramSubscribed', telegramSubscribed);
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    
    updateInviteTaskStatus(); // Обновление состояния заданий
}

// Уровни и их требования
const levels = [
    { level: 1, minCoins: 0, maxCoins: 20000 },
    { level: 2, minCoins: 20000, maxCoins: 50000 },
    { level: 3, minCoins: 50000, maxCoins: 100000 },
    { level: 4, minCoins: 100000, maxCoins: 200000 },
    { level: 5, minCoins: 200000, maxCoins: 500000 },
    { level: 6, minCoins: 500000, maxCoins: 1000000 },
    { level: 7, minCoins: 1000000, maxCoins: 3000000 },
    { level: 8, minCoins: 3000000, maxCoins: 10000000 },
    { level: 9, minCoins: 10000000, maxCoins: 30000000 },
    { level: 10, minCoins: 30000000, maxCoins: Infinity } // Бесконечный максимум
];

// Функция расчета уровня и прогресса
function calculateLevelAndProgress() {
    let currentLevel = 1;
    let progress = 0;

    for (const level of levels) {
        if (coins >= level.minCoins && coins < level.maxCoins) {
            currentLevel = level.level;
            progress = ((coins - level.minCoins) / (level.maxCoins - level.minCoins)) * 100;
            break;
        }
    }

    // Обновляем прогресс-бар и метку уровня
    document.getElementById('level-label').textContent = `LVL ${currentLevel}`;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

// Функция обновления монет и прогресса
function updateCoinsDisplay() {
    document.getElementById('coins').textContent = `Монеты: ${Math.floor(coins)}`;
    document.getElementById('profit-per-hour').textContent = `Прибыль в час: ${profitPerHour}`;

    // Обновляем уровень и прогресс
    calculateLevelAndProgress();
}

// Функция нажатия на тапалку
function tap() {
    coins += 2;
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

// Начисление монет за прошедшее время, пока игрок отсутствовал
function addCoinsForElapsedTime() {
    const currentTime = Date.now();
    const timeElapsed = (currentTime - lastUpdateTime) / 1000; // Время в секундах

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

// Функция генерации пригласительной ссылки через Local Storage
function generateInviteLink() {
    const userId = localStorage.getItem('userId') || Date.now().toString();
    localStorage.setItem('userId', userId); // Сохранение userId для последующих запросов

    const inviteLink = `https://t.me/PixelClickerGameBot/PixelClickerGame?referrer=${userId}`;
    document.getElementById('invite-link').textContent = inviteLink;
    document.getElementById('invite-link').style.wordWrap = 'break-word';
    navigator.clipboard.writeText(inviteLink)
        .then(() => alert("Ссылка скопирована в буфер обмена!"))
        .catch(err => console.error('Ошибка при копировании ссылки:', err));
}

// Проверка выполнения задания с подпиской на Telegram
function completeTelegramTask() {
    if (telegramSubscribed && !completedTasks['telegram']) {
        coins += 1000000;
        completedTasks['telegram'] = true;
        alert("Вы получили 1 000 000 монет за подписку!");
        updateCoinsDisplay();
    } else {
        alert("Задание уже выполнено или вы не подписаны.");
    }
}

// Функция для начисления награды за приглашение друзей
function inviteFriendTask(numFriends) {
    if (numFriends === 1 && !completedTasks['friend1']) {
        coins += 5000;
        completedTasks['friend1'] = true;
        alert("Вы получили 5000 монет за приглашение одного друга!");
    } else if (numFriends === 5 && !completedTasks['friend5']) {
        coins += 2000000;
        completedTasks['friend5'] = true;
        alert("Вы получили 2 000 000 монет за приглашение пяти друзей!");
    } else {
        alert("Задание уже выполнено или недостаточно друзей.");
    }

    invitedFriends += numFriends;
    friendsRegistered += numFriends;
    updateCoinsDisplay();
}

// Обновление статуса выполнения заданий по приглашению друзей
function updateInviteTaskStatus() {
    document.getElementById('invite-one-reward').style.display = friendsRegistered >= 1 ? 'block' : 'none';
    document.getElementById('invite-five-reward').style.display = friendsRegistered >= 5 ? 'block' : 'none';

    // Галочки выполнения заданий
    if (completedTasks['friend1']) {
        document.getElementById('invite-one-reward').innerHTML = 'Задание выполнено! ✅';
    }

    if (completedTasks['friend5']) {
        document.getElementById('invite-five-reward').innerHTML = 'Задание выполнено! ✅';
    }
}

// Функция для отображения экрана при запуске
function showScreenOnStart() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('referrer');  // Получение параметра referrer

    if (userId) {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId === userId) {
            invitedFriends++;
            friendsRegistered++;
            updateCoinsDisplay();
        }
    }

    showScreen('exchange'); // По умолчанию открываем экран Биржа
}

// Инициализация экрана при загрузке страницы
window.onload = function() {
    addCoinsForElapsedTime();
    updateCoinsDisplay();
    showScreenOnStart(); // Проверка и отображение нужного экрана при запуске
}

// Сохранение времени последнего обновления перед закрытием страницы
window.onbeforeunload = function() {
    localStorage.setItem('lastUpdateTime', Date.now());
};
