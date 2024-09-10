// Инициализация переменных
let coins = parseInt(localStorage.getItem('coins')) || 0;
let profitPerHour = parseInt(localStorage.getItem('profitPerHour')) || 0;
let lastUpdateTime = localStorage.getItem('lastUpdateTime') || Date.now();
let invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0; // Количество приглашённых друзей
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
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
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

// Функция генерации пригласительной ссылки
function generateInviteLink() {
    const userId = Date.now(); // Уникальный идентификатор для ссылки
    fetch('https://your-heroku-app.herokuapp.com/generate-invite', {
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
        alert("Ссылка скопирована в буфер обмена!");
    })
    .catch(error => console.error('Ошибка при создании ссылки:', error));
}

// Выполнение задания с подпиской на Telegram
function completeTelegramTask() {
    const userId = Date.now(); // Уникальный идентификатор для проверки
    fetch('https://your-heroku-app.herokuapp.com/check-subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.subscribed) {
            if (!completedTasks['telegram']) {
                coins += 1000000;
                completedTasks['telegram'] = true;
                alert("Вы получили 1 000 000 монет за подписку!");
                updateCoinsDisplay();
            } else {
                alert("Задание уже выполнено.");
            }
        } else {
            alert("Вы не подписаны на канал.");
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
        alert("Задание уже выполнено или не выполнено.");
    }

    invitedFriends += numFriends;
    updateCoinsDisplay();
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

// Инициализация экрана при загрузке страницы
window.onload = function() {
    addCoinsForElapsedTime();
    updateCoinsDisplay();
}

// Сохранение времени последнего обновления перед закрытием страницы
window.onbeforeunload = function() {
    localStorage.setItem('lastUpdateTime', Date.now());
};
