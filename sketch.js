//Create variables here
var happyDog, dog, foodS, foodStock, database

//proj 2
var fedTime, lastFed;
var feedPetButton, addFoodButton;
var foodObj;

//proj3 
var gameState
var readState

function preload(){ 
  
  dog.loadImage("doglmg.png")
  happyDog.loadImage("doglmg.png")
}
//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(500,500);

  dog=createSprite(250,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  //proj 3 gam3state
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

//proj 2 
foodObj= new Food();
feedPetButton=createButton("Feed Dog");
feedPetButton.position(800,105);
feedPetButton.mousePressed(feedDog);

addFoodButton= createButton("Add Food");
addFoodButton.position(500,105);
addFoodButton.mousePressed(addFoods);

} 

// function to display UI
function draw() {
  background(46,139,87);
 //proj2
  foodObj.display();
  fedTime=database.ref("Feed Time");
  fedTime.on("value",function(data){
    lastFed=data.val();
    fill ("red");
      textSize(18);
      stroke ("blue");
      text ("Last Feed : " + lastFed,300,55);
  });
  
  drawSprites();
  fill(255,255,254);
  stroke("black");
  text("Food remaining : "+foodS,170,200);
  textSize(13);
  text("Note: Press UP_ARROW Key To Feed Drago Milk!",130,10,300,20);
//proj3
 currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}


}




//Function to write values in DB
function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })


}

function feedDog(){
  
  dog.addImage(doglmg1.png);
  foodObj.deductFood();
  foodObj.updateFoodStock(foodObj.foodStock);
  updateFeedTime();
  setTimeout(function(){
    console.log("Hi");
    dog.addImage(doglmg.png);
  },1000);
}
async function updateFeedTime(){
  var response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Kolkata');
  var jsonResponse = await response.json();
  hour = jsonResponse.datetime.slice(11,13);
  if(hour > '12')
  {
    hour = hour % 12;
    fedTime = hour + ' PM'
  }
  else if(hour === '00')
  {
    fedTime = '12 AM';
  }
  else if (hour === '12')
  {
   fedTime = '12 PM';
  }
  else 
  {
   fedTime = hour + ' AM';
  }
  //console.log(getTime);
  database.ref('/').update({
      'FeedTime' : fedTime
    }) 

  }
  //proj3
  function addFoods(){
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
  }
  
  //proj3
  function update(state){
    database.ref('/').update({
      gameState:state
    })
  }

// function setup() {
//   createCanvas(500, 500);
//   dog.createSprite(20,20,10,10);
//   dog.addImage("doglmg.png");
//   firebase=database
//   foodStock=database.ref("Food");
//   foodStock.on("value",readStock);

  
// }


// function draw() {  
//   background(46,139,87);
// //notsure how to write code to feed the dog

// if(keyWentDown(UP_ARROW)){
//   writeStock(foodS);
//   dog.addImage(dogHappy);
// }
//   drawSprites();
//   //need help to add text to print food stock

// }
// function readStock(data){
//   foodS=data.val();
// }
// function writeStock(x){

//   database.ref("/").update({
//     Food:x
//   })
// }

