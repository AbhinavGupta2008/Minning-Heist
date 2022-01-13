class Game {
    constructor() {
      this.resetTitle = createElement("h2");
      this.resetButton = createButton("");
  
      this.leadeboardTitle = createElement("h2");
  
      this.leader1 = createElement("h2");
      this.leader2 = createElement("h2");
      this.playerMoving = false;
      this.leftKeyActive = false;
      this.blast = false;
    }
  
    getState() {
      var gameStateRef = database.ref("gameState");
      gameStateRef.on("value", function(data) {
        gameState = data.val();
      });
    }
    update(state) {
      database.ref("/").update({
        gameState: state
      });
    }
  
    start() {
      player = new Player();
      playerCount = player.getCount();
    
      form = new Form();
      form.display()
      
      miner1 = createSprite(width / 2 - 50, height - 100);
      miner1.addImage("gg", miner1Img);
      miner1.scale = 0.7;
  
      miner1.addImage("blast",blastImg);
  
      miner2 = createSprite(width / 2 + 100, height - 100);
      miner2.addImage("car2", miner2Img);
      miner2.scale = 0.7;
  
      miner2.addImage("blast", blastImg);
  
      miners= [miner1, miner2];
  
      gold = new Group();
      diamond = new Group();
  
      bomb = new Group();
  
      var bombPositions = [
        { x: width / 2 + 250, y: height - 800, image: bomb1 }
        
      ];
  
      // Adding gold sprite in the game
      this.addSprites(gold,10, goldImg, 0.02);
  
      // Adding coin sprite in the game
      this.addSprites(diamond, 10, diamondImg, 0.09);
  
      //Adding obstacles sprite in the game
      this.addSprites(
        bomb,
       bombPositions.length,
        bombImg,
        0.04,
        bombPositions
      );
    }
  
    addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
      for (var i = 0; i < numberOfSprites; i++) {
        var x, y;
  
        //C41 //SA
        if (positions.length > 0) {
          x = positions[i].x;
          y = positions[i].y;
          spriteImage = positions[i].Image;
        } else {
          x = random(width / 2 + 150, width / 2 - 150);
          y = random(-height * 4.5, height - 400);
        }
         var sprite= createSprite(x, y);
        sprite.addAnimation("sprite", spriteImage);
  
        sprite.scale = scale;
        spriteGroup.add(sprite);
      }
    }

    
  
    handleElements() {
      form.hide();
      form.titleImg.position(40, 50);
      form.titleImg.class("gameTitleAfterEffect");
  
      //C39
     this.resetTitle.html("Reset Game");
      this.resetTitle.class("resetText");
     this.resetTitle.position(width / 2 + 200, 40);
  
      this.resetButton.class("resetButton");
      this.resetButton.position(width / 2 + 230, 100);
  
      this.leadeboardTitle.html("Leaderboard");
      this.leadeboardTitle.class("resetText");
      this.leadeboardTitle.position(width / 3 - 60, 40);
  
      this.leader1.class("leadersText");
      this.leader1.position(width / 3 - 50, 80);
  
      this.leader2.class("leadersText");
      this.leader2.position(width / 3 - 50, 130);
    }
  
    play() {
      this.handleElements();
      this.handleResetButton();
  
      Player.getPlayersInfo();
      player.getminersAtEnd();
  
      if (allPlayers !== undefined) {
        //image(track, 0, -height * 5, width, height * 6);
  
        this.showGoldBar();
        this.showDiamondBar();
        this.showLeaderboard();
  
        //index of the array
        var index = 0;
        for (var plr in allPlayers) {
          //add 1 to the index for every loop
          index = index + 1;
  
          //use data form the database to display the miners in x and y direction
          var x = allPlayers[plr].positionX;
          var y = height - allPlayers[plr].positionY;
  
          var currentlife = allPlayers[plr].life;
  
          if (currentlife <= 0) {
            miners[index-1].changeImage("blast");
            miners[index-1].scale = 0.3;
          }
          
         
         miners[index - 1].position.x = x;
         miners[index - 1].position.y = y;
          
  
          if (index === player.index) {
            stroke(10);
            fill("red");
            ellipse(x, y, 60, 60);
  
            this.handleGold(index);
            this.handleDiamond(index);
            this.handleCarACollisionWithMinerB(index);
            this.handleObstacleCollision(index);
  
            if (player.life <= 0) {
              this.blast = true;
              this.playerMoving = false;
            }
  
            // Changing camera position in y direction
            camera.position.y = miners[index - 1].position.y;
          }
        }
  
        if (this.playerMoving) {
          player.positionY -= 5;
          player.update();
        }
  
        // handling keyboard events
        this.handlePlayerControls();
  
        // Finshing Line
        const finshLine = height*6 -height*12 +100
  
        if (player.positionY < finshLine) {
          gameState = 2;
          player.rank += 1;
          Player.updateminersAtEnd(player.rank);
          player.update();
          this.showRank();
        }
  
        drawSprites();
      }
    }
  
    handleResetButton() {
      this.resetButton.mousePressed(() => {
        database.ref("/").set({
          playerCount: 0,
          gameState: 0,
          players: {},
          carsAtEnd: 0
        });
        window.location.reload();
      });
    }
  
    showDiamondBar() {
      push();
      image(diamondImg, width / 2 - 130, height - player.positionY - 400, 20, 20);
      fill("white");
      rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
      fill("#f50057");
      rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
      noStroke();
      pop();
    }
  
    showGoldBar() {
      push();
      image(goldImg, width / 2 - 130, height - player.positionY - 350, 20, 20);
      fill("white");
      rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
      fill("#ffc400");
      rect(width / 2 - 100, height - player.positionY - 350, player.gold, 20);
      noStroke();
      pop();
    }
  
    showLeaderboard() {
      var leader1, leader2;
      var players = Object.values(allPlayers);
      if (
        (players[0].rank === 0 && players[1].rank === 0) ||
        players[0].rank === 1
      ) {
        // &emsp;    This tag is used for displaying four spaces.
        leader1 =
          players[0].rank +
          "&emsp;" +
          players[0].name +
          "&emsp;" +
          players[0].score;
  
        leader2 =
          players[1].rank +
          "&emsp;" +
          players[1].name +
          "&emsp;" +
          players[1].score;
      }
  
      if (players[1].rank === 1) {
        leader1 =
          players[1].rank +
          "&emsp;" +
          players[1].name +
          "&emsp;" +
          players[1].score;
  
        leader2 =
          players[0].rank +
          "&emsp;" +
          players[0].name +
          "&emsp;" +
          players[0].score;
      }
  
      this.leader1.html(leader1);
      this.leader2.html(leader2);
    }
  
    handlePlayerControls() {
      if (!this.blast) {
        if (keyIsDown(DOWN_ARROW)) {
          this.playerMoving = true;
          player.positionY -= 10;
          player.update();
        }
        
  
        if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
          this.leftKeyActive = true;
          player.positionX -= 5;
          player.update();
        }
  
        if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
          this.leftKeyActive = false;
          player.positionX += 5;
          player.update();
        }
      }
    }
  
    handleGold(index) {
      // Adding gold
      miners[index - 1].overlap(gold, function(collector, collected) {
        player.gold += 2;
        //collected is the sprite in the group collectibles that triggered
        //the event
        player.gold +=5
        collected.remove();
      });
  
      // Reducing Player car gold
      //if (player.gold > 0 && this.playerMoving) {
      //  player.gold -= 0.3;
     // }
  
      if (player.gold >= 10 && player.score>=15) {
        gameState = 2;
        this.gameOver();
      }
    }
  
    handleDiamond(index) {
        miners[index - 1].overlap(diamond, function(collector, collected) {
        player.score += 5;
        player.update();
        //collected is the sprite in the group collectibles that triggered
        //the event
        collected.remove();
      });
    }
  
    handleObstacleCollision(index) {
      if (miners[index - 1].collide(obstacles)) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }
  
        //Reducing Player Life
       // if (player.life > 0) {
       //   player.life -= 185 / 4;
       // }
  
        player.update();
      }
    }
  
    handleCarACollisionWithMinerB(index) {
      if (index === 1) {
        if (miners[index - 1].collide(miners[1])) {
          if (this.leftKeyActive) {
            player.positionX += 100;
          } else {
            player.positionX -= 100;
          }
  
          //Reducing Player Life
         // if (player.life > 0) {
         //   player.life -= 185 / 4;
         // }
  
          player.update();
        }
      }
      if (index === 2) {
        if (miners[index - 1].collide(miners[0])) {
          if (this.leftKeyActive) {
            player.positionX += 100;
          } else {
            player.positionX -= 100;
          }
  
          //Reducing Player Life
         // if (player.life > 0) {
         //   player.life -= 185 / 4;
         // }
  
          player.update();
        }
      }
    }
  
    showRank() {
      swal({
        title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
        text: "You minned the gold successfully",
        imageUrl:
          "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        imageSize: "100x100",
        confirmButtonText: "Ok"
      });
    }
  
    gameOver() {
      swal({
        title: `Game Over`,
        text: "Oops you were not able to mine..!!!",
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
        imageSize: "100x100",
        confirmButtonText: "Thanks For Playing"
      });
    }
  
    end() {
      console.log("Game Over");
    }
  }
  