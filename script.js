const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "black",
  "fuchsia",
  "lime",
  "navy",
  "teal"];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array,numCards) {
  array.length = numCards/2;
  array = array.concat(array);
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let numCards = 10;
let shuffledColors = shuffle(COLORS,numCards);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray,numCards) {
  for(let col=0; col<colorArray.length; col++){
    if(col == numCards){
      break;
    }

    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(colorArray[col]);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

let cardsMatched = 0;
let cardsJustRevealed = [];
let guessCount = 0;

let bestScoreDiv = document.getElementById('bestscore');
let bestscore = parseInt(localStorage.getItem("bestscore"));
if(!bestscore){
  bestscore = 999999;
}
else{
  bestScoreDiv = document.createElement('div');
  bestScoreDiv.setAttribute('id','bestscore');
  document.querySelector('body').append(bestScoreDiv);
  bestScoreDiv.innerText = `Best Score: ${bestscore}`;
}


// TODO: Implement this function!
function handleCardClick(event) {

  if(cardsJustRevealed.length >= 2){ return; }

  if(cardsJustRevealed.length < 2){
    let selectedCardElement = event.target;
    let thisCardColorName = selectedCardElement.classList.value;

    if(thisCardColorName.indexOf("selected") == -1){
      selectedCardElement.classList.add("selected");
      selectedCardElement.style.backgroundColor = thisCardColorName;
      cardsJustRevealed.push(selectedCardElement);
    }

    if(cardsJustRevealed.length == 2){
      guessCount++;
      displayGuessCount();
      let isMatch = cardsJustRevealed[0].classList.value == cardsJustRevealed[1].classList.value;
      setTimeout(resetCardsJustRevealed,1000,isMatch);

      if(isMatch){
        cardsMatched += 2;
        if(cardsMatched == shuffledColors.length){
          endGame();
        }
      }
    }
  }
}


function resetCardsJustRevealed(isMatch){
  if(!isMatch){
    for(let cjr=0; cjr<cardsJustRevealed.length; cjr++){
      cardsJustRevealed[cjr].style.backgroundColor = "white";
      cardsJustRevealed[cjr].classList.remove("selected");
    }
  }
  cardsJustRevealed = [];
}

let guessCountDiv = document.querySelector('#guesscounter');

function displayGuessCount(){
  if(!guessCountDiv){
    guessCountDiv = document.createElement('div');
    guessCountDiv.setAttribute("id","guesscounter");
  }
  guessCountDiv.innerText = `Guesses: ${guessCount}`;
  document.querySelector('body').append(guessCountDiv);
}


function endGame(){
  let resetButton = document.getElementById('reset');
  if(!resetButton){  //first time restarting game
    resetButton = document.createElement('button');
    resetButton.innerText = "Restart";
    resetButton.addEventListener('click',function (){
      resetButton.classList.add("hide");
      gameContainer.innerHTML = "";
      guessCountDiv.innerText = "";
      cardsMatched = 0;
      shuffledColors = shuffle(COLORS,numCards);
      createDivsForColors(shuffledColors,numCards);
    });
    document.querySelector('body').append(resetButton);
  }
  resetButton.classList.remove("hide");

  bestScoreDiv = document.getElementById('bestscore');
  if(!bestScoreDiv){
    bestScoreDiv = document.createElement('div');
    bestScoreDiv.setAttribute('id','bestscore');
    document.querySelector('body').append(bestScoreDiv);
  }
  if(guessCount < bestscore){
    bestscore = guessCount;
  }
  bestScoreDiv.innerText = `Best Score: ${bestscore}`;
  localStorage.clear();
  localStorage.setItem("bestscore",bestscore.toString());
  guessCount = 0;
}

// when the DOM loads
let startButton = document.createElement('button');
startButton.innerText = "Start";
startButton.addEventListener('click',function (){
  numCards = parseInt(document.querySelector('input').value);
  shuffledColors = shuffle(COLORS,numCards);
  createDivsForColors(shuffledColors,numCards);
  startButton.classList.add("hide");
  document.querySelector('form').classList.add("hide");
});
document.querySelector('body').append(startButton);