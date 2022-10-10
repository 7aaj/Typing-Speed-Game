// Array Of Words
const words = [
  "Hello",
  "Programming",
  "Code",
  "Javascript",
  "Town",
  "Country",
  "Testing",
  "Youtube",
  "Linkedin",
  "Twitter",
  "Github",
  "Leetcode",
  "Internet",
  "Python",
  "Scala",
  "Destructuring",
  "Paradigm",
  "Styling",
  "Cascade",
  "Documentation",
  "Coding",
  "Funny",
  "Working",
  "Dependencies",
  "Task",
  "Runner",
  "Roles",
  "Test",
  "Rust",
  "Playing",
];

// catch selectors
const difficulty = document.querySelectorAll(".levels li");
const highScore = document.querySelector(".high-score span");
const startButton = document.querySelector(".start");
const lvlNameSpan = document.querySelector(".message .lvl");
const secondsSpan = document.querySelector(".message .seconds");
const theWord = document.querySelector(".the-word");
const upcomingWords = document.querySelector(".upcoming-words");
const input = document.querySelector(".input");
const timeLeftSpan = document.querySelector(".time span");
const scoreGot = document.querySelector(".score .got");
const scoreTotal = document.querySelector(".score .total");
const finishMessage = document.querySelector(".finish");
const playAgainButton = document.querySelector("play-again");

// setting levels

const lvls = {
  Easy: { seconds: 4, array: words.filter((el) => el.length < 6) },
  Normal: { seconds: 3, array: words.filter((el) => el.length < 8) },
  Hard: { seconds: 3, array: words },
};

// default level

let defaultLevelName = "Easy"; //chane level from here

let defaultLevelSeconds = lvls[defaultLevelName].seconds;

// setting level name + seconds + score
lvlNameSpan.innerHTML = defaultLevelName;
secondsSpan.innerHTML = defaultLevelSeconds;
timeLeftSpan.innerHTML = defaultLevelSeconds;
scoreTotal.innerHTML = lvls[defaultLevelName].array.length;
//level on choose
let choosenDifficulty;
let localStorageLevel = localStorage.getItem("level");
if (localStorageLevel !== null) {
  choosenDifficulty = localStorageLevel;
  lvlNameSpan.innerHTML = choosenDifficulty;
  secondsSpan.innerHTML = lvls[choosenDifficulty].seconds;
  timeLeftSpan.innerHTML = lvls[choosenDifficulty].seconds;
  scoreTotal.innerHTML = lvls[choosenDifficulty].array.length;
  difficulty.forEach((li) => li.classList.remove("active"));
  document.querySelector(`[data-level="${choosenDifficulty}"]`).classList.add("active");
  document.documentElement.style.setProperty("--level", localStorage.getItem("color"));
}
if (localStorage.getItem("high-score") != null) {
  highScore.innerHTML = localStorage.getItem("high-score");
}
difficulty.forEach((li) => {
  li.addEventListener("click", (e) => {
    choosenDifficulty = e.target.dataset.level;
    lvlNameSpan.innerHTML = choosenDifficulty;
    secondsSpan.innerHTML = lvls[choosenDifficulty].seconds;
    timeLeftSpan.innerHTML = lvls[choosenDifficulty].seconds;
    scoreTotal.innerHTML = lvls[choosenDifficulty].array.length;
    document.documentElement.style.setProperty("--level", e.target.dataset.color);
    difficulty.forEach((li) => li.classList.remove("active"));
    e.target.classList.add("active");
    localStorage.setItem("color", e.target.dataset.color);
    localStorage.setItem("level", e.target.dataset.level);
  });
});

//disable paste event + timer color
input.onpaste = () => false;

//start game
startButton.onclick = function () {
  document.querySelector(".difficulty").remove();
  document.querySelector(".levels").remove();
  this.remove();
  input.focus();
  // generate word function
  generateWords(lvls[choosenDifficulty || defaultLevelName].array);
};

function generateWords(array) {
  // random word
  let randomWord = array[Math.floor(Math.random() * array.length)];
  //get word index
  let wordIndex = array.indexOf(randomWord);
  //remove the word from the array
  array.splice(wordIndex, 1);
  //show the random word
  theWord.innerHTML = randomWord;
  //empty upcoming words
  upcomingWords.innerHTML = "";
  //generate words
  for (word of array) {
    //create div elemts
    let div = document.createElement("div");
    let text = document.createTextNode(word);
    div.appendChild(text);
    upcomingWords.appendChild(div);
  }
  //call play function
  startPlay();
}

function startPlay() {
  let start = setInterval(() => {
    timeLeftSpan.innerHTML--;
    if (timeLeftSpan.innerHTML < 4) timeLeftSpan.style.color = "red";
    if (timeLeftSpan.innerHTML == "0") {
      // stop timer
      clearInterval(start);
      //compare words
      if (theWord.innerHTML.toLowerCase() === input.value.toLowerCase()) {
        // empty input field
        input.value = "";
        //increase score
        scoreGot.innerHTML++;
        if (localStorage.getItem("high-score") < scoreGot.innerHTML) {
          localStorage.setItem("high-score", scoreGot.innerHTML);
          highScore.innerHTML = scoreGot.innerHTML;
        }

        if (lvls[choosenDifficulty || defaultLevelName].array.length > 0) {
          //call generate function
          generateWords(lvls[choosenDifficulty || defaultLevelName].array);
          timeLeftSpan.innerHTML = defaultLevelSeconds;
        } else {
          let span = document.createElement("span");
          span.className = "good";
          let spanText = document.createTextNode("wa7shh!!");
          span.appendChild(spanText);
          finishMessage.appendChild(span);
          //remove upcoming words box
          upcomingWords.remove();
          let playAgainButton = document.createElement("button");
          let playAgainText = document.createTextNode("play again?");
          playAgainButton.className = "play-again";
          playAgainButton.appendChild(playAgainText);
          finishMessage.appendChild(playAgainButton);
          playAgainButton.onclick = () => window.location.reload();
        }
      } else {
        let span = document.createElement("span");
        span.className = "bad";
        let spanText = document.createTextNode("game over");
        span.appendChild(spanText);
        finishMessage.appendChild(span);
        let playAgainButton = document.createElement("button");
        let playAgainText = document.createTextNode("play again?");
        playAgainButton.className = "play-again";
        playAgainButton.appendChild(playAgainText);
        finishMessage.appendChild(playAgainButton);
        playAgainButton.onclick = () => window.location.reload();
      }
    }
  }, 1000);
}
