'use strict';

/*
1. 모달 창 띄우기
  1) modal 클래스에서 hidden class 삭제
  2) overlay 클래스에서 hidden class 삭제

2. 모달 창 닫기
  1) modal-close 클래스 클릭
  2) overlay 클래스 클릭
  3) esc키 눌렀을 때
*/

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const openBtns = document.querySelectorAll('.show-modal');
const closeBtn = document.querySelector('.close-modal');

const HIDDEN_KEY = 'hidden';

const openModal = function () {
  modal.classList.remove(HIDDEN_KEY);
  overlay.classList.remove(HIDDEN_KEY);
};

const closeModal = function () {
  modal.classList.add(HIDDEN_KEY);
  overlay.classList.add(HIDDEN_KEY);
};

const pressEsc = function (event) {
  if (event.key === 'Escape' && !modal.classList.contains(HIDDEN_KEY)) {
    closeModal();
  }
};

// 모달창 열기
openBtns.forEach((openBtn) => {
  openBtn.addEventListener('click', openModal);
});

// 모달창 닫기
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
window.addEventListener('keydown', pressEsc);
