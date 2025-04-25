// === Sélection des éléments ===
const basicClicker = document.getElementById('basic'); // Changement de 'xavier' à 'basic'
const scoreDisplay = document.getElementById('score');
const generatorsDisplay = document.getElementById('generators');
const factoriesDisplay = document.getElementById('factories');
const bankDisplay = document.getElementById('bank');
const printerDisplay = document.getElementById('printer');
const generatorCostSpan = document.getElementById('generatorCost');
const boosterCostSpan = document.getElementById('boosterCost');
const factoryCostSpan = document.getElementById('factoryCost');
const clickLevelDisplay = document.getElementById('clickLevel');
const clickUpgradeCostSpan = document.getElementById('clickUpgradeCost');
const achievementsDisplay = document.getElementById('achievements');
const toggleBtn = document.getElementById('toggleAchievements');

// === Boutons ===
const buyButton = document.getElementById('buyGenerator');
const boosterBtn = document.getElementById('buyBooster');
const factoryBtn = document.getElementById('buyFactory');
const clickUpgradeBtn = document.getElementById('upgradeClick');
const buyBankButton = document.getElementById('buyBank');
const buyPrinterButton = document.getElementById('buyPrinter');

// === Variables du jeu ===
let points = 1;

let generators = 0;
let generatorCost = 10;

let factories = 0;
let factoryCost = 200;

let bank = 0;
let bankCost = 5000;

let printer = 0;
let printerCost = 10000;

let boosterActive = false;
let boosterMultiplier = 2;
let boosterDuration = 10000;
let boosterCost = 100;

let clickLevel = 1;
let clickPower = 1;
let clickUpgradeCost = 50;

let pendingPoints = 0;

let lastBoosterTime = 0;
const boosterCooldown = 30000;

const achievementsUnlocked = new Set();

// === Liste des achievements ===
const achievements = [
  { threshold: 10, message: "A small step for Basic Clicker: 10 points" },
  { threshold: 50, message: "Explorer of Basic Clicker: 50 points" },
  { threshold: 100, message: "Encouraging Basic Clicker: 100 points" },
  { threshold: 500, message: "Basic Clicker? : 500!" },
  { threshold: 1000, message: "Basic Clicker! : 1000!" },
  { threshold: 5000, message: "Basic Clicker bronze: 5000!" },
  { threshold: 10000, message: "Basic Clicker silver: 10000!" },
  { threshold: 25000, message: "Basic Clicker gold: 25000!" },
  { threshold: 50000, message: "Basic Clicker platinum: 50000!" },
  { threshold: 100000, message: "Basic Clicker diamond: 100000!" },
  { threshold: 500000, message: "Basic Clicker master: 500000!" },
  { threshold: 1000000, message: "You really have nothing to do Basic Clicker: 1000000!" }
];

// === Fonctions principales ===
function updateDisplay() {
  scoreDisplay.textContent = `Points: ${points}`;
  generatorsDisplay.textContent = `Generator: ${generators}`;
  factoriesDisplay.textContent = `Factory: ${factories}`;
  bankDisplay.textContent = `Bank: ${bank}`;
  printerDisplay.textContent = `Printer: ${printer}`;
  generatorCostSpan.textContent = generatorCost;
  boosterCostSpan.textContent = boosterCost;
  factoryCostSpan.textContent = factoryCost;
  clickLevelDisplay.textContent = `Click Level: ${clickLevel} (${clickPower} pt${clickPower > 1 ? 's' : ''} per click)`;
  clickUpgradeCostSpan.textContent = clickUpgradeCost;
  buyBankButton.textContent = `Bank: (${bankCost} pts)`;
  buyPrinterButton.textContent = `Printer: (${printerCost} pts)`;
}

function updateAchievementCounter() {
  toggleBtn.textContent = `View Achievements (${achievementsUnlocked.size}/${achievements.length})`;
}

function checkAchievements() {
  achievements.forEach(({ threshold, message }) => {
    if (points >= threshold && !achievementsUnlocked.has(threshold)) {
      achievementsUnlocked.add(threshold);
      const div = document.createElement('div');
      div.className = 'achievement';
      div.textContent = message;
      achievementsDisplay.appendChild(div);
      updateAchievementCounter();
    }
  });
}

// === Gestion des clics ===
let clickCount = 0;
basicClicker.addEventListener('click', () => {
  clickCount++;
  let multiplier = 1;

  if (clickCount % 100 === 0) {
    multiplier = Math.random() < 0.5 ? 2 : 10;
  } else {
    if (Math.random() < 0.98) {
      multiplier = 1;
    } else if (Math.random() < 0.99) {
      multiplier = 2;
    } else {
      multiplier = 10;
    }
  }

  points += clickPower * multiplier;
  updateDisplay();
  checkAchievements();

  if (multiplier > 1) {
    triggerSpecialAnimation(multiplier);
  }
});

function triggerSpecialAnimation(multiplier) {
  const animationDiv = document.createElement('div');
  animationDiv.className = 'special-animation';
  animationDiv.textContent = `x${multiplier}`;
  document.body.appendChild(animationDiv);

  setTimeout(() => {
    animationDiv.remove();
  }, 2000);
}

// === Achat d’un générateur ===
buyButton.addEventListener('click', () => {
  if (points >= generatorCost) {
    points -= generatorCost;
    generators++;
    generatorCost = Math.floor(generatorCost * 1.5);
    updateDisplay();
  }
});

// === Activation du booster ===
boosterBtn.addEventListener('click', () => {
  const now = Date.now();

  if (points >= boosterCost && !boosterActive && (now - lastBoosterTime >= boosterCooldown)) {
    points -= boosterCost;
    boosterActive = true;
    lastBoosterTime = now;

    boosterBtn.disabled = true;
    boosterBtn.textContent = "Booster active...";

    setTimeout(() => {
      boosterActive = false;
      boosterBtn.textContent = `Booster recharge...`;
      
      // Commence le cooldown visuel
      setTimeout(() => {
        boosterBtn.disabled = false;
        boosterBtn.textContent = `Generator Booster (cost: ${boosterCost} pts)`;
      }, boosterCooldown);
    }, boosterDuration);

    updateDisplay();
  }
});

// === Achat d’une usine ===
factoryBtn.addEventListener('click', () => {
  if (points >= factoryCost) {
    points -= factoryCost;
    factories++;
    factoryCost = Math.floor(factoryCost * 2);
    updateDisplay();
  }
});

// === Achat de la banque ===
buyBankButton.addEventListener('click', () => {
  if (points >= bankCost) {
    points -= bankCost;
    bank++;
    bankCost = Math.floor(bankCost * 1.5);
    updateDisplay();
  }
});

// === Achat de l’imprimante ===
buyPrinterButton.addEventListener('click', () => {
  if (points >= printerCost) {
    points -= printerCost;
    printer++;
    printerCost = Math.floor(printerCost * 1.5);
    updateDisplay();
  }
});

// === Amélioration du clic ===
clickUpgradeBtn.addEventListener('click', () => {
  if (points >= clickUpgradeCost) {
    points -= clickUpgradeCost;
    clickLevel++;
    clickPower++;
    clickUpgradeCost = Math.floor(clickUpgradeCost * 2);
    updateDisplay();
  }
});

// === Toggle affichage achievements ===
toggleBtn.addEventListener('click', () => {
  achievementsDisplay.style.display = achievementsDisplay.style.display === 'none' ? 'block' : 'none';
});

// === Gain automatique par seconde ===
const generatorBaseGain = 1;
const factoryBaseGain = 10;
const bankBaseGain = 50;
const printerBaseGain = 100;

const intervalMs = 100;

setInterval(() => {
  if (generators > 0 || factories > 0 || bank > 0 || printer > 0) {
    const multiplier = boosterActive ? boosterMultiplier : 1;

    const genGain = (generators * generatorBaseGain * multiplier) / (1000 / intervalMs);
    const factoryGain = (factories * factoryBaseGain * multiplier) / (1000 / intervalMs);
    const bankGain = (bank * bankBaseGain * multiplier) / (1000 / intervalMs);
    const printerGain = (printer * printerBaseGain * multiplier) / (1000 / intervalMs);

    pendingPoints += genGain + factoryGain + bankGain + printerGain;

    const wholePoints = Math.floor(pendingPoints);
    if (wholePoints > 0) {
      points += wholePoints;
      pendingPoints -= wholePoints;
      updateDisplay();
      checkAchievements();
    }
  }
}, intervalMs);

// === Gestion de la musique ===
const backgroundMusic = document.getElementById('background-music');
const toggleMusicBtn = document.getElementById('toggle-music');

backgroundMusic.play();

let isMuted = false;
toggleMusicBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  if (isMuted) {
    backgroundMusic.muted = true;
    toggleMusicBtn.textContent = 'Unmute';
  } else {
    backgroundMusic.muted = false;
    toggleMusicBtn.textContent = 'Mute';
  }
});
