'use strict';

const guess = document.querySelector('.guess');

const againBtn = document.querySelector('.again');
const checkBtn = document.querySelector('.check');

const INITIAL_MSG = 'Start guessing...';
const FINAL_MSG = 'Correct number!';
const HIGH_MSG = 'Too high...';
const LOW_MSG = 'Too low...';

let score = 20;
let highscore = 0;

const createRandomNum = function () {
  return Math.floor(Math.random() * 20) + 1;
};

const displayText = function (selector, message) {
  document.querySelector(selector).textContent = message;
};

const checkNumber = function () {
  const guessNum = Number(guess.value);

  // 숫자 안적었을때
  if (!guessNum) {
    displayText('.message', 'No number!');

    // 1 ~ 20 사이 숫자가 아닐 때
  } else if (guessNum < 1 || guessNum > 20) {
    displayText('.message', 'Between 1 and 20!');

    // 정답아닐 때
  } else if (guessNum !== randomNum) {
    // 점수가 1 초과일 때
    if (score > 1) {
      displayText('.message', guessNum > randomNum ? HIGH_MSG : LOW_MSG);
      score--;
      displayText('.score', score);
    } else {
      displayText('.message', 'You lose the game!');
      displayText('.score', 0);
    }

    // 정답일 때
  } else if (guessNum === randomNum) {
    displayText('.message', FINAL_MSG);
    displayText('.number', randomNum);

    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';

    if (score > highscore) {
      displayText('.highscore', score);
    }
  }
};

const resetGame = function () {
  score = 20;
  randomNum = createRandomNum();

  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';

  displayText('.number', '?');
  displayText('.message', INITIAL_MSG);
  displayText('.score', 20);
  guess.value = '';
};

let randomNum = createRandomNum();

checkBtn.addEventListener('click', checkNumber);
againBtn.addEventListener('click', resetGame);
