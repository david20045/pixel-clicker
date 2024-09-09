// Инициализация переменных
let coins = parseInt(localStorage.getItem('coins')) || 0;
let profitPerHour = parseInt(localStorage.getItem('profitPerHour')) || 0;
let lastUpdateTime = localStorage.getItem('lastUpdateTime') || Date.now();
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

// Выполнение задания с подпиской на Telegram
function completeTelegramTask() {
    const userId = Date.now(); // Временный идентификатор пользователя

    fetch('https://powerful-shore-09376-21d10976fcd9.herokuapp.com/check-subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.subscribed) {
            telegramSubscribed = true; // Обновляем состояние подписки
            coins += 1000000; 
            alert("Вы получили 1 000 000 монет за подписку на Telegram!");
            updateCoinsDisplay();
        } else {
            alert('Вы не подписаны на канал.');
        }
    })
    .catch(error => console.error('Ошибка проверки подписки:', error));
}

// Генерация пригласительной ссылки
function generateInviteLink() {
    const userId = Date.now(); 

    fetch('https://powerful-shore-09376-21d10976fcd9.herokuapp.com/generate-invite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        const inviteLink = data.inviteLink;
        document.getElementById('invite-link').textContent = `Ваша ссылка: ${inviteLink}`;
        navigator.clipboard.writeText(inviteLink);
        alert("Ссылка скопирована! Отправьте её друзьям.");
    })
    .catch(error => console.error('Ошибка создания ссылки:', error));
}

// Функция для обработки регистрации друга по ссылке
function friendRegistered() {
    friendsRegistered += 1;
    coins += 5000; // Награда за одного друга
    alert(`Друг зарегистрировался! Вы получили 5000 монет.`);
    updateCoinsDisplay();
}

// Обновление статуса заданий по приглашению
function updateInviteTaskStatus() {
    // Если зарегистрировался хотя бы один друг, активируем карточку "Забрать подарок"
    if (friendsRegistered >= 1) {
        document.getElementById('invite-one-reward').style.display = 'block';
    }
    
    // Если зарегистрировались 5 друзей, активируем награду за 5 друзей
    if (friendsRegistered >= 5) {
        document.getElementById('invite-five-reward').style.display = 'block';
    }

    // Обновление прогресса на экране друзей
    document.getElementById('friends-registered-count').textContent = `Приглашено и зарегистрировано: ${friendsRegistered} друзей`;
}

// Функция для получения награды за приглашенных друзей
function collectInviteReward(numFriends) {
    if (numFriends === 1 && friendsRegistered >= 1) {
        coins += 5000; // За одного друга
        alert("Вы получили 5000 монет за приглашение одного друга!");
        updateCoinsDisplay();
        document.getElementById('invite-one-reward').style.display = 'none'; // Скрываем кнопку после получения награды
    } else if (numFriends === 5 && friendsRegistered >= 5) {
        coins += 2000000; // За пять друзей
        alert("Вы получили 2 000 000 монет за приглашение пяти друзей!");
        updateCoinsDisplay();
        document.getElementById('invite-five-reward').style.display = 'none'; // Скрываем кнопку после получения награды
    }
}

// Инициализация экрана при загрузке
window.onload = function() {
    addCoinsForElapsedTime();
    updateCoinsDisplay();
}

// Сохранение времени последнего обновления перед закрытием/перезагрузкой
window.onbeforeunload = function() {
    localStorage.setItem('lastUpdateTime', Date.now());
};
