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

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2022-01-31T14:11:59.604Z',
    '2022-02-01T17:01:17.194Z',
    '2022-02-02T23:36:17.929Z',
    '2022-02-03T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

const formatDate = function (acc, dateObj) {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };

  // const year = dateObj.getFullYear();
  // const month = (dateObj.getMonth() + 1).toString().padStart(2, 0);
  // const date = dateObj.getDate().toString().padStart(2, 0);

  return new Intl.DateTimeFormat(acc.locale, options).format(dateObj);
};

const formatTime = function (dateObj) {
  const hours = dateObj.getHours().toString().padStart(2, 0);
  const minutes = dateObj.getMinutes().toString().padStart(2, 0);

  return `${hours}:${minutes}`;
};

/* 현재 시간 화면 표시 */
const displayTime = function () {
  labelDate.textContent = formatDate(currentUser.locale, new Date());
};

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

const createUserName = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((word) => word.at(0))
      .join('');
  });
};

createUserName(accounts);

/* 이름 약어로 변환
  ex) Sarah Smith -> ss
*/
const makeAcronyms = function (word) {
  return word
    .toLowerCase()
    .split(' ')
    .map((word) => word.at(0))
    .join('');
};

/* 인사말 변경 */
const changeWelcome = function (name) {
  labelWelcome.textContent = `Hello, ${name.split(' ')[0]}`;
};

/* 로그인 */
const login = function (event) {
  event.preventDefault();

  autoLogout();

  const name = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);

  currentUser = accounts.find((acc) => acc.username === name);

  if (currentUser?.pin === pin) {
    containerApp.style = 'opacity: 100;';
    changeWelcome(currentUser.owner);
    updateUI(currentUser);
  }
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputLoginPin.blur(); // 포커스 아웃
};

/* 모든 거래 목록 화면에서 삭제 */
const removeMovements = function () {
  containerMovements.innerHTML = '';
};

/* 통화 계산 */
const clacCurrency = function (acc, value) {
  return new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(value);
};

const convertedDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const passedDay = calcDaysPassed(new Date(), date);

  if (passedDay === 0) {
    return 'TODAY';
  }
  if (passedDay === 1) {
    return 'YESTERDAY';
  }
  if (passedDay <= 7) {
    return `${passedDay} DAYS AGO`;
  }
  return formatDate(currentUser.locale, date);
};

/* 거래 목록 화면 표시 */
const displayMovements = function (acc, sorted = false) {
  removeMovements();

  // sort 함수 사용시 원래 배열 변경되므로
  const sortedMovs = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // movement 목록 추가
  sortedMovs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const currency = clacCurrency(acc, mov);

    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${type}">${
      i + 1
    } deposit</div>
                    <div class="movements__date">${convertedDate(date)}</div>
                    <div class="movements__value">${currency}</div>
                  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/* 총 금액 화면 표시 */
const clacDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((prev, curr) => prev + curr, 0);
  labelBalance.textContent = clacCurrency(acc, acc.balance);
};

/* 요약 금액 화면 표시 */
const calcDisplaySummary = function (acc) {
  const sumIn = acc.movements
    .filter((mov) => mov > 0)
    .reduce((prev, curr) => prev + curr, 0);
  const sumOut = acc.movements
    .filter((mov) => mov < 0)
    .reduce((prev, curr) => prev + curr, 0);
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((prev, curr) => prev + curr, 0);
  labelSumIn.textContent = clacCurrency(acc, sumIn);
  labelSumOut.textContent = clacCurrency(acc, Math.abs(sumOut));
  labelSumInterest.textContent = clacCurrency(acc, interest);
};

const updateUI = function (acc) {
  displayMovements(acc);
  clacDisplayBalance(acc);
  calcDisplaySummary(acc);
};

/* 송금 기능 */
const transfer = function (event) {
  event.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const to = accounts.find((acc) => acc.username === inputTransferTo.value);

  if (
    to &&
    to.username !== currentUser.username &&
    amount > 0 &&
    amount <= currentUser.balance
  ) {
    to.movements.push(amount);
    to.movementsDates.push(new Date().toISOString());
    currentUser.movements.push(-amount);
    currentUser.movementsDates.push(new Date().toISOString());
    updateUI(currentUser);
  }

  inputTransferTo.value = '';
  inputTransferAmount.value = '';
};

/* 대출 기능 */
const loan = function (evnet) {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentUser.movements.some((mov) => mov >= amount * 0.1)) {
    currentUser.movements.push(amount);
    currentUser.movementsDates.push(new Date().toISOString());
    updateUI(currentUser);
  }

  inputLoanAmount.value = '';
};

/* 로그아웃 */
const closeAcc = function (event) {
  event.preventDefault();

  const name = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  if (name === currentUser.username && pin === currentUser.pin) {
    containerApp.style = 'opacity: 0;';
    const idx = accounts.findIndex((acc) => acc.username === name);
    accounts.splice(idx, 1);
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
  setInterval(displayTime, 1000);
});

/* 정렬 버튼 클릭 */
btnSort.addEventListener('click', () => {
  displayMovements(currentUser, !sorted);
  sorted = !sorted;
});

/* 송금 버튼 클릭 */
btnTransfer.addEventListener('click', transfer);

/* 대출 버튼 클릭 */
btnLoan.addEventListener('click', loan);

/* 클로즈 버튼 클릭 */
btnClose.addEventListener('click', closeAcc);

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

const juliaData = [3, 5, 2, 12, 7];
const kateData = [4, 1, 15, 8, 3];
const juliaData2 = [9, 16, 6, 8, 3];
const kateData2 = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsAgeJulia = dogsJulia.slice();
  dogsAgeJulia.splice(0, 1);
  dogsAgeJulia.splice(-2);
  const dogs = dogsAgeJulia.concat(dogsKate);

  dogs.forEach((age, i) => {
    const text =
      age < 3 ? 'still a puppy 🐶' : `an adult, and is ${age} years old`;
    console.log(`Dog number ${i + 1} is ${text}`);
  });
};

// checkDogs(juliaData, kateData);
// checkDogs(juliaData2, kateData2);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  const average = ages
    .map((age) => (age <= 2 ? age * 2 : age * 4 + 16))
    .filter((age) => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0); // (2+3)/2 = 2.5 === 2/2 + 3/2 = 2.5
  // return humanAges.reduce((acc, prev) => acc + prev, 0) / humanAges.length;
  return average;
};

console.log(calcAverageHumanAge(data1));
console.log(calcAverageHumanAge(data2));

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

const data3 = [5, 2, 4, 1, 15, 8, 3];
const data4 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge2 = (arr) =>
  arr.reduce((acc, age, i, arr) => acc + age / arr.length, 0);

console.log(calcAverageHumanAge2(data3));
console.log(calcAverageHumanAge2(data4));

// Example 1
const { deposits, withdrawals } = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

// Example 2
const convertTitleCase = function (title) {
  const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map((word) => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(
  (dog) => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);

// 2.
const sarahsDog = dogs.find((dog) => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog is eating too ${
    sarahsDog.curFood > sarahsDog.recommendedFood ? 'much' : 'little'
  }.`
);

// 3.
const ownersEatTooMuch = dogs
  .filter((dog) => dog.curFood > dog.recommendedFood)
  .flatMap((dog) => dog.owners);
const ownersEatTooLittle = dogs
  .filter((dog) => dog.curFood < dog.recommendedFood)
  .flatMap((dog) => dog.owners);

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

// 4.
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5.
console.log(dogs.some((dog) => dog.curFood === dog.recommendedFood));

// 6.
const checkEatingOkay = (dog) =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;
console.log(dogs.some(checkEatingOkay));

// 7.
const okayDogs = dogs.filter(checkEatingOkay);

console.log(okayDogs);

// 8.
const sortedDogs = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(sortedDogs);
