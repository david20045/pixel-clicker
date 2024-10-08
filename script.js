// Инициализация переменных
let coins = parseInt(localStorage.getItem('coins')) || 0;
let profitPerHour = parseInt(localStorage.getItem('profitPerHour')) || 0;
let lastUpdateTime = parseInt(localStorage.getItem('lastUpdateTime')) || Date.now();
let invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0;
let telegramSubscribed = localStorage.getItem('telegramSubscribed') === 'true';
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || {};

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
{ level: 10, minCoins: 30000000, maxCoins: Infinity }
];

// Обновление экрана с монетами
function updateCoinsDisplay() {
document.getElementById('coins').textContent = `Монеты: ${Math.floor(coins)}`;
document.getElementById('profit-per-hour').textContent = `Прибыль в час: ${profitPerHour}`;
document.getElementById('invited-friends-count').textContent = `Приглашено друзей: ${invitedFriends}`;
updateInviteTaskStatus();
calculateLevelAndProgress();

// Сохраняем данные
localStorage.setItem('coins', coins);
localStorage.setItem('profitPerHour', profitPerHour);
localStorage.setItem('invitedFriends', invitedFriends);
localStorage.setItem('friendsRegistered', friendsRegistered);
localStorage.setItem('telegramSubscribed', telegramSubscribed);
localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

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

document.getElementById('level-label').textContent = `LVL ${currentLevel}`;
document.getElementById('progress-bar').style.width = `${progress}%`;
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

// Генерация пригласительной ссылки
function generateInviteLink() {
    const userId = localStorage.getItem('userId') || Date.now().toString();
    localStorage.setItem('userId', userId);

    const inviteLink = `https://t.me/PixelClickerGameBot?start=${userId}`;
    document.getElementById('invite-link').textContent = inviteLink;
    document.getElementById('invite-link').style.wordWrap = 'break-word';
    navigator.clipboard.writeText(inviteLink)
        .then(() => alert("Ссылка скопирована в буфер обмена!"))
        .catch(err => console.error('Ошибка при копировании ссылки:', err));
}

// Проверка задания на подписку
function completeTelegramTask() {
    if (!completedTasks['telegram']) {
        coins += 1000000;
        completedTasks['telegram'] = true;
        alert("Вы получили 1 000 000 монет за подписку!");
        updateCoinsDisplay();
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    } else {
        alert("Задание уже выполнено.");
    }
}

// Учёт приглашений при заходе друга на сайт
function checkReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get('start');

    if (referrer) {
        let referredBy = localStorage.getItem('referredBy');

        if (!referredBy) {
            localStorage.setItem('referredBy', referrer);
            
            // Увеличиваем счётчик приглашённых у пригласившего
            let friendsCount = parseInt(localStorage.getItem(`${referrer}_invitedFriends`)) || 0;
            friendsCount += 1;
            localStorage.setItem(`${referrer}_invitedFriends`, friendsCount);

            invitedFriends += 1;
            localStorage.setItem('invitedFriends', invitedFriends);

            alert('Приглашение успешно засчитано!');
        }
    }
}

// Функция начисления награды за приглашение друзей
function claimFriendReward(numFriends) {
    if (numFriends === 1 && invitedFriends >= 1 && !completedTasks['friend1']) {
        coins += 5000;
        completedTasks['friend1'] = true;
        alert("Вы получили 5000 монет за приглашение одного друга!");
        document.getElementById('claim-friend-reward').style.display = 'none';
    } else if (numFriends === 5 && invitedFriends >= 5 && !completedTasks['friend5']) {
        coins += 2000000;
        completedTasks['friend5'] = true;
        alert("Вы получили 2 000 000 монет за приглашение пяти друзей!");
        document.getElementById('claim-friends-reward').style.display = 'none';
    }
    updateCoinsDisplay();
}

// Обновление статуса заданий на приглашение друзей
function updateInviteTaskStatus() {
    if (invitedFriends >= 1 && !completedTasks['friend1']) {
        document.getElementById('claim-friend-reward').style.display = 'block';
    }
    if (invitedFriends >= 5 && !completedTasks['friend5']) {
        document.getElementById('claim-friends-reward').style.display = 'block';
    }
}

// Обработка подписки на Telegram
function checkTelegramSubscription() {
    if (telegramSubscribed) {
        alert("Вы уже подписаны на Telegram!");
    } else {
        alert("Пожалуйста, подпишитесь на Telegram и возвращайтесь для проверки!");
    }
}

// Установить события на элементы
document.getElementById('tap-btn').addEventListener('click', tap);
document.getElementById('buy-tree').addEventListener('click', () => buyCard('tree'));
document.getElementById('buy-stone').addEventListener('click', () => buyCard('stone'));
document.getElementById('buy-leaf').addEventListener('click', () => buyCard('leaf'));
document.getElementById('generate-link').addEventListener('click', generateInviteLink);
document.getElementById('claim-friend-reward').addEventListener('click', () => claimFriendReward(1));
document.getElementById('claim-friends-reward').addEventListener('click', () => claimFriendReward(5));
document.getElementById('check-telegram').addEventListener('click', checkTelegramSubscription);

// Функция отображения экрана при запуске
function showScreenOnStart() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get('referrer');

    if (referrer) {
        let referredBy = localStorage.getItem('referredBy');

        if (!referredBy) {
            localStorage.setItem('referredBy', referrer);

            let friendsCount = parseInt(localStorage.getItem(`${referrer}_invitedFriends`)) || 0;
            friendsCount += 1;
            localStorage.setItem(`${referrer}_invitedFriends`, friendsCount);

            invitedFriends += 1;
            localStorage.setItem('invitedFriends', invitedFriends);

            alert('Вы были приглашены! Дружба засчитана.');
        }
    }

    showScreen('exchange'); // По умолчанию открываем экран Биржа
}

// Инициализация экрана при загрузке
window.onload = function() {
    checkReferral(); // Проверяем реферальную ссылку при входе
    addCoinsForElapsedTime();
    updateCoinsDisplay();
    showScreenOnStart();
}

// Сохранение времени последнего обновления перед закрытием страницы
window.onbeforeunload = function() {
    localStorage.setItem('lastUpdateTime', Date.now());
};
