class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leaderBoardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.playerMoving = false;
    this.leftKeyActive = false;
    this.blast = false;
  }

  getState() {
    database.ref("gameState").on("value", (data) => {
      gameState = data.val();
    })
  }

  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    form = new Form();
    form.show();

    player = new Player();
    playerCount = player.getCount();

    motorCycle1 = createSprite(width / 2 - 70, height - 100);
    motorCycle1.addImage("motorCycle1", motorCycle1Image);
    motorCycle1.addImage("blast", blastImage);
    motorCycle1.scale = 0.35;

    motorCycle2 = createSprite(width / 2 + 50, height - 100);
    motorCycle2.addImage("motorCycle2", motorCycle2Image);
    motorCycle2.addImage("blast", blastImage);
    motorCycle2.scale = 0.6;

    motorCycles = [motorCycle1, motorCycle2];

    var obstaclesPositions = [{
      x: width / 2 + 250,
      y: height - 800,
      image: obstacle2Image
    }, {
      x: width / 2 - 150,
      y: height - 1300,
      image: obstacle1Image
    }, {
      x: width / 2 + 250,
      y: height - 1800,
      image: obstacle1Image
    }, {
      x: width / 2 - 180,
      y: height - 2300,
      image: obstacle2Image
    }, {
      x: width / 2,
      y: height - 2800,
      image: obstacle2Image
    }, {
      x: width / 2 - 180,
      y: height - 3300,
      image: obstacle1Image
    }, {
      x: width / 2 + 180,
      y: height - 3300,
      image: obstacle2Image
    }, {
      x: width / 2 + 250,
      y: height - 3800,
      image: obstacle2Image
    }, {
      x: width / 2 - 150,
      y: height - 4300,
      image: obstacle1Image
    }, {
      x: width / 2 + 250,
      y: height - 4800,
      image: obstacle2Image
    }, {
      x: width / 2,
      y: height - 5300,
      image: obstacle1Image
    }, {
      x: width / 2 - 180,
      y: height - 5500,
      image: obstacle2Image
    }];

    obstacles = new Group();
    fuels = new Group();
    powerCoins = new Group();

    this.addSprites(fuels, 4, fuelImage, 0.02);
    this.addSprites(powerCoins, 18, powerCoinImage, 0.09);
    this.addSprites(obstacles, obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions);
  }

  handleElements() {
    form.hide();
    form.greeting.hide();
    form.titleImage.hide();
    form.titleImage.class("gameTitleAfterEffect");

    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, height / 2 - 400);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 225, height / 2 - 340);

    this.leaderBoardTitle.html("Leaderboard");
    this.leaderBoardTitle.class("resetText");
    this.leaderBoardTitle.position(width / 3 - 60, height / 2 - 400);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 120);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 160);
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, position = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      if (position.length > 0) {
        x = position[i].x;
        y = position[i].y;
        spriteImage = position[i].image;
      } else {
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 100);
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);
      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  play() {
    this.handleElements();
    this.handleResetButton();
  

    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      this.showLeaderBoard();
      this.showLife();
      this.showFuel();
      

  var motorCycleIndex = 0;

      for (var plr in allPlayers) {
        motorCycleIndex += 1;

        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        var currentLife = allPlayers[plr].life;

        if (currentLife <= 0) {
          motorCycles[motorCycleIndex - 1].changeImage("blast");
          motorCycles[motorCycleIndex - 1].scale = 0.3;
        }

        motorCycles[motorCycleIndex - 1].position.x = x;
        motorCycles[motorCycleIndex - 1].position.y = y;

        if (motorCycleIndex === player.i) {
          stroke(10);
          fill("white");
          ellipse(x, y, 60, 60);

          camera.position.y = motorCycles[motorCycleIndex - 1].position.y;

          this.handleFuel(motorCycleIndex);
          this.handlePowerCoins(motorCycleIndex);
          this.handleCarCollision(motorCycleIndex);
          this.handleObstacleCollisions(motorCycleIndex);

          if (player.life <= 0) {
            this.blast = true;
            this.playerMoving = false;
          }
        }
      }

      const finishLine = height * 6 - 100;

      if (player.positionY > finishLine) {
        gameState = 2;
        player.rank += 1; 
        this.showRank();
        player.update();
      }

      this.handlePlayerControls();
      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        gameState: 0,
        playerCount: 0,
        players: {},
        motorCyclesAtEnd: 0
      });
      window.location.reload();
    });
  }

  showLife() {
    push();
    image(lifeImage, width / 2 - 120, height - player.positionY - 200, 20, 20);
    fill("white");
    rect(width / 2 - 90, height - player.positionY - 200, 185, 20);
    fill("#f50057");
    rect(width / 2 - 90, height - player.positionY - 200, player.life, 20);
    noStroke();
    pop();
  }

  showFuel() {
    push();
    image(fuelImage, width / 2 - 120, height - player.positionY - 150, 20, 20);
    fill("white");
    rect(width / 2 - 90, height - player.positionY - 150, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 90, height - player.positionY - 150, player.fuel, 20);
    noStroke();
    pop();
  }

  showLeaderBoard() {
    var leader1, leader2;

    var players = Object.values(allPlayers);

    if ((players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1) {
      leader1 = players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score

      leader2 = players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score
    }

    if (players[1].rank === 1) {
      leader1 = players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score  

      leader2 = players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }


  handlePlayerControls() {
    if (!this.blast) {
      if (keyIsDown(UP_ARROW)) {
        this.playerMoving = true;
        player.positionY += 10;
        player.update();
      }

      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        player.positionX += 10;
        this.leftKeyActive = true;
        player.update();
      }

      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 2 - 320) {
        player.positionX -= 10;
        this.leftKeyActive = false;
        player.update();
      }
    }
  }

  handleFuel(index) {
    motorCycles[index - 1].overlap(fuels, (collector, collected) => {
      player.fuel = 185;
      collected.remove();
    });
    
    if (player.fuel > 0 && this.playerMoving) {
      player.fuel -= 0.3;
    }

    if (player.fuel <= 0) {
      gameState = 2;
      this.gameOver();
    }
  }

  handlePowerCoins(index) {
    motorCycles[index - 1].overlap(powerCoins, (collector, collected) => {
      player.score = player.score + 50;
      collected.remove();
      player.update();
    });
  }

  handleObstacleCollisions(index) {
    if (motorCycles[index - 1].collide(obstacles)) {

      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      if (player.life > 0) {
        player.life -= 185 / 4;
      }

      player.update();
    }
  }

  handleCarCollision(index) {
    if (index === 1) {
      if (motorCycles[index - 1].collide(motorCycles[1])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }
        if (player.life > 0) {
          player.life -= 185 / 4;
        }
        player.update();
      }
    }

    if (index === 2) {
      if (motorCycles[index - 1].collide(motorCycles[1])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }
        if (player.life > 0) {
          player.life -= 185 / 4;
        }
        player.update();
      }
    }
  }

  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank is ${player.rank}`,
      text: `Congratulations! You won the game!`,
      imageUrl: `"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png"`,
      imageSize: `150x150`,
      confimButtonText: `Play Again!`
    }, (isConfirm) => {
      if (isConfirm) {
        window.location.reload();
      };
    });
  }

  gameOver() {
    swal({
      title: `Game Over!`,
      text: `You snooze, You lose!`,
      imageUrl: `https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png`,
      imageSize: `150x150`,
      confimButtonText: `Play Again!`
    }, (isConfirm) => {
      if (isConfirm) {
        window.location.reload();
      }
    });
  }
}