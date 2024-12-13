let snake = [{ x: 200, y: 200 }];
let direction = { x: 10, y: 0 }; // Initial movement: right
let food = { x: 100, y: 100 };
let score = 0;

// Track touch positions
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Initialize canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Draw Snake
function drawSnake() {
    snake.forEach((part) => {
        ctx.fillStyle = 'lime';
        ctx.fillRect(part.x, part.y, 10, 10);
    });
}

// Move Snake
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}

// Generate Food
function generateFood() {
    food.x = Math.floor(Math.random() * 40) * 10;
    food.y = Math.floor(Math.random() * 40) * 10;
}

// Draw Food
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 10, 10);
}

// Handle Screen Touches
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Determine swipe direction
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0 && direction.x === 0) direction = { x: 10, y: 0 }; // Right
        else if (diffX < 0 && direction.x === 0) direction = { x: -10, y: 0 }; // Left
    } else {
        // Vertical swipe
        if (diffY > 0 && direction.y === 0) direction = { x: 0, y: 10 }; // Down
        else if (diffY < 0 && direction.y === 0) direction = { x: 0, y: -10 }; // Up
    }
}

// Check Collision
function checkCollision() {
    const [head, ...body] = snake;

    // Wall Collision (if no wrap-around)
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        resetGame();
    }

    // Self Collision
    body.forEach((part) => {
        if (part.x === head.x && part.y === head.y) resetGame();
    });
}

// Reset Game
function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 10, y: 0 };
    score = 0;
    generateFood();
}

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
    checkCollision();
}

// Add Event Listeners for Touch Controls
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);

// Start Game Loop
setInterval(gameLoop, 100);
