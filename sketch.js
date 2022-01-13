var gold,diamond;
var miner1,miner2,form,player,allPlayers;
var scenery1,scenery,trophy,soil,conffety,bomb;
var gpickaxe,dpickaxe,gdpickaxe,wpickaxe;
var gameState,datatbase,canvas,bomb1;
var bombBlast,minning,clapping,playerCount,obstacles,bombImg;
var miner1Img,miner2Img,goldImg,diamondImg,scenery1Img,trophyImg,conffetyImg,bombImg,blastImg;
var miners = [];

function preload(){
  miner1Img=loadImage("./11.png")
  //miner1Img=loadAnimation("./11.png","./Pictures/Animation/12.png","./Pictures/Animation/13.png","./Pictures/Animation/14.png","./Pictures/Animation/15.png","./Pictures/Animation/16.png","./Pictures/Animation/17.png","./Pictures/Animation/18.png","./Pictures/Animation/19.png","./Pictures/Animation/20.png","./Pictures/Animation/21.png","./Pictures/Animation/22.png","./Pictures/Animation/23.png","./Pictures/Animation/24.png","./Pictures/Animation/25.png","./Pictures/Animation/26.png","./Pictures/Animation/27.png","./Pictures/Animation/28.png")
    miner2Img=loadImage("./5.jpg")
    goldImg=loadImage("./gold.jpg");
    diamondImg=loadImage("./diamond.jpg");
    scenery1Img=loadImage("./scenery.jpg");
    trophyImg=loadImage("./trophy.png");
    //soilImg=loadImage("./Soil.jpg");
    conffetyImg=loadImage("./animation-confetti-png-favpng-gpgXQa2BeZEZsbX9U9LFkgRp6-removebg-preview.png");
    //gpickaxe=loadImage("./Pictures/Golden_Pickaxe.png");
    //dpickaxe=loadImage("./Pictures/Diamond_Pickaxe.png");
    //gdpickaxe=loadImage("./Pictures/[removal.ai]_tmp-61c00d3fa21af.png");
    //wpickaxe=loadImage("./Pictures/Wooden_Pickaxe.png");
    bombImg=loadImage("./bomb-removebg-preview.png")
    //bombBlast=loadSound("./bomb blast.mp3")
    //minning=loadSound("./Minning Sound.mp3")
    //clapping=loadSound("./Clapping sound.mp3")
    blastImg=loadImage("./blast.png")

}

function setup(){
    canvas= createCanvas(windowWidth, windowHeight);
    database = firebase.database();
   // minner= createSprite(50,160,20,50);
   // minner.addAnimation("minning",miner)
    //scenery=createSprite(300,300,800,800)
    //scenery.addImage("background",scenery1)
    
      game = new Game();
      game.getState();
      game.start();

}

function draw(){
    background(scenery1Img)
    if (playerCount === 2||playerCount > 2) {
        game.update(1);
      }
    
      if (gameState === 1) {
        game.play();
      }
    
      if (gameState === 2) {
        game.showLeaderboard();
        game.end();
      }
      
    
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}