var canvas, sceneImage, motorCycle1Image, motorCycle2Image, track;
var fuelImage, powerCoinImage, lifeImage, blastImage, obstacle1Image, obstacle2Image;
var database, gameState, form, player, playerCount;
var allPlayers, motorCycle1, motorCycle2, fuels, powerCoins, obstacles;
var motorCycles = [];

function preload() {
  track = loadImage("assets/track.jpg");
  sceneImage = loadImage("assets/background.png");
  motorCycle1Image = loadImage("assets/motorRacer1.png");
  motorCycle2Image = loadImage("assets/motorRacer2.png");

  fuelImage = loadImage("assets/fuel.png");
  powerCoinImage = loadImage("assets/goldCoin.png");
  lifeImage = loadImage("assets/life.png");
  blastImage = loadImage("assets/blast.png");

  obstacle1Image = loadImage("assets/obstacle1.png");
  obstacle2Image = loadImage("assets/obstacle2.png");
}

function setup() {
  database = firebase.database();
  canvas = createCanvas(windowWidth, windowHeight);

  game = new Game();
  game.start();
  game.getState();
}

function draw() {
  background(sceneImage);

  if (playerCount == 2) {
    game.update(1);
  }

  if (gameState == 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}