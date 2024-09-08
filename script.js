// Инициализация переменных
let coins = parseInt(localStorage.getItem('coins')) || 0;
let profitPerHour = parseInt(localStorage.getItem('profitPerHour')) || 0;

// Обновление экрана с монетами
function updateCoinsDisplay() {
    document.getElementById('coins').textContent = `Монеты: ${coins}`;
    document.getElementById('profit-per-hour').textContent = `Прибыль в час: ${profitPerHour}`;
    // Сохраняем данные в Local Storage
    localStorage.setItem('coins', coins);
    localStorage.setItem('profitPerHour', profitPerHour);
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
        profit = 10;
    } else if (type === 'stone') {
        price = 200;
        profit = 20;
    } else if (type === 'leaf') {
        price = 300;
        profit = 30;
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
window.onload = updateCoinsDisplay;
