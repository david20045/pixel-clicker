// Инициализация переменных
let coins = parseInt(localStorage.getItem('coins')) || 0;
let profitPerHour = parseInt(localStorage.getItem('profitPerHour')) || 0;
let lastUpdate = parseInt(localStorage.getItem('lastUpdate')) || Date.now();

// Обновление экрана с монетами
function updateCoinsDisplay() {
    document.getElementById('coins').textContent = `Монеты: ${coins}`;
    document.getElementById('profit-per-hour').textContent = `Прибыль в час: ${profitPerHour}`;
    // Сохраняем данные в Local Storage
    localStorage.setItem('coins', coins);
    localStorage.setItem('profitPerHour', profitPerHour);
    localStorage.setItem('lastUpdate', lastUpdate);
}

// Функция для обработки кликов по кнопке "тап"
function tap() {
    coins += 2; // 2 монеты за каждый тап
    updateCoinsDisplay();
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

// Расчёт прибыли, основанный на времени с последнего обновления
function calculateProfit() {
    const now = Date.now();
    const elapsed = now - lastUpdate; // Время с последнего обновления в миллисекундах
    const hoursElapsed = elapsed / (1000 * 60 * 60); // Переводим в часы

    coins += profitPerHour * hoursElapsed; // Начисляем прибыль
    lastUpdate = now; // Обновляем время последнего обновления
    updateCoinsDisplay();
}

// Таймер для начисления прибыли в час
setInterval(function() {
    coins += profitPerHour / 10; // Прибыль каждую минуту
    updateCoinsDisplay();
}, 60000); // Таймер каждые 60 секунд

// Переключение между экранами
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Инициализация экрана при загрузке
window.onload = function() {
    calculateProfit(); // Начисляем прибыль при загрузке
    updateCoinsDisplay();
};
