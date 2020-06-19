var trex,trexRunning,trexCollided,ground,invGround,cloud,obs1,obs2,obs3,obs4,obs5,obs6,gameOver,restart,count = 0,jump,die,checkPoint,gameState = "play",high = 0;
function preload()
{
trexRunning = loadAnimation("trex3.png","trex1.png","trex4.png");
trexCollided = loadAnimation("trex_collided.png");  
groundimage = loadImage("ground2.png");  
cloudimage = loadImage("cloud.png");
obs1image = loadImage("obstacle1.png");
obs2image = loadImage("obstacle2.png");  
obs3image = loadImage("obstacle3.png");  
obs4image = loadImage("obstacle4.png");  
obs5image = loadImage("obstacle5.png");  
obs6image = loadImage("obstacle6.png");
gameOverimage = loadImage("gameOver.png"); 
restartimage = loadImage("restart.png");
jump = loadSound("jump.mp3");
die = loadSound("die.mp3");
checkPoint = loadSound("checkPoint.mp3");  
}
function setup()
{
  createCanvas(600,200);
  trex = createSprite(50,178,10,10);
  trex.addAnimation("trexRunning",trexRunning);
  trex.addAnimation("trexCollided",trexCollided);
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,40);
  ground = createSprite(200,181,400,20);
  ground.addImage("ground",groundimage);
  ground.x = ground.width/2;
  invGround = createSprite(200,186,400,5);
  invGround.visible = false; 
  cloudsGroup = createGroup();
  obstaclesGroup = createGroup();
  gameOver = createSprite(280,100,20,20);
  gameOver.addImage("gameOver",gameOverimage);
  gameOver.scale = 0.45;
  gameOver.visible = false;
  restart = createSprite(280,130,20,20);
  restart.addImage("restart",restartimage);
  restart.scale = 0.5;
  restart.visible = false;
}
function draw()
{
  background("white");
  text("Score: "+count,500,10);
  text("HI: "+max(high),400,10);
  
  edges = createEdgeSprites();
  
  if(gameState == "play")
  {
    if(keyDown("space") && trex.y >= 160)
    {
      trex.velocityY = -12;
      jump.play(); 
    }
    if(count > 0 && count % 100 == 0)
    {
      checkPoint.play();
    }
    if(ground.x < 0)
    {
      ground.x = ground.width/2;
    }
    ground.velocityX = -(6+3*count/100);
    count = count + Math.round(getFrameRate()/55);
    trex.velocityY = trex.velocityY + 0.85;
    spawnClouds();
    createObstacles();
    if(obstaclesGroup.isTouching(trex))
    {
      die.play();
      gameState = "end";
    }
  }
  else if(gameState == "end")
  {
    trex.velocityY = 0;
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    gameOver.visible = true;
    restart.visible = true;
    trex.changeAnimation("trexCollided",trexCollided);
    high = max(count);
  }
  if(mousePressedOver(restart))
  {
    gameState = "play";
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    gameOver.visible = false;
    restart.visible = false;
    count = 0;
    trex.changeAnimation("trexRunning",trexRunning);
  }
  trex.collide(invGround);
  drawSprites();
}

function spawnClouds()
{
  if(World.frameCount % 60 == 0)
  {
    var cloud = createSprite(600,random(80,120),40,10);
    cloud.addImage("cloud1",cloudimage);
    cloud.scale = 0.8;
    cloud.velocityX = -5;
    cloud.lifetime = 146
    trex.depth = cloud.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
}

function createObstacles()
{
  if(World.frameCount % 60 == 0)
  {
    var obstacle = createSprite(600,170,20,50);
    obstacle.velocityX = -(6+3*count/100);  
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obs1image);
      break;
      case 2: obstacle.addImage(obs2image);
      break; 
      case 3: obstacle.addImage(obs3image);
      break; 
      case 4: obstacle.addImage(obs4image);
      break; 
      case 5: obstacle.addImage(obs5image);
      break; 
      case 6: obstacle.addImage(obs6image);
      break; 
      default: 
      break;
    }
    obstacle.scale = 0.5;
    obstaclesGroup.add(obstacle);
    
  }
}