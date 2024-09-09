// Инициализация переменных
let coins = parseInt(localStorage.getItem('coins')) || 0;
let profitPerHour = parseInt(localStorage.getItem('profitPerHour')) || 0;
let lastUpdateTime = localStorage.getItem('lastUpdateTime') || Date.now();
let invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0; // Количество приглашенных друзей

// Обновление экрана с монетами
function updateCoinsDisplay() {
    document.getElementById('coins').textContent = `Монеты: ${Math.floor(coins)}`; // Округляем количество монет
    document.getElementById('profit-per-hour').textContent = `Прибыль в час: ${profitPerHour}`;
    // Сохраняем данные в Local Storage
    localStorage.setItem('coins', coins);
    localStorage.setItem('profitPerHour', profitPerHour);
    localStorage.setItem('invitedFriends', invitedFriends); // Сохраняем приглашенных друзей
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
    coins += 1000000; // Начисляем 1 000 000 монет за подписку
    alert("Вы получили 1 000 000 монет за подписку на Telegram!");
    updateCoinsDisplay(); // Обновляем отображение монет
}

// Генерация пригласительной ссылки
function generateInviteLink() {
    const inviteLink = `https://yourgame.com/invite?user=${Date.now()}`;
    document.getElementById('invite-link').textContent = `Ваша ссылка: ${inviteLink}`;
    alert("Ссылка создана! Скопируйте её и отправьте друзьям.");
}

// Функция для начисления награды за приглашенных друзей
function inviteFriendTask(numFriends) {
    if (numFriends === 1) {
        coins += 5000; // За одного друга
        alert("Вы получили 5000 монет за приглашение одного друга!");
    } else if (numFriends === 5) {
        coins += 2000000; // За пять друзей
        alert("Вы получили 2 000 000 монет за приглашение пяти друзей!");
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
