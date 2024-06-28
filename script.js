let score = 0;
let clickPower = 1;
let clickCost = 10;
let autoClickerCost = 100;
let autoClickerActive = false;
let startTime = null;
let inventory = [];

const scoreDisplay = document.getElementById('score');
const timePlayedDisplay = document.getElementById('time-played');
const clickButton = document.getElementById('click-button');
const upgradeClickButton = document.getElementById('upgrade-click');
const autoClickerButton = document.getElementById('auto-clicker');
const achievementsList = document.getElementById('achievements-list');
const inventoryList = document.getElementById('inventory-list');
const clickSound = document.getElementById('click-sound');

const achievements = [
    { id: 'achievement-100', text: 'Reach 100 points', target: 100, unlocked: false },
    { id: 'achievement-500', text: 'Reach 500 points', target: 500, unlocked: false },
    { id: 'achievement-1000', text: 'Reach 1000 points', target: 1000, unlocked: false }
];

clickButton.addEventListener('click', (event) => {
    score += clickPower;
    updateScore();
    playClickSound();
    checkAchievements();
    showFloatingScore("+1", event.clientX, event.clientY);
});

upgradeClickButton.addEventListener('click', () => {
    if (score >= clickCost) {
        score -= clickCost;
        clickPower++;
        clickCost = Math.ceil(clickCost * 1.5);
        updateScore();
    }
});

autoClickerButton.addEventListener('click', () => {
    if (score >= autoClickerCost && !autoClickerActive) {
        score -= autoClickerCost;
        autoClickerActive = true;
        autoClickerButton.disabled = true;
        updateScore();
        startAutoClicker();
    }
});

function updateScore() {
    scoreDisplay.textContent = score;
    scoreDisplay.classList.add('pop');
    setTimeout(() => {
        scoreDisplay.classList.remove('pop');
    }, 300);
}

function checkAchievements() {
    achievements.forEach(achievement => {
        if (score >= achievement.target && !achievement.unlocked) {
            achievement.unlocked = true;
            addAchievement(achievement.text, achievement.id);
            showAchievementPopup(achievement.text);
        }
    });
}

function addAchievement(text, id) {
    const achievementItem = document.createElement('li');
    achievementItem.id = id;
    achievementItem.innerHTML = `
        <div>${text}</div>
        <div class="achievement-progress">
            <div class="achievement-progress-bar" style="width: 100%;"></div>
        </div>
    `;
    achievementsList.appendChild(achievementItem);
}

function showAchievementPopup(text) {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.textContent = `Achievement Unlocked: ${text}`;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 500);
        }, 3000);
    }, 100);
}

function startAutoClicker() {
    setInterval(() => {
        score += clickPower;
        updateScore();
        checkAchievements();
    }, 1000);
}

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

function showFloatingScore(text, mouseX, mouseY) {
    const floatingText = document.createElement('span');
    floatingText.textContent = text;
    floatingText.className = 'floating-text';
    document.body.appendChild(floatingText);

    floatingText.style.left = `${mouseX}px`;
    floatingText.style.top = `${mouseY}px`;

    setTimeout(() => {
        floatingText.remove();
    }, 1000);
}

function updateTimePlayed() {
    if (!startTime) {
        startTime = Date.now();
    }

    setInterval(() => {
        const currentTime = Date.now();
        const timeDiff = currentTime - startTime;
        const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timePlayedDisplay.textContent = formattedTime;
    }, 1000);
}

function addToInventory(item) {
    inventory.push(item);
    updateInventory();
}

function updateInventory() {
    inventoryList.innerHTML = '';
    inventory.forEach(item => {
        const inventoryItem = document.createElement('li');
        inventoryItem.textContent = item;
        inventoryList.appendChild(inventoryItem);
    });
}

updateTimePlayed();
