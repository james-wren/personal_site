const body = document.getElementById('body');
const gameBox = document.getElementById('game_box');
const inputForm = document.getElementById('game_input');
const submitBtn = document.getElementById('submit');
const crosbyBox = document.getElementById('crosby_box');
const crosbyGameBg = document.getElementById('crosby_game_bg');

const canvas = document.getElementById('crosby_game');
const ctx = canvas.getContext("2d")
const images = [
    new Image(), 
    new Image(), 
    new Image(), 
    new Image(), 
    new Image(),
    new Image()
]

const food_images = [
    new Image(), 
    new Image(), 
    new Image(), 
    new Image(), 
    new Image()
]

let end = false;
let moveDir = "up";
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function gameLoop(rate, size, food){
    const grid_width = canvas.width/size;
    const grid_height = canvas.height/size;
    let image_num = 0;

    let snake_pos = {
        0: {
            'pos' : [Math.floor(size / 2) * grid_width, Math.floor(size / 2) * grid_height],
            'img' : images[0]
        }
    };

    let food_pos = {};

    let length = 0;
    let image_map = [];

    function addCros(){
        let random = Math.floor(Math.random() * 6);
        let img = images[random];
        length++;

        snake_pos[length] = {
            'pos' : [...snake_pos[length-1]['pos']], 
            'img' : img
        }
    }

    function addFood(num){
        let food_num = Math.floor(Math.random() * 5);
        let x = Math.floor(Math.random() * size) * grid_width;
        let y = Math.floor(Math.random() * size) * grid_height;
        let value;

        switch(food_num){
            case 0:
                value = 'a';
                break;
            case 1:
                value = 'b';
                break;
            case 2:
                value = 'c';
                break;
            case 3:
                value = 'd';
                break;
            case 4:
                value = 'f';
                break;
        }

        food_pos[num] = {
            'pos' : [x, y],
            'img' : food_images[food_num],
            'value' : value
        }
    }
    

    for(i = 0; i < food; i++){
        addFood(i);
    }

    while(true){
        let random = Math.floor(Math.random() * 6);
        let img = images[random];

        switch (moveDir){
            case "up":
                snake_pos[0]['pos'][1] -= grid_height;
                break;
            case 'right':
                snake_pos[0]['pos'][0] += grid_width;
                break;
            case 'down':
                snake_pos[0]['pos'][1] += grid_height;
                break;
            case 'left':
                snake_pos[0]['pos'][0] -= grid_width;
                break;
        }

        const snake_length = Object.keys(snake_pos).length -1;
        for(let i=snake_length; i >= 0; i--){
            if(i != 0){
                snake_pos[i]['pos'] = [...snake_pos[i-1]['pos']];
            } else {
                if (snake_pos[i]['pos'][0] < 0 || snake_pos[i]['pos'][1] < 0 || snake_pos[i]['pos'][0] > canvas.width - grid_width || snake_pos[i]['pos'][1] > canvas.height - grid_height){
                    end = true;
                }
            }
        }

        if (end) {
            break;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let i=0; i < Object.keys(food_pos).length; i++){
            if (Math.round(snake_pos[0]['pos'][0]) == Math.round(food_pos[i]['pos'][0]) && Math.round(snake_pos[0]['pos'][1]) == Math.round(food_pos[i]['pos'][1])) {
                addFood(i);
                addCros();
            } else {
                ctx.drawImage(food_pos[i]['img'], food_pos[i]['pos'][0], food_pos[i]['pos'][1], grid_width - 3, grid_height - 3);
            }
        }

        for(let i=snake_length; i >= 0; i--){
            ctx.drawImage(snake_pos[i]['img'], snake_pos[i]['pos'][0], snake_pos[i]['pos'][1], grid_width - 3, grid_height - 3);
        }
        await sleep(rate);
    }

    document.getElementById('grey_out').style.display = 'none';
    document.getElementById('crosby_box').style.display = 'none';
    body.style.overflow = 'visible';
}

function drawBg(xAmount, yAmount){
    crosbyGameBg.innerHTML = '';
    crosbyGameBg.style.gridTemplateColumns = `repeat(${xAmount}, 1fr)`;
    crosbyGameBg.style.gridTemplateRows = `repeat(${yAmount}, 1fr)`;

    for (let i = yAmount; i > 0; i--) {
        for (let j = xAmount; j > 0; j--){
            let div = document.createElement('div');
            if (j % 2 == 0 && i % 2 == 0){
                div.style.backgroundColor = 'red';
            } else if (j % 2 != 0 && i % 2 != 0){
                div.style.backgroundColor = 'red';
            }
            div.className = 'grid_square';
            crosbyGameBg.appendChild(div);
        }
    }

    canvas.width = crosbyGameBg.offsetWidth;
    canvas.height = crosbyGameBg.offsetHeight;
}

function crosbySnake(food, size, speed){
    document.getElementById('grey_out').style.display = 'flex';
    document.getElementById('crosby_box').style.display = 'block';
    body.style.overflow = 'hidden';

    drawBg(size, size);

    images.forEach((image, i) =>{
        image.src = `/assets/images/games/crosby/cros${i}.JPG`;
    });

    food_images.forEach((image, i) =>{
        image.src = `/assets/images/games/crosby/food/${i}.SVG`
    });

    gameLoop(speed, size, food);

    let widthAmount;
    let heightAmount;

    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case "ArrowUp":
                if(moveDir != 'down'){
                    moveDir = 'up';
                }
                break;
            case "ArrowRight":
                if (moveDir != 'left'){
                    moveDir = 'right';
                }
                break;
            case "ArrowDown":
                if(moveDir != 'up'){
                    moveDir = 'down';
                }
                break;
            case "ArrowLeft":
                if(moveDir != 'right'){
                    moveDir = 'left';
                }
                break;
            case 'q':
                end = true;
        }
    });
}

inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    end = false;

    try {
        const choicesRaw = new FormData(e.target);
        const choices = Object.fromEntries(choicesRaw.entries());
        console.log(choices);
        crosbySnake(parseInt(choices.food), parseInt(choices.size), parseInt(choices.speed));
    }catch(error) {
        console.log(error);
    }
});
