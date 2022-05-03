const form = document.querySelector('#form');
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const password2 = document.querySelector('#password2');
const subBtn = document.querySelector('#form button');

/**
 * [조건]
 * username -> 3 ~ 15 글자
 * email -> email 형식
 * password -> 6 ~ 25 글자
 * password2 -> password와 같아야 한다.
 */

subBtn.addEventListener('click', (e) => {
  e.preventDefault();

  // 필수 값 체크
  checkRequired([username, email, password, password2]);

  // 길이 체크
  checkLength(username, 3, 15);
  checkLength(password, 6, 25);

  // 이메일 유효성 체크
  checkEmail(email);

  // 패스워드 확인 일치 체크
  checkPasswordMatch(password, password2);
});

/* 함수 */
function showSuccess(input) {
  input.parentNode.classList.remove('error');
  input.parentNode.classList.add('success');
}

function showError(input, msg) {
  input.parentNode.classList.remove('success');
  input.parentNode.classList.add('error');

  const errorMsg = input.parentNode.querySelector('small');
  errorMsg.textContent = msg;
}

// check required fields
function checkRequired(inputArr) {
  inputArr.forEach((input) => {
    if (input.value.trim() === '') {
      showError(input, `${getFieldName(input)} is required`);
    } else {
      showSuccess(input);
    }
  });
}

// check length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be less than ${max} characters`
    );
  } else {
    showSuccess(input);
  }
}

// check email
function checkEmail(input) {
  const emailRegexp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (emailRegexp.test(input.value.trim())) {
    showSuccess(input);
  } else {
    showError(input, 'Email is not valid');
  }
}

function checkPasswordMatch(input1, input2) {
  if (input2.value === '') {
    checkRequired(input2);
  } else if (input1.value === input2.value) {
    showSuccess(input2);
  } else {
    showError(input2, 'Passwords do not match');
  }
}

function getFieldName(input) {
  return `${input.id.replace(
    input.id.charAt(0),
    input.id.charAt(0).toUpperCase()
  )}`;
}
