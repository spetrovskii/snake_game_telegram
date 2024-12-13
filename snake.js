const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [{ x: 200, y: 200 }];
let direction = { x: 10, y: 0 }; // Initial direction
let food = { x: 100, y: 100 };
let score = 0;

// Draw Snake
function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = 'lime';
        ctx.fillRect(part.x, part.y, 10, 10);
    });
}

// Move Snake
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Teleport the snake to the opposite side when crossing borders
    if (head.x < 0) head.x = canvas.width - 10; // Left to right
    if (head.x >= canvas.width) head.x = 0;     // Right to left
    if (head.y < 0) head.y = canvas.height - 10; // Top to bottom
    if (head.y >= canvas.height) head.y = 0;    // Bottom to top

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
    food.x = Math.floor(Math.random() * (canvas.width / 10)) * 10;
    food.y = Math.floor(Math.random() * (canvas.height / 10)) * 10;
}

// Draw Food
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 10, 10);
}

// Check Collision
function checkCollision() {
    const [head, ...body] = snake;

    // Self Collision
    body.forEach(part => {
        if (part.x === head.x && part.y === head.y) resetGame();
    });
}

// Reset Game
function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 10, y: 0 }; // Reset direction to right
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

// Add Event Listeners for Button Controls
document.getElementById('up').addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: -10 }; // Move up
});

document.getElementById('down').addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: 10 }; // Move down
});

document.getElementById('left').addEventListener('click', () => {
    if (direction.x === 0) direction = { x: -10, y: 0 }; // Move left
});

document.getElementById('right').addEventListener('click', () => {
    if (direction.x === 0) direction = { x: 10, y: 0 }; // Move right
});

// Start Game Loop
setInterval(gameLoop, 100);