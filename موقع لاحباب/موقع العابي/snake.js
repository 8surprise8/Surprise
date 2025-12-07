const board = document.getElementById('game-board');
const scoreValue = document.getElementById('score-value');
const playerScoreValue = document.getElementById('player-score-value');

const boardSize = 20;
let snake = [ { x: 10, y: 10 } ];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let gameInterval;
let started = false;
let specialFood = null;
let specialFoodTimeout = null;
let applesEaten = 0;

const specialMessages = [
    '💕 رائع! حبيبي الجميل 💕',
    '💖 ما شاء الله عليك 💖',
    '🌹 أنت الأفضل يا حبيبي 🌹',
    '💗 مذهل! استمر يا قلبي 💗',
    '💝 أحبك كثيراً 💝',
    '❤️ أنت حبيب قلبي ❤️'
];
let specialFoodCount = 0;

function drawBoard() {
    board.innerHTML = '';
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (snake.some(s => s.x === x && s.y === y)) {
                cell.classList.add('snake');
            } else if (specialFood && specialFood.x === x && specialFood.y === y) {
                cell.classList.add('special-food');
                cell.style.background = 'radial-gradient(circle at 60% 40%, gold 80%, orange 100%)';
                cell.style.border = '2px solid #fff700';
                cell.style.transform = 'scale(1.3)';
                cell.style.animation = 'gold-apple-pulse 0.7s infinite alternate';
            } else if (food.x === x && food.y === y) {
                cell.classList.add('food');
            }
            board.appendChild(cell);
        }
    }
}

function placeFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
        };
    } while (snake.some(s => s.x === newFood.x && s.y === newFood.y));
    food = newFood;
}

function placeSpecialFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
        };
    } while (
        snake.some(s => s.x === newFood.x && s.y === newFood.y) ||
        (food.x === newFood.x && food.y === newFood.y)
    );
    specialFood = newFood;
    if (specialFoodTimeout) clearTimeout(specialFoodTimeout);
    specialFoodTimeout = setTimeout(() => {
        specialFood = null;
        drawBoard();
    }, 8000);
    drawBoard();
}

function showSpecialMessage(msg) {
    let oldMsg = document.getElementById('special-msg');
    if (oldMsg) oldMsg.remove();
    let msgDiv = document.createElement('div');
    msgDiv.id = 'special-msg';
    msgDiv.textContent = msg;
    msgDiv.style.position = 'fixed';
    msgDiv.style.top = '18%';
    msgDiv.style.left = '50%';
    msgDiv.style.transform = 'translate(-50%, -50%)';
    msgDiv.style.background = 'linear-gradient(135deg, rgba(222, 93, 131, 0.95), rgba(202, 31, 123, 0.95))';
    msgDiv.style.color = '#fff';
    msgDiv.style.fontSize = '2.2rem';
    msgDiv.style.fontWeight = 'bold';
    msgDiv.style.padding = '28px 48px';
    msgDiv.style.borderRadius = '22px';
    msgDiv.style.boxShadow = '0 8px 40px rgba(171, 39, 79, 0.5), 0 0 60px rgba(222, 93, 131, 0.3)';
    msgDiv.style.zIndex = '9999';
    msgDiv.style.textAlign = 'center';
    msgDiv.style.pointerEvents = 'none';
    msgDiv.style.transition = 'opacity 0.5s';
    document.body.appendChild(msgDiv);
    setTimeout(() => {
        msgDiv.style.opacity = '0';
        setTimeout(() => msgDiv.remove(), 500);
    }, 3500);
}

function moveSnake() {
    if (!started) return;
    let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    // اجعل الثعبان يلتف من الطرف الآخر
    if (head.x < 0) head.x = boardSize - 1;
    if (head.x >= boardSize) head.x = 0;
    if (head.y < 0) head.y = boardSize - 1;
    if (head.y >= boardSize) head.y = 0;
    // Check self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
    }
    snake.unshift(head);
    // Check special food
    if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
        specialFood = null;
        if (specialFoodTimeout) clearTimeout(specialFoodTimeout);
        showSpecialMessage(specialMessages[specialFoodCount % specialMessages.length]);
        specialFoodCount++;
        // إذا أكل التفاحة الذهبية السادسة زود السرعة
        if ((specialFoodCount % specialMessages.length) === 0) {
            clearInterval(gameInterval);
            gameInterval = setInterval(moveSnake, 65); // سرعة أعلى بعد السادسة
        }
    }
    // Check food
    if (head.x === food.x && head.y === food.y) {
        score++;
        applesEaten++;
        scoreValue.textContent = score;
        if (playerScoreValue) playerScoreValue.textContent = score;
        placeFood();
        if (applesEaten % 4 === 0) {
            placeSpecialFood();
        }
    } else {
        snake.pop();
    }
    drawBoard();
}

function gameOver() {
    clearInterval(gameInterval);
    // حفظ الاسكور في localStorage فقط إذا كان أكبر من السابق
    const lastScore = localStorage.getItem('snake_last_score');
    if (!lastScore || score > parseInt(lastScore)) {
        localStorage.setItem('snake_last_score', score);
    }
    alert('💕 انتهت اللعبة يا حبيبي! 💕\n🌹 نتيجتك: ' + score + ' 🌹\nأحسنت! 💖');
}

// عند بدء اللعبة، عرض آخر اسكور محفوظ
window.addEventListener('DOMContentLoaded', function() {
    const lastScore = localStorage.getItem('snake_last_score');
    if (lastScore && playerScoreValue) {
        playerScoreValue.textContent = lastScore;
    }
});

function startGame() {
    snake = [ { x: 10, y: 10 } ];
    direction = { x: 1, y: 0 };
    score = 0;
    applesEaten = 0;
    specialFood = null;
    specialFoodCount = 0;
    if (specialFoodTimeout) clearTimeout(specialFoodTimeout);
    scoreValue.textContent = score;
    if (playerScoreValue) playerScoreValue.textContent = score;
    placeFood();
    drawBoard();
    clearInterval(gameInterval);
    started = true;
    gameInterval = setInterval(moveSnake, 260); // أبطأ
}

const upBtn = document.getElementById('up');
const downBtn = document.getElementById('down');
const leftBtn = document.getElementById('left');
const rightBtn = document.getElementById('right');

function triggerDirection(dir) {
    if (!started) startGame();
    switch (dir) {
        case 'up':
            if (direction.y !== 1) direction = { x: 0, y: -1 };
            break;
        case 'down':
            if (direction.y !== -1) direction = { x: 0, y: 1 };
            break;
        case 'left':
            if (direction.x !== 1) direction = { x: -1, y: 0 };
            break;
        case 'right':
            if (direction.x !== -1) direction = { x: 1, y: 0 };
            break;
    }
}

if (upBtn && downBtn && leftBtn && rightBtn) {
    upBtn.addEventListener('click', () => triggerDirection('up'));
    downBtn.addEventListener('click', () => triggerDirection('down'));
    leftBtn.addEventListener('click', () => triggerDirection('left'));
    rightBtn.addEventListener('click', () => triggerDirection('right'));
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            triggerDirection('up');
            break;
        case 'ArrowDown':
        case 's':
            triggerDirection('down');
            break;
        case 'ArrowLeft':
        case 'a':
            triggerDirection('right'); // عكس اليسار ليصبح يمين
            break;
        case 'ArrowRight':
        case 'd':
            triggerDirection('left'); // عكس اليمين ليصبح يسار
            break;
    }
});

// دعم السحب (السحب للأعلى/الأسفل/اليمين/اليسار) للجوال
let touchStartX = 0;
let touchStartY = 0;

board.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
});

board.addEventListener('touchend', function(e) {
    if (e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy)) {
            // سحب أفقي
            if (dx > -20 && direction.x !== -1) {
                if (!started) startGame();
                direction = { x: -1, y: 0 }; // يمين (معكوس)
            } else if (dx < 20 && direction.x !== 1) {
                if (!started) startGame();
                direction = { x: 1, y: 0 }; // يسار (معكوس)
            }
        } else {
            // سحب رأسي
            if (dy > 20 && direction.y !== 1) {
                if (!started) startGame();
                direction = { x: 0, y: -1 }; // فوق
            } else if (dy < -20 && direction.y !== -1) {
                if (!started) startGame();
                direction = { x: 0, y: 1 }; // تحت
            }
        }
    }
});

drawBoard();
