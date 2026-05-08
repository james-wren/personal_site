// Defines parts of the html document
const body = document.getElementById('body');
const gameBox = document.getElementById('game_box');
const inputForm = document.getElementById('game_input');
const submitBtn = document.getElementById('submit');
const crosbyBox = document.getElementById('crosby_box');
const crosbyGameBg = document.getElementById('crosby_game_bg');

//defines canvas
const canvas = document.getElementById('crosby_game');
const ctx = canvas.getContext("2d")

//creates a list of images for the crosby photos
const images = [
    new Image(), 
    new Image(), 
    new Image(), 
    new Image(), 
    new Image(),
    new Image()
]

//creates a list of images for the food svgs
const food_images = [
    new Image(), 
    new Image(), 
    new Image(), 
    new Image(), 
    new Image()
]

let end = false; //defines a variable to end the game when true
let moveDir = null; //Defines a variable for the direction the snake is moving
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));//Defines a timout promise for frame timing

let nextDir = null;//Defines a varable to change directions

//main gameloop function, this is where all code that runs over and over during the game goes
async function gameLoop(rate, size, food){
    //defines the size of each grid cell
    const grid_width = canvas.width/size;
    const grid_height = canvas.height/size;
    
    //Defines snake head peice
    let snake_pos = {
        // first snake peice
        0: {
            'pos' : [10 * grid_width, 10 * grid_height], //Sets intial position to 10,10
            'img' : images[0], //Sets image to 1st image in list
            'dir' : 'up'
        }
    };

    let food_pos = {};//Defines and object for the food peices

    let length = 0; //Defines legth of the snake

    function addCros(){
        // Gets a random number for image
        let random = Math.floor(Math.random() * 6);
        // Sets image to image from the images list
        let img = images[random];
        // Sets legth to one longer
        length++;

        // Adds another peice to the snake - NEEDS WORK
        snake_pos[length] = {
            'pos' : [...snake_pos[length-1]['pos']],  // Sets postion to the same position as the peice before it
            'img' : img, //Sets image to predetermined image
            'dir' : snake_pos[length-1]['dir'] // sets dir equal to one infront
        }

        switch(snake_pos[length]['dir']){
            case 'up':
                snake_pos[length]['pos'][1] -= grid_height;
                break;
            case 'down':
                snake_pos[length]['pos'][1] += grid_height;
                break;
            case 'left':
                snake_pos[length]['pos'][0] -= grid_width;
                break;
            case 'right':
                snake_pos[length]['pos'][0] += grid_width;
                break;
        }
    }

    //Function to add a peice of food
    function addFood(num){
        let food_num = Math.floor(Math.random() * 5); // Gets a random number to pick random image
        let x = Math.floor(Math.random() * size) * grid_width; // Randomly sets x coordinate for food
        let y = Math.floor(Math.random() * size) * grid_height; // Randomly sets Y coordinate for food
        let value; // Creates variable to hold the value of the food

        // Switch to determine food value based on food_num 
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

        //Adds a food peice to the food_pos object
        food_pos[num] = {
            'pos' : [x, y], // Sets position to previously determined coordinates
            'img' : food_images[food_num], //Sets image to the randomly selected image
            'value' : value //Sets value to determined value
        }
    }
    
    function checkSnake(object){
        if (moveDir){
            console.log(object);
            const touching = posHistory.some(([hx, hy]) => 
                Math.round(object[0]) === Math.round(hx) && Math.round(object[1]) === Math.round(hy)
            );

            console.log(touching ? 'touching' : 'not touching');
            return touching;
        } else {
            return false;
        }
    }

    //adds food for amount selected
    for(let i = 0; i < food; i++){
        addFood(i);
    }

    let frameCount = 0; // Defines a counter for frames
    let frameRate = 20; // Defines the amount of times a snake should move per gridspace
    let posHistory = []; // A array to store the past positions of the head

    //Main game loop, this is where the snake actually moves
    while(true){
        // Adds another frame to the count
        frameCount++;
        if(checkSnake([...snake_pos[0]['pos']])){
            end = true;
        }

        posHistory.unshift([...snake_pos[0]['pos']]);


        //Executes change in direction only when snake is on next grid space
        // Done by checking if snake has moved a full grid
        if (frameCount % frameRate == 0 && nextDir != null){
            moveDir = nextDir; // Changes direction
            nextDir = null; // Resets quene
        }

        // Switch to move the snake
        switch (moveDir){
            case 'up':
                // Adds on framerate of a grid space to the x or y coordinate
                // When repeated framerate times the snake will have moved an entire grid square
                snake_pos[0]['pos'][1] -= grid_height / frameRate;
                snake_pos[0]['dir'] = 'up';
                break;
            case 'right':
                snake_pos[0]['pos'][0] += grid_width / frameRate;
                snake_pos[0]['dir'] = 'right';
                break;
            case 'down':
                snake_pos[0]['pos'][1] += grid_height / frameRate;
                snake_pos[0]['dir'] = 'down';
                break;
            case 'left':
                snake_pos[0]['pos'][0] -= grid_width / frameRate;
                snake_pos[0]['dir'] = 'left';
                break;
        }

        // Gets the amount of snake peices and subtracts one to adjust for indexing
        const snake_length = Object.keys(snake_pos).length -1;
        //Loops through snake peices starting from back
        for(let i=snake_length; i >= 0; i--){
            // If the peice is not the head then it moves the piece up to the peice infront of it
            if(i != 0){
                if(posHistory[i * frameRate]){
                    snake_pos[i]['pos'] = [...posHistory[i * frameRate]];
                }
            // checks if the snake head is touching a wall, if it is it ends the game
            } else if (snake_pos[i]['pos'][0] < -10 || snake_pos[i]['pos'][1] < -10 || snake_pos[i]['pos'][0] > canvas.width - grid_width + 10|| snake_pos[i]['pos'][1] > canvas.height - grid_height + 10){
                end = true;
            }
        }

        // Checks if game has been ended before drawing the next frame
        if (end) {
            break;
        }

        // Clears the canvas for incoming next frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Loops through each food item each food peice
        for(let i=0; i < Object.keys(food_pos).length; i++){
            // Checks if snake head is touching a peice of food
            if (Math.round(snake_pos[0]['pos'][0]) == Math.round(food_pos[i]['pos'][0]) && Math.round(snake_pos[0]['pos'][1]) == Math.round(food_pos[i]['pos'][1])) {
                // If it is, replace that peice of food with a new one
                addFood(i);

                //Make the snake longer
                addCros();
            } else { // If food is not touching then draw it on the canvas
                ctx.drawImage(food_pos[i]['img'], food_pos[i]['pos'][0], food_pos[i]['pos'][1], grid_width - 3, grid_height - 3);
            }
        }

        //Loops through each snake peice and draws it
        for(let i=snake_length; i >= 0; i--){
            ctx.drawImage(snake_pos[i]['img'], snake_pos[i]['pos'][0], snake_pos[i]['pos'][1], grid_width - 3, grid_height - 3);
        }

        // Checks if posHistory is too long, this conserves memory
        if(posHistory.length > (snake_length + 1) * frameRate){
            posHistory.length = (snake_length + 2) * frameRate;
        }

        //Sleeps the loop
        await sleep(rate/frameRate);
    }

    document.getElementById('grey_out').style.display = 'none';
    document.getElementById('crosby_box').style.display = 'none';
    body.style.overflow = 'visible';
}

// Function to draw background grid
function drawBg(xAmount, yAmount){
    crosbyGameBg.innerHTML = ''; // Clears current grid
    // Defines columns and row amount
    crosbyGameBg.style.gridTemplateColumns = `repeat(${xAmount}, 1fr)`;
    crosbyGameBg.style.gridTemplateRows = `repeat(${yAmount}, 1fr)`;

    // Loops through each row
    for (let i = yAmount; i > 0; i--) {
        // Loops through each column
        for (let j = xAmount; j > 0; j--){
            // Creates a div
            let div = document.createElement('div');

            // Checks if both coordinates are even
            if (j % 2 == 0 && i % 2 == 0){
                div.style.backgroundColor = 'red'; // Sets div background to red
            } else if (j % 2 != 0 && i % 2 != 0){ // Checks if both coordinates are odd
                div.style.backgroundColor = 'red';// Sets background to red
            }
            div.className = 'grid_square';// Sets div class name for styling
            crosbyGameBg.appendChild(div); // Adds div to screen
        }
    }

    // Sets canvas size to same thing as its container
    canvas.width = crosbyGameBg.offsetWidth;
    canvas.height = crosbyGameBg.offsetHeight;
}

// Function to start the game
function crosbySnake(food, size, speed){
    // makes th egame box visible
    document.getElementById('grey_out').style.display = 'flex';
    document.getElementById('crosby_box').style.display = 'block';
    body.style.overflow = 'hidden'; // Stops user from scrolling the background

    drawBg(size, size); // Draws the background grid

    // Sets image srcs for the crosby images
    images.forEach((image, i) =>{
        image.src = `/assets/images/games/crosby/cros${i}.JPG`;
    });

    // Sets image srcs for the food
    food_images.forEach((image, i) =>{
        image.src = `/assets/images/games/crosby/food/${i}.SVG`
    });

    // Starts game
    gameLoop(speed, size, food);

    // Adds event listener for keypresses
    document.addEventListener('keydown', (e) => {
        // switch to set moveDir to direction based on key pressed
        switch(e.key) {
            case "ArrowUp":
                if(moveDir != 'down'){ // These if statements make sure that you cant do a full 180
                    nextDir = 'up';
                }
                break;
            case "ArrowRight":
                if (moveDir != 'left'){
                    nextDir = 'right';
                }
                break;
            case "ArrowDown":
                if(moveDir != 'up'){
                    nextDir = 'down';
                }
                break;
            case "ArrowLeft":
                if(moveDir != 'right'){
                    nextDir = 'left';
                }
                break;
            case 'q': // If q is pressed then end the game
                end = true;
                break;
        }
    });
}

//Begins game on form submit
inputForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevents page reload on submit
    end = false; //Sets game to playing

    //Tries to get data from form and start game
    //If error it logs the error
    try {
        const choicesRaw = new FormData(e.target);
        const choices = Object.fromEntries(choicesRaw.entries());
        console.log(choices);//logs choices for debugging

        //starts game with the values from the form
        crosbySnake(parseInt(choices.food), parseInt(choices.size), parseInt(choices.speed));
    }catch(error) {
        console.error(`Failed to start game: ${error}`);
    }
});
