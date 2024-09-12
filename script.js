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
    updateLevelProgress(); // Обновление прогресса уровня
}

// Обновление уровня и прогресс-бара
function updateLevelProgress() {
    let level = 1;
    let maxCoins = 20000; // Максимум для первого уровня
    let nextLevelCoins = 0;

    if (coins >= 20000 && coins < 50000) {
        level = 2;
        maxCoins = 50000;
        nextLevelCoins = 20000;
    } else if (coins >= 50000 && coins < 100000) {
        level = 3;
        maxCoins = 100000;
        nextLevelCoins = 50000;
    } else if (coins >= 100000 && coins < 200000) {
        level = 4;
        maxCoins = 200000;
        nextLevelCoins = 100000;
    } else if (coins >= 200000) {
        level = 5;
        maxCoins = 500000;
        nextLevelCoins = 200000;
    }

    // Обновляем прогресс бар
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = ((coins - nextLevelCoins) / (maxCoins - nextLevelCoins)) * 100;
    progressBar.style.width = progressPercent + '%';

    // Обновляем текст с текущим уровнем
    document.getElementById('level-label').textContent = `LVL ${level}`;
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

// Функция генерации пригласительной ссылки через бота
function generateInviteLink() {
    const userId = localStorage.getItem('userId') || Date.now().toString();
    localStorage.setItem('userId', userId); // Сохранение userId для последующих запросов

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
        document.getElementById('invite-link').textContent = inviteLink;
        document.getElementById('invite-link').style.wordWrap = 'break-word';
        navigator.clipboard.writeText(inviteLink)
            .then(() => alert("Ссылка скопирована в буфер обмена!"))
            .catch(err => console.error('Ошибка при копировании ссылки:', err));
    })
    .catch(error => console.error('Ошибка при генерации ссылки:', error));
}

// Проверка выполнения задания с подпиской на Telegram
function completeTelegramTask() {
    const userId = localStorage.getItem('userId') || Date.now().toString();

    fetch('https://powerful-shore-09376-21d10976fcd9.herokuapp.com/check-subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.subscribed && !completedTasks['telegram']) {
            coins += 1000000;
            completedTasks['telegram'] = true;
            alert("Вы получили 1 000 000 монет за подписку!");
            updateCoinsDisplay();
        } else {
            alert("Задание уже выполнено или вы не подписаны.");
        }
    })
    .catch(error => console.error('Ошибка при проверке подписки:', error));
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
        // Можно выполнить действия в зависимости от параметра
        fetch('https://powerful-shore-09376-21d10976fcd9.herokuapp.com/register-friend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inviteCode: urlParams.get('start'), referrer: userId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Приглашение успешно зарегистрировано!");
                friendsRegistered++;
                updateInviteTaskStatus();
            }
        })
        .catch(error => console.error('Ошибка при регистрации приглашения:', error));
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
