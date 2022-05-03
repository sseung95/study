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

  /* username 검사 */
  if (username.value.length >= 3 && username.value.length <= 15) {
    addSuccessClass(username);
  } else {
    addErrorClass(username);

    // 에러 메세지 추가
    if (username.value.length < 3) {
      changeErrorMsg(username, 'Username must be at least 3 characters');
    } else if (username.value.length > 15) {
      changeErrorMsg(username, 'Username must be less than 15 characters');
    }
  }

  /* email 검사 */
  const emailRegexp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  if (email.value.match(emailRegexp)) {
    addSuccessClass(email);
  } else {
    addErrorClass(email);
    changeErrorMsg(email, 'Email is not valid');
  }

  /* password 검사 */
  if (password.value.length >= 6 && password.value.length <= 25) {
    addSuccessClass(password);
  } else {
    addErrorClass(password);

    if (password.value.length < 6) {
      changeErrorMsg(password, 'Password must be at least 6 characters');
    } else if (password.value.length > 25) {
      changeErrorMsg(password, 'Password must be less than 25 characters');
    }
  }

  /* password2 검사 */
  if (password2.value.length === 0) {
    addErrorClass(password2);
    changeErrorMsg(password2, 'Password2 is required');
  } else if (password2.value === password.value) {
    addSuccessClass(password2);
  } else {
    addErrorClass(password2);
    changeErrorMsg(password2, 'Passwords do not match');
  }
});

function addSuccessClass(element) {
  element.parentNode.classList.remove('error');
  element.parentNode.classList.add('success');
}

function addErrorClass(element) {
  element.parentNode.classList.remove('success');
  element.parentNode.classList.add('error');
}

function changeErrorMsg(element, msg) {
  const errorMsg = element.parentNode.querySelector('small');
  errorMsg.textContent = msg;
}
