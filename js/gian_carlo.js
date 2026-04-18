let score = 0;
let pointsPerSecond = 0;

const upgrades = [
    { id: 'soccer', name: 'Soccer Skill + 1/sec', cost: 15, increase: 1, count: 0, lore: 'Been terrible since Hillcrest Elementry' },
    { id: 'lacrosse', name: 'Lacrosse Skill + 5/sec', cost: 100, increase: 5, count: 0, lore: '"Worst lacrosse Player of all time" - Hudson' },
    { id: 'wakeboarding', name: 'Wakeboarding Skill + 20/sec', cost: 500, increase: 20, count: 0, lore: 'Bad, but still better than tanner' },
    { id: 'placeholder2', name: 'Play Destiny + 80/sec', cost: 2000, increase: 80, count: 0, lore: 'Heard he likes it, I guess' },
    { id: 'placeholder3', name: 'Play Siege + 400/sec', cost: 10000, increase: 400, count: 0, lore: 'Buns' },
    { id: 'placeholder4', name: '3ft barrell at Cocoa + 1500/sec', cost: 50000, increase: 1500, count: 0, lore: "He's Never been barelled" }
];

const scoreDisplay = document.getElementById('score');
const ppsDisplay = document.getElementById('pps');
const clickerImage = document.getElementById('clicker-image');
const upgradeList = document.getElementById('upgrade-list');

function updateDisplay() {
    scoreDisplay.innerText = Math.floor(score);
    ppsDisplay.innerText = pointsPerSecond.toFixed(1);
    
    // Efficiently update upgrade buttons
    const items = document.querySelectorAll('.upgrade-item');
    upgrades.forEach((u, i) => {
        if (items[i]) {
            if (score >= u.cost) {
                items[i].classList.remove('disabled');
            } else {
                items[i].classList.add('disabled');
            }
            items[i].querySelector('.upgrade-cost').innerText = `Cost: ${u.cost}`;
            items[i].querySelector('.upgrade-name').innerText = `${u.name} (Owned: ${u.count})`;
        }
    });
}

function initUpgrades() {
    upgradeList.innerHTML = '';
    upgrades.forEach((upgrade, index) => {
        const div = document.createElement('div');
        div.className = 'upgrade-item disabled';
        div.innerHTML = `
            <span class="upgrade-name">${upgrade.name} (Owned: 0)</span>
            <span class="upgrade-cost">Cost: ${upgrade.cost}</span>
            <div style="font-size: 0.8rem; color: #bdc3c7;">${upgrade.lore}</div>
        `;
        div.onclick = () => buyUpgrade(index);
        upgradeList.appendChild(div);
    });
}

function buyUpgrade(index) {
    const u = upgrades[index];
    if (score >= u.cost) {
        score -= u.cost;
        u.count++;
        pointsPerSecond += u.increase;
        u.cost = Math.floor(u.cost * 1.15);
        updateDisplay();
    }
}

clickerImage.addEventListener('click', () => {
    score += 1;
    // Jiggle effect on click
    clickerImage.style.transform = 'scale(0.9) rotate(-5deg)';
    setTimeout(() => {
        clickerImage.style.transform = 'scale(1) rotate(0deg)';
    }, 50);
    updateDisplay();
});

setInterval(() => {
    score += pointsPerSecond / 10;
    updateDisplay();
}, 100);

initUpgrades();
updateDisplay();
