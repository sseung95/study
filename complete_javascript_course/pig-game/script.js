'use strict';

class Player {
  constructor(playerNum) {
    this.total = 0;
    this.curr = 0;
    this.totalBox = document.querySelector(`#score--${playerNum - 1}`);
    this.currBox = document.querySelector(`#current--${playerNum - 1}`);
    this.playerBox = document.querySelector(`.player--${playerNum - 1}`);
  }

  // 점수 더하기
  addTotal(score) {
    this.total += score;
  }

  addCurr(score) {
    this.curr += score;
  }

  // 클래스 추가 및 삭제
  addActiveClass() {
    this.playerBox.classList.add('player--active');
  }

  removeActiveClass() {
    this.playerBox.classList.remove('player--active');
  }

  addWinnerClass() {
    this.playerBox.classList.add('player--winner');
  }

  removeWinnerClass() {
    this.playerBox.classList.remove('player--winner');
  }

  // 점수 입력
  displayTotal() {
    this.totalBox.textContent = this.total;
  }

  displayCurr() {
    this.currBox.textContent = this.curr;
  }

  // 초기화
  resetTotal() {
    this.total = 0;
    this.totalBox.textContent = 0;
  }

  resetCurr() {
    this.curr = 0;
    this.currBox.textContent = 0;
  }

  resetAll() {
    this.total = 0;
    this.curr = 0;
    this.resetTotal();
    this.resetCurr();
    this.removeActiveClass();
    this.removeWinnerClass();
  }
}

// 변수
const rollBtn = document.querySelector('.btn--roll');
const holdBtn = document.querySelector('.btn--hold');
const newGameBtn = document.querySelector('.btn--new');
const dice = document.querySelector('img.dice');

const player1 = new Player(1);
const player2 = new Player(2);

let isEnd = false;
let currPlayer = player1;
let readyPlayer = player2;

// 함수
const switchPlayer = function () {
  const tmpPlayer = currPlayer;
  currPlayer = readyPlayer;
  readyPlayer = tmpPlayer;

  currPlayer.addActiveClass();
  readyPlayer.removeActiveClass();
};

const changeDiceImg = function (random) {
  dice.classList.remove('hidden');
  dice.src = `dice-${random}.png`;
};

const rollDice = function () {
  if (isEnd) {
    return;
  }

  const random = Math.trunc(Math.random() * 6) + 1;
  changeDiceImg(random);

  if (random !== 1) {
    currPlayer.addCurr(random);
    currPlayer.displayCurr();
  } else {
    currPlayer.resetCurr();
    switchPlayer();
  }
};

const hold = function () {
  if (isEnd) {
    return;
  }

  currPlayer.addTotal(currPlayer.curr);
  currPlayer.displayTotal();
  currPlayer.resetCurr();

  if (currPlayer.total < 100) {
    switchPlayer();
  } else {
    currPlayer.removeActiveClass();
    currPlayer.addWinnerClass();
    isEnd = true;
  }
};

const resetGame = function () {
  dice.classList.add('hidden');

  isEnd = false;

  player1.resetAll();
  player2.resetAll();

  player1.addActiveClass();
};

// 이벤트
rollBtn.addEventListener('click', rollDice);
holdBtn.addEventListener('click', hold);
newGameBtn.addEventListener('click', resetGame);
