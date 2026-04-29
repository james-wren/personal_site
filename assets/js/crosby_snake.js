const body = document.getElementById('body');
const gameBox = document.getElementById('game_box');
const inputForm = document.getElementById('game_input');
const submitBtn = document.getElementById('submit');
const crosbyBox = document.getElementById('crosby_box');
const crosbyGame = document.getElementById('crosby_game');
let end = false;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function gameLoop(rate){
    while(true){
        if (end) {
            break;
        }
        // Put the code that moves the snake here

        await sleep(rate);
    }
}

function drawBg(xAmount, yAmount){
    crosbyGame.style.gridTemplateColumns = 'repeat(20, 1fr)'
    crosbyGame.style.gridTemplateRows = 'repeat(20, 1fr)'

    for (let i = yAmount; i > 0; i--) {
        for (let j = xAmount; j > 0; j--){
            let div = document.createElement('div');
            if (j % 2 == 0 && i % 2 == 0){
                div.style.backgroundColor = 'red';
            } else if (j % 2 != 0 && i % 2 != 0){
                div.style.backgroundColor = 'red';
            }
            div.className = 'grid_square';
            crosbyGame.appendChild(div);
        }
    }
}

function crosbySnake(food, size, speed){
    let moveDir = "up";

    document.getElementById('grey_out').style.display = 'flex';
    document.getElementById('crosby_box').style.display = 'block';

    drawBg(size, size);
    gameLoop(speed);

    let widthAmount;
    let heightAmount;

    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case "ArrowUp":
                moveDir = 'up';
                break;
            case "ArrowRight":
                moveDir = 'right';
                break;
            case "ArrowDown":
                moveDir = 'down';
                break;
            case "ArrowLeft":
                moveDir = 'left';
                break;
            case 'q':
                end = true;
        }
    });
}

inputForm.addEventListener('submit', (e) => {
    event.preventDefault();

    try {
        const choicesRaw = new FormData(e.target);
        const choices = Object.fromEntries(choicesRaw.entries());
        console.log(choices);
        crosbySnake(parseInt(choices.food), parseInt(choices.size), parseInt(choices.speed));
    }catch(error) {
        console.log(error);
    }
});
