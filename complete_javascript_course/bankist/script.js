'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// ------------------
// VARIABLE
// ------------------
let currentUser;
let sorted = false;

// ------------------
// fUNCTION
// ------------------

/* 현재 날짜 구하기 */
//26/01/2022, 13:19
const getToday = function () {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, 0);
  const date = today.getDate().toString().padStart(2, 0);
  const hours = today.getHours().toString().padStart(2, 0);
  const minutes = today.getMinutes().toString().padStart(2, 0);

  return `${date}/${month}/${year}, ${hours}:${minutes}`;
};

/* 현재 시간 화면 표시 */
const displayTime = function () {
  labelDate.textContent = getToday();
};

setInterval(displayTime, 1000);

const autoLogout = function () {
  let time = 600; // 10분
  let min = 0;
  let sec = 0;

  const timeout = setInterval(function () {
    min = Math.trunc((time % 3600) / 60);
    sec = Math.trunc(time % 60);
    labelTimer.textContent = `${min.toString().padStart(2, 0)}:${sec
      .toString()
      .padStart(2, 0)}`;
    time--;

    if (time < 0) {
      clearInterval(timeout);
      containerApp.style = 'opacity: 0;';
    }
  }, 1000);
};

/* 이름 약어로 변환
  ex) Sarah Smith -> ss
*/
const makeAcronyms = function (word) {
  const words = word.toLowerCase().split(' ');
  let acronyms = '';
  words.forEach((name) => (acronyms += name.at(0)));
  return acronyms;
};

/* 인사말 변경 */
const changeWelcome = function () {
  labelWelcome.textContent = `Hello, ${currentUser.owner.split(' ').at(0)}`;
};

/* 로그인 */
const login = function (event) {
  event.preventDefault();

  autoLogout();

  const name = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);

  accounts.forEach((account) => {
    let shortName = makeAcronyms(account.owner);

    if (shortName === name && account.pin === pin) {
      currentUser = account;
      containerApp.style = 'opacity: 100;';

      changeWelcome();
    }
  });
};

/* 모든 거래 목록 화면에서 삭제 */
const removeMovements = function () {
  while (containerMovements.hasChildNodes()) {
    containerMovements.removeChild(containerMovements.firstChild);
  }
};

/* 통화 계산 */
const clacCurrency = function (value) {
  let locales;
  let currency;

  if (makeAcronyms(currentUser.owner) === 'js') {
    locales = 'de-DE';
    currency = 'EUR';
  } else {
    locales = 'en-US';
    currency = 'USD';
  }

  return new Intl.NumberFormat(locales, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const makeMovHtml = function (type, date, currency) {
  return `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} deposit</div>
    <div class="movements__date">${date}</div>
    <div class="movements__value">${currency}</div>
    </div>`;
};

/* 거래 목록 화면 표시 */
const displayMovements = function (movements, sorted = false) {
  removeMovements();

  const movs = sorted ? movements.slice().sort((a, b) => a - b) : movements;

  // movement 목록 추가
  movs.forEach((movement, i) => {
    appendMovement(movement, i, '2021/02/21');
  });
};

const appendMovement = function (mov, i, date) {
  const currency = clacCurrency(mov);

  const type = mov > 0 ? 'deposit' : 'withdrawal';

  const html = `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} deposit</div>
  <div class="movements__date">${date}</div>
  <div class="movements__value">${currency}</div>
  </div>`;

  containerMovements.insertAdjacentHTML('afterbegin', html);
};

/* 총 금액 화면 표시 */
const clacDisplayBalance = function () {
  const balance = currentUser.movements.reduce((prev, curr) => prev + curr, 0);
  labelBalance.textContent = clacCurrency(balance);
};

/* 요약 금액 화면 표시 */
const calcDisplaySummary = function () {
  const sumIn = currentUser.movements
    .filter((mov) => mov > 0)
    .reduce((prev, curr) => prev + curr, 0);
  const sumOut = currentUser.movements
    .filter((mov) => mov < 0)
    .reduce((prev, curr) => prev + curr, 0);
  labelSumIn.textContent = clacCurrency(sumIn);
  labelSumOut.textContent = clacCurrency(Math.abs(sumOut));
};

/* 총 금액, 요약 금액 화면 표시 */
const displayAll = function () {
  displayMovements(currentUser.movements);
  clacDisplayBalance();
  calcDisplaySummary();
};

/* 송금 기능 */
const transfer = function (event) {
  event.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const to = accounts.find(
    (account) => inputTransferTo.value === makeAcronyms(account.owner)
  );

  if (to && amount) {
    to.movements.push(amount);
    currentUser.movements.push(-amount);
    displayAll();
  }

  inputTransferTo.value = '';
  inputTransferAmount.value = '';
};

/* 대출 기능 */
const loan = function (evnet) {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0) {
    currentUser.movements.push(amount);
    displayAll();
  }

  inputLoanAmount.value = '';
};

/* 로그아웃 */
const logout = function (event) {
  event.preventDefault();

  const name = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  if (name === makeAcronyms(currentUser.owner) && pin === currentUser.pin) {
    containerApp.style = 'opacity: 0;';
  }

  inputCloseUsername.value = '';
  inputClosePin.value = '';
};

// ------------------
// EVENT
// ------------------

/* 로그인 버튼 클릭 */
btnLogin.addEventListener('click', function (event) {
  login(event);
  displayAll();
});

/* 정렬 버튼 클릭 */
btnSort.addEventListener('click', () => {
  displayMovements(currentUser.movements, !sorted);
  sorted = !sorted;
});

/* 송금 버튼 클릭 */
btnTransfer.addEventListener('click', transfer);

/* 대출 버튼 클릭 */
btnLoan.addEventListener('click', loan);

/* 로그아웃 버튼 클릭 */
btnClose.addEventListener('click', logout);
