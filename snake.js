const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: -10 };
let food = { x: 100, y: 100 };
let score = 0;

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = 'lime';
        ctx.fillRect(part.x, part.y, 10, 10);
    });
}

function moveSnake() {
    let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wrap the snake around if it goes out of bounds
    if (head.x < 0) {
        head.x = canvas.width - 10; // Move to the right edge
    } else if (head.x >= canvas.width) {
        head.x = 0; // Move to the left edge
    }

    if (head.y < 0) {
        head.y = canvas.height - 10; // Move to the bottom edge
    } else if (head.y >= canvas.height) {
        head.y = 0; // Move to the top edge
    }

    snake.unshift(head);

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * 40) * 10;
    food.y = Math.floor(Math.random() * 40) * 10;
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 10, 10);
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function checkCollision() {
    const [head, ...body] = snake;

    // Check self-collision
    body.forEach(part => {
        if (part.x === head.x && part.y === head.y) resetGame();
    });
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: -10 };
    score = 0;
    generateFood();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawScore();
    moveSnake();
    checkCollision();
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -10 };
    if (e.key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 10 };
    if (e.key === 'ArrowLeft' && direction.x === 0) direction = { x: -10, y: 0 };
    if (e.key === 'ArrowRight' && direction.x === 0) direction = { x: 10, y: 0 };
});

setInterval(gameLoop, 100);
