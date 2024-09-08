// Инициализация переменных
let coins = parseInt(localStorage.getItem('coins')) || 0;
let profitPerHour = parseInt(localStorage.getItem('profitPerHour')) || 0;

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
window.onload = updateCoinsDisplay;
