const board = document.getElementById('game-board');
const gpaDisplay = document.getElementById('gpa-display');
const scoreDisplay = document.getElementById('score-display');

// SCALE: 1.5x original size
const cellSize = 60; 
const gridSize = Math.floor((window.innerHeight * 0.8) / cellSize); 
const boardPixelSize = gridSize * cellSize;

board.style.width = `${boardPixelSize}px`;
board.style.height = `${boardPixelSize}px`;
document.getElementById('game-header').style.width = `${boardPixelSize}px`;

let speed = 170; 

const imageSources = [
    '../../assets/cros0.JPG',
    '../../assets/cros1.JPG',
    '../../assets/cros2.JPG',
    '../../assets/cros3.JPG',
    '../../assets/cros4.JPG',
    '../../assets/cros5.JPG'
];

const loadedImages = imageSources.map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

const grades = [
    { label: 'A+', val: 0.4, color: '#2ecc71' }, 
    { label: 'A', val: 0.3, color: '#27ae60' },
    { label: 'B', val: 0.2, color: '#f1c40f' }, 
    { label: 'C', val: 0.1, color: '#e67e22' },
    { label: 'F', val: -0.2, color: '#c0392b' }
];

let snake = [{ x: Math.floor(gridSize/2), y: Math.floor(gridSize/2) }];
let foods = []; 
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let gpa = 0.00;
let score = 0;
let gameRunning = true;

function initBackground() {
    document.querySelectorAll('.cell').forEach(el => el.remove());
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if ((x + y) % 2 !== 0) {
                const tile = document.createElement('div');
                tile.className = 'cell';
                tile.style.left = `${x * cellSize}px`;
                tile.style.top = `${y * cellSize}px`;
                tile.style.backgroundColor = 'var(--grid-2)';
                board.appendChild(tile);
            }
        }
    }
}

function draw() {
    document.querySelectorAll('.snake-part, .food').forEach(el => el.remove());

    foods.forEach(f => {
        const foodEl = document.createElement('div');
        foodEl.className = 'food';
        foodEl.style.left = `${f.x * cellSize}px`;
        foodEl.style.top = `${f.y * cellSize}px`;
        foodEl.style.backgroundColor = f.grade.color;
        foodEl.innerText = f.grade.label;
        
        // Optional: Visual cue that it's about to expire (fade out in last 2 seconds)
        const timeLeft = f.expiresAt - Date.now();
        if (timeLeft < 2000) {
            foodEl.style.opacity = "0.5";
        }

        board.appendChild(foodEl);
    });

    snake.forEach((part, i) => {
        const partEl = document.createElement('div');
        partEl.className = 'snake-part';
        partEl.style.left = `${part.x * cellSize}px`;
        partEl.style.top = `${part.y * cellSize}px`;
        
        let imgObj = loadedImages[i % loadedImages.length];
        partEl.style.backgroundImage = `url("${imgObj.src}")`;

        if (i === 0 && (direction.x !== 0 || direction.y !== 0)) {
            let angle = 0;
            if (direction.x === 1) angle = 90;
            if (direction.x === -1) angle = -90;
            if (direction.y === 1) angle = 180;
            if (direction.y === -1) angle = 0;
            partEl.style.transform = `rotate(${angle}deg)`;
        }
        board.appendChild(partEl);
    });
}

function update() {
    if (!gameRunning) return;

    // --- EXPIRATION LOGIC ---
    const now = Date.now();
    const originalLength = foods.length;
    // Filter out foods that have expired
    foods = foods.filter(f => now < f.expiresAt);
    // If any were filtered out, spawn new ones to replace them
    if (foods.length < originalLength) {
        spawnFood();
    }
    // ------------------------

    if (direction.x === 0 && direction.y === 0 && nextDirection.x === 0 && nextDirection.y === 0) return;

    direction = nextDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize ||
        snake.some(p => p.x === head.x && p.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    const eatenFoodIndex = foods.findIndex(f => f.x === head.x && f.y === head.y);

    if (eatenFoodIndex !== -1) {
        gpa = Math.max(0, gpa + foods[eatenFoodIndex].grade.val);
        score++;
        updateUI();
        foods.splice(eatenFoodIndex, 1);
        spawnFood();
    } else {
        snake.pop();
    }
    draw();
}

function spawnFood() {
    while (foods.length < 2) {
        let newX, newY;
        let isInvalid = true;

        while (isInvalid) {
            newX = Math.floor(Math.random() * gridSize);
            newY = Math.floor(Math.random() * gridSize);
            const onSnake = snake.some(p => p.x === newX && p.y === newY);
            const onFood = foods.some(f => f.x === newX && f.y === newY);
            if (!onSnake && !onFood) isInvalid = false;
        }

        foods.push({ 
            x: newX, 
            y: newY, 
            grade: grades[Math.floor(Math.random() * grades.length)],
            expiresAt: Date.now() + 5000 // Set expiration for 10 seconds from now
        });
    }
}

function updateUI() {
    gpaDisplay.innerText = `GPA: ${gpa.toFixed(2)}`;
    scoreDisplay.innerText = `Score: ${score}`;
}

function gameOver() {
    gameRunning = false;
    document.getElementById('overlay').style.display = 'flex';
    if(gpa.toFixed(2) >= 4.00) {
        document.getElementById('win').innerText = 'You can play lacrosse!!';
    }
    document.getElementById('final-stats').innerText = `Final GPA: ${gpa.toFixed(2)}`;
}

window.resetGame = function() {
    snake = [{ x: Math.floor(gridSize/2), y: Math.floor(gridSize/2) }];
    direction = { x: 0, y: 0 };
    nextDirection = { x: 0, y: 0 };
    gpa = 0;
    score = 0;
    foods = []; 
    gameRunning = true;
    document.getElementById('overlay').style.display = 'none';
    updateUI();
    spawnFood();
    draw();
};

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp': if (direction.y !== 1) nextDirection = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (direction.y !== -1) nextDirection = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (direction.x !== 1) nextDirection = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (direction.x !== -1) nextDirection = { x: 1, y: 0 }; break;
    }
});

initBackground();
spawnFood();
setInterval(update, speed);