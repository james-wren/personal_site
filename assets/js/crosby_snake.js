const gameBox = document.getElementById('game_box');
const inputForm = document.getElementById('game_input');
const submitBtn = document.getElementById('submit');

function crosbySnake(food, size, speed){
    document.getElementById('grey_out').style.display = 'block';
    document.getElementById('crosby_game').style.display = 'block';
}

inputForm.addEventListener('submit', (e) => {
    event.preventDefault();

    try {
        const choicesRaw = new FormData(e.target);
        const choices = Object.fromEntries(choicesRaw.entries());
        console.log(choices);
        crosbySnake(choices.food, choices.size, choices.speed);
    }catch(error) {
        console.log(error);
    }
});
