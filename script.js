// Инициализация переменных
let coins = parseInt(localStorage.getItem('coins')) || 0;
let profitPerHour = parseInt(localStorage.getItem('profitPerHour')) || 0;
let lastUpdateTime = localStorage.getItem('lastUpdateTime') || Date.now();

// Обновление экрана с монетами
function updateCoinsDisplay() {
    document.getElementById('coins').textContent = `Монеты: ${Math.floor(coins)}`; // Округляем количество монет
    document.getElementById('profit-per-hour').textContent = `Прибыль в час: ${profitPerHour}`;
    // Сохраняем данные в Local Storage
    localStorage.setItem('coins', coins);
    localStorage.setItem('profitPerHour', profitPerHour);
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
    const wholeSecondsElapsed = Math.floor(timeElapsed); // Округляем до целого количества секунд

    // Рассчитываем прибыль за целые секунды
    const coinsToAdd = (profitPerHour / 3600) * wholeSecondsElapsed;
    coins += coinsToAdd;
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

// Инициализация экрана при загрузке
window.onload = function() {
    addCoinsForElapsedTime(); // Начисляем монеты за время, пока игрок отсутствовал
    updateCoinsDisplay();
}

// Сохранение времени последнего обновления перед закрытием/перезагрузкой
window.onbeforeunload = function() {
    localStorage.setItem('lastUpdateTime', Date.now());
};
