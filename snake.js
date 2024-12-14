// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Get direction buttons
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

// Game constants
const boxSize = 20; // Size of one grid box
const rows = canvas.height / boxSize;
const cols = canvas.width / boxSize;

// Game variables
let snake = [{ x: 5 * boxSize, y: 5 * boxSize }];
let food = { x: 8 * boxSize, y: 8 * boxSize };
let direction = "RIGHT";
let score = 0;
let isGameRunning = false;
let gameInterval;

// Notify Telegram that the game is ready
let tg = window.TelegramGameProxy || null;
if (tg) {
    tg.ready();
}

// DOM reference for score display
const scoreDisplay = document.getElementById("scoreDisplay");

// Update score display
function updateScore(points) {
    score += points;
    scoreDisplay.innerText = `Score: ${score}`;
}

// Draw snake
function drawSnake() {
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    });
}

// Draw food
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

// Move snake
function moveSnake() {
    const head = { ...snake[0] };

    if (direction === "UP") head.y -= boxSize;
    if (direction === "DOWN") head.y += boxSize;
    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        updateScore(10);
        generateNewFood();
    } else {
        snake.pop();
    }
}

// Generate new food
function generateNewFood() {
    food.x = Math.floor(Math.random() * cols) * boxSize;
    food.y = Math.floor(Math.random() * rows) * boxSize;
}

// Check for collision
function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Handle game over and automatically restart
function handleGameOver() {
    alert(`Game Over! Your score: ${score}`);

    // Submit the score to Telegram
    if (tg) {
        tg.postEvent('score', score); // Send the score to Telegram
        tg.close(); // Close the game once the score is submitted
    } else {
        console.error('Telegram Game Proxy is not available!');
    }

    resetGame();
}

// Reset the game
function resetGame() {
    snake = [{ x: 5 * boxSize, y: 5 * boxSize }];
    food = { x: 8 * boxSize, y: 8 * boxSize };
    direction = "RIGHT";
    score = 0;
    updateScore(0);
    clearInterval(gameInterval);
    isGameRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Game loop
function gameLoop() {
    if (checkCollision()) {
        handleGameOver(); // Restart the game if collision occurs
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawSnake();
    drawFood();
}

// Start the game
function startGame() {
    if (isGameRunning) return;
    isGameRunning = true;
    gameInterval = setInterval(gameLoop, 100);
}

// Direction controls
upButton.addEventListener("click", () => {
    if (direction !== "DOWN") direction = "UP";
});
downButton.addEventListener("click", () => {
    if (direction !== "UP") direction = "DOWN";
});
leftButton.addEventListener("click", () => {
    if (direction !== "RIGHT") direction = "LEFT";
});
rightButton.addEventListener("click", () => {
    if (direction !== "LEFT") direction = "RIGHT";
});

// Automatically load and start the game when the page opens
window.onload = function () {
    resetGame();
    startGame();
};
