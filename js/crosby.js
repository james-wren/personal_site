const board = document.getElementById('game-board');
const gpaDisplay = document.getElementById('gpa-display');
const scoreDisplay = document.getElementById('score-display');

const gridCount = 15; // Consistent grid size
function getCellSize() {
    // 0.08 (8%) for mobile, 50 for desktop
    return window.innerWidth < 768 ? (window.innerWidth * 0.06) : 40; 
}

let cellSize = getCellSize();
let speed = 170; 

const imageSources = [
    '../../assets/games/cros0.JPG',
    '../../assets/games/cros1.JPG',
    '../../assets/games/cros2.JPG',
    '../../assets/games/cros3.JPG',
    '../../assets/games/cros4.JPG',
    '../../assets/games/cros5.JPG'
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

function initLayout() {
    cellSize = getCellSize();
    const boardPx = gridCount * cellSize;
    board.style.width = board.style.height = `${boardPx}px`;
    document.getElementById('game-header').style.width = `${boardPx}px`;
    
    document.querySelectorAll('.cell').forEach(el => el.remove());
    for (let y = 0; y < gridCount; y++) {
        for (let x = 0; x < gridCount; x++) {
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
        if (f.expiresAt - Date.now() < 2000) foodEl.style.opacity = "0.5";
        board.appendChild(foodEl);
    });
    snake.forEach((part, i) => {
        const partEl = document.createElement('div');
        partEl.className = 'snake-part';
        partEl.style.left = `${part.x * cellSize}px`;
        partEl.style.top = `${part.y * cellSize}px`;
        partEl.style.backgroundImage = `url("${loadedImages[i % loadedImages.length].src}")`;
        if (i === 0 && (direction.x !== 0 || direction.y !== 0)) {
            let angle = (direction.x === 1) ? 90 : (direction.x === -1) ? -90 : (direction.y === 1) ? 180 : 0;
            partEl.style.transform = `rotate(${angle}deg)`;
        }
        board.appendChild(partEl);
    });
}

function update() {
    if (!gameRunning) return;
    const now = Date.now();
    foods = foods.filter(f => now < f.expiresAt);
    if (foods.length < 2) spawnFood();

    if (direction.x === 0 && direction.y === 0 && nextDirection.x === 0 && nextDirection.y === 0) return;
    direction = nextDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount || snake.some(p => p.x === head.x && p.y === head.y)) {
        gameOver(); return;
    }
    snake.unshift(head);
    const eatenIndex = foods.findIndex(f => f.x === head.x && f.y === head.y);
    if (eatenIndex !== -1) {
        gpa = Math.max(0, gpa + foods[eatenIndex].grade.val);
        score++; updateUI(); foods.splice(eatenIndex, 1); spawnFood();
    } else { snake.pop(); }
    draw();
}

function spawnFood() {
    while (foods.length < 2) {
        let nX = Math.floor(Math.random() * gridCount), nY = Math.floor(Math.random() * gridCount);
        if (!snake.some(p => p.x === nX && p.y === nY) && !foods.some(f => f.x === nX && f.y === nY)) {
            foods.push({ x: nX, y: nY, grade: grades[Math.floor(Math.random() * grades.length)], expiresAt: Date.now() + 5000 });
        }
    }
}

function updateUI() {
    gpaDisplay.innerText = `GPA: ${gpa.toFixed(2)}`;
    scoreDisplay.innerText = `Score: ${score}`;
}

function gameOver() {
    gameRunning = false;
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('win').innerText = gpa >= 4.0 ? 'You can play lacrosse!!' : 'Cant play lacrosse :(';
    document.getElementById('final-stats').innerText = `Final GPA: ${gpa.toFixed(2)}`;
}

window.resetGame = () => {
    snake = [{ x: 7, y: 7 }]; direction = { x: 0, y: 0 }; nextDirection = { x: 0, y: 0 };
    gpa = 0; score = 0; foods = []; gameRunning = true;
    document.getElementById('overlay').style.display = 'none';
    updateUI(); spawnFood(); draw();
};

// Input Listeners
window.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && direction.y !== 1) nextDirection = { x: 0, y: -1 };
    if (e.key === 'ArrowDown' && direction.y !== -1) nextDirection = { x: 0, y: 1 };
    if (e.key === 'ArrowLeft' && direction.x !== 1) nextDirection = { x: -1, y: 0 };
    if (e.key === 'ArrowRight' && direction.x !== -1) nextDirection = { x: 1, y: 0 };
});

let tX = 0, tY = 0;
window.addEventListener('touchstart', e => { tX = e.touches[0].clientX; tY = e.touches[0].clientY; }, {passive: false});
window.addEventListener('touchend', e => {
    let dX = e.changedTouches[0].clientX - tX, dY = e.changedTouches[0].clientY - tY;
    if (Math.abs(dX) > 30 || Math.abs(dY) > 30) {
        if (Math.abs(dX) > Math.abs(dY)) {
            if (dX > 0 && direction.x !== -1) nextDirection = { x: 1, y: 0 };
            else if (dX < 0 && direction.x !== 1) nextDirection = { x: -1, y: 0 };
        } else {
            if (dY > 0 && direction.y !== -1) nextDirection = { x: 0, y: 1 };
            else if (dY < 0 && direction.y !== 1) nextDirection = { x: 0, y: -1 };
        }
    }
}, {passive: false});

window.addEventListener('resize', () => { initLayout(); draw(); });
initLayout(); spawnFood(); setInterval(update, speed);