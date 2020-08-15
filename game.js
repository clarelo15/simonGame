
var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var isStart = false;
var level = 0;
var score = 0;
var highScore = 0;

//when a keyboard key has been pressed, call nextSequence() which only happens for the first press
$(document).on("keydown", function(){
  score = 0;
  $(".score").text("score: " + score);
  if(!isStart){
    nextSequence();
  }
});

$(".btn").on("click", function(){
  //use the keyword this to refer to the button object that triggered the click
  var userChosenColor = $(this).attr("id");
  userClickedPattern.push(userChosenColor);

  //when a user clicks on a button, the corresponding sound should be played
  playSound(userChosenColor);
  animatePress(userChosenColor);

  //Call checkAnswer() after a user has clicked their answer
  checkAnswer(userClickedPattern.length - 1);

  // console.log(userClickedPattern);
});

function nextSequence(){
  //Once nextSequence() is triggered, reset the userClickedPattern to an empty array ready for the next level
  userClickedPattern = [];

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColors[randomNumber];

  isStart = true;

  gamePattern.push(randomChosenColor);

  setTimeout(function() {
    displayWholeSequence(0, gamePattern);
  }, 500);

  // $("#" + randomChosenColor).fadeOut(100).fadeIn(100);
  // playSound(randomChosenColor);

  level++;
  if(level > 0){
    $("#level-title").text("Level " + level);
  }
}

function displayWholeSequence(index, array) {
  if(index >= array.length)
    return;

  $("#" + gamePattern[index]).fadeOut(100).fadeIn(100);
  playSound(gamePattern[index]);
  index ++;
  setTimeout(displayWholeSequence.bind({}, index, array), 500);
}

function playSound(name){
  var sound = new Audio("sounds/" + name +".mp3");
  sound.play();
}

function animatePress(currentColor){
  // it will add a box shadow and changes the background colour to grey.
  $("#" + currentColor).addClass("pressed");

  //remove the pressed class after a 100 milliseconds.
  setTimeout(function(){
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function checkAnswer(currentLevel){
  //check if the most recent user answer is the same as the game pattern
  if(gamePattern[currentLevel] === userClickedPattern[currentLevel]){
    // console.log("success");
    //check if they have finished their sequence. If yes, then go to the next sequence
    if(userClickedPattern.length === gamePattern.length){
      score++;
      $(".score").text("score: " + score);
      setTimeout(function(){
        nextSequence();
      }, 1000);
    }
  }else{
    //a flash effect
    $("body").addClass("game-over");
    playSound("wrong");

    $("#level-title").html("Game Over<br> Press Any Key to Restart");

    setTimeout(function(){
      $("body").removeClass("game-over");
    }, 200);
    // console.log("wrong");

    if(highScore < score){
      highScore = score;
      $(".highScore").text("high score: " + highScore);
    }

    startOver();
  }
}

function startOver(){
  level = 0;
  isStart = false;
  gamePattern = [];

}
