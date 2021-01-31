//Create variables here
var dog,dogImg,happyDog,database,foodS,foodStock;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
var bedroomImg,gardenImg,washroomImg;


function preload()
{
  //load images here
  dogImg=loadImage("images/dogImg.png")
  happyDog=loadImage("images/dogImg1.png")
  bedroomImg=loadImage("images/Bed Room.png")
  gardenImg=loadImage("images/Garden.png")
  washroomImg=loadImage("images/Wash room.png")

}

function setup() {
  database=firebase.database();
  createCanvas(1000,500);
  foodObj = new Food();
  dog=createSprite(800,220,150,150)
dog.addImage(dogImg)
dog.scale=0.15
foodStock=database.ref("Food")
foodStock.on("value",readStock)
feed=createButton("Feed The Dog")
feed.position(700,95)
feed.mousePressed(feedDog)
addFood=createButton("Add Food")
addFood.position(800,95)
addFood.mousePressed(addFoods)
fedTime=database.ref("FeedTime")
fedTime.on("value",function(data){
lastFed=data.val();


})
readState=database.ref("gameState")
readState.on("value",function(data){
gameState=data.val();
})
}


function draw() {  
background("green")


fill(255)
text(20)
currentTime=hour();
if(currentTime==(lastFed+1)){
update("playing")
foodObj.garden();
}
else if(currentTime==(lastFed+2)){
update("sleeping")
foodObj.bedroom();
}
else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
  update("bathing")
foodObj.washroom();  
}
else{
update("hungry")
foodObj.display();
}
if(gameState!="hungry"){
feed.hide()
addFood.hide()
dog.remove();
}
else{
  feed.show()
  addFood.show();
  dog.addImage(dogImg)
}
if(lastFed>=12){
  text("last feed:"+lastFed%12+"PM",350,30)
}else if(lastFed===0){
text("last feed : 12AM",350,30)
}else{
text("last feed:"+lastFed+"AM",350,30)
}

foodObj.display();
      drawSprites(); 
}
function update(state){
database.ref('/').update({
gameState:state
})
}

 
  

function readStock(data){
  foodS=data.val();
  console.log(foodS)
  foodObj.updateFoodStock(foodS)
}

function feedDog(){
  dog.addImage(happyDog)
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
foodS++;
console.log(foodS)
database.ref('/').update({
  Food:foodS
})
}





