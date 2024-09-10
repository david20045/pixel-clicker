// Инициализация переменных
let coins = parseInt(localStorage.getItem('coins')) || 0;
let profitPerHour = parseInt(localStorage.getItem('profitPerHour')) || 0;
let lastUpdateTime = localStorage.getItem('lastUpdateTime') || Date.now();
let invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0; // Количество приглашенных друзей
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || {}; // Статус выполнения заданий

// Обновление экрана с монетами
function updateCoinsDisplay() {
    document.getElementById('coins').textContent = `Монеты: ${Math.floor(coins)}`; // Округляем количество монет
    document.getElementById('profit-per-hour').textContent = `Прибыль в час: ${profitPerHour}`;
    document.getElementById('invited-friends').textContent = `Приглашено друзей: ${invitedFriends}`;
    // Сохраняем данные в Local Storage
    localStorage.setItem('coins', coins);
    localStorage.setItem('profitPerHour', profitPerHour);
    localStorage.setItem('invitedFriends', invitedFriends); // Сохраняем приглашенных друзей
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks)); // Сохраняем выполненные задания
}

// Функция нажатия на тапалку
function tap() {
    coins += 1; // Увеличиваем количество монет за клик
    animateTap(); // Анимация при нажатии
    updateCoinsDisplay();
}

// Анимация нажатия на тапалку
function animateTap() {
    const tapImage = document.querySelector('.tap-image');
    tapImage.classList.add('tapped');
    setTimeout(() => tapImage.classList.remove('tapped'), 100); // Сбрасываем анимацию через 100мс
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

// Функция для начисления монет за прошедшее время, пока игрок отсутствовал
function addCoinsForElapsedTime() {
    const currentTime = Date.now();
    const timeElapsed = (currentTime - lastUpdateTime) / 1000; // Время, прошедшее в секундах

    if (timeElapsed > 0) {
        // Рассчитываем прибыль за каждую секунду, прошедшую с момента выхода
        const coinsToAdd = (profitPerHour / 3600) * timeElapsed; 
        coins += coinsToAdd;
    }
    
    lastUpdateTime = currentTime; // Обновляем время последнего обновления
    localStorage.setItem('lastUpdateTime', lastUpdateTime);
}

// Таймер для начисления прибыли каждую секунду
setInterval(function() {
    coins += profitPerHour / 3600; // Прибыль каждую секунду на основе прибыли в час
    updateCoinsDisplay();
}, 1000); // Таймер каждые 1 секунду

// Переключение между экранами
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Выполнение задания с подпиской на Telegram
function completeTelegramTask() {
    // Отправляем запрос на сервер для проверки подписки
    const userId = Date.now(); // Используем уникальный идентификатор для проверки
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
                coins += 1000000; // Начисляем 1 000 000 монет за подписку
                completedTasks['telegram'] = true;
                alert("Вы получили 1 000 000 монет за подписку на Telegram!");
                updateCoinsDisplay();
            } else {
                alert("Задание уже выполнено.");
            }
        } else {
            alert("Вы не подписаны на канал.");
        }
    })
    .catch(error => {
        console.error('Ошибка при проверке подписки:', error);
    });
}

// Генерация пригласительной ссылки
function generateInviteLink() {
    const userId = Date.now(); // Уникальный идентификатор для пользователя
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
        navigator.clipboard.writeText(inviteLink); // Копируем ссылку в буфер обмена
        alert("Ссылка создана и скопирована в буфер обмена!");
    })
    .catch(error => {
        console.error('Ошибка при создании ссылки:', error);
    });
}

// Функция для начисления награды за приглашенных друзей
function inviteFriendTask(numFriends) {
    if (numFriends === 1 && !completedTasks['friend1']) {
        coins += 5000; // За одного друга
        completedTasks['friend1'] = true;
        alert("Вы получили 5000 монет за приглашение одного друга!");
    } else if (numFriends === 5 && !completedTasks['friend5']) {
        coins += 2000000; // За пять друзей
        completedTasks['friend5'] = true;
        alert("Вы получили 2 000 000 монет за приглашение пяти друзей!");
    } else {
        alert("Задание уже выполнено или не выполнено.");
    }
    
    invitedFriends += numFriends; // Увеличиваем количество приглашенных друзей
    updateCoinsDisplay(); // Обновляем экран с монетами
}

// Инициализация экрана при загрузке
window.onload = function() {
    addCoinsForElapsedTime(); // Начисляем монеты за время, пока игрок отсутствовал
    updateCoinsDisplay();
}

// Сохранение времени последнего обновления перед закрытием/перезагрузкой
window.onbeforeunload = function() {
    localStorage.setItem('lastUpdateTime', Date.now());
};
