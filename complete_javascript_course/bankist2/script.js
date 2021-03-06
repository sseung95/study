'use strict';

///////////////////////////////////////
// Modal window

const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const section1 = document.querySelector('#section--1');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const contents = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const links = document.querySelectorAll('.nav__link');
const featuresImges = document.querySelectorAll('.features__img');
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  /*
  // 예전 방식
  const s1coords = section1.getBoundingClientRect();
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  */

  // 최신 방식
  section1.scrollIntoView({ behavior: 'smooth' });
});

const handleNavHover = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach((s) => {
      if (s != link) {
        s.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleNavHover.bind(0.5));

nav.addEventListener('mouseout', handleNavHover.bind(1));

navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    const section = document.querySelector(id);
    section.scrollIntoView({ behavior: 'smooth' });
  }
});

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) {
    return;
  }

  tabs.forEach((t) => t.classList.remove('operations__tab--active'));
  contents.forEach((c) => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Nav sticky event
const navCallback = function (entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      nav.classList.remove('sticky');
    } else {
      nav.classList.add('sticky');
    }
  });
};

const navObsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
};

const headerObserver = new IntersectionObserver(navCallback, navObsOptions);
headerObserver.observe(header);

///// TODO: 왜 entries를 for 돌리지 않고 entry로 저장해서 사용해도 되는지 알아보기
const sectionCallback = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); // 액션이 끝난 section은 다시 observe하지 않도록 하기 위해
};

// Section scroll event
const sectionObsOptions = {
  root: null,
  threshold: 0.1,
};

const sectionObserver = new IntersectionObserver(
  sectionCallback,
  sectionObsOptions
);
const sections = document.querySelectorAll('.section');
sections.forEach((section) => {
  sectionObserver.observe(section);
  // html에서 hidden을 직접 추가하면 js 비활성화는 사람들에게는 페이지가 보여지지 않으므로
  section.classList.add('section--hidden');
});

// Lazy loading images
const lazyCallback = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.setAttribute('src', entry.target.dataset.src);

  // 해당 이미지가 로드된 후에 lazy-img를 제거해야 바로 선명한 이미지 볼 수 있다.
  // (lazy-img를 빨리 제거하면 흐릿한 이미지가 먼저 보인 뒤 선명한 이미지 보임)
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const lazyObserver = new IntersectionObserver(lazyCallback, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

featuresImges.forEach((img) => lazyObserver.observe(img));

// Slide event
let slideIdx = 0;

const createDots = function () {
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dots__dot');
    dot.setAttribute('data-slide', i);
    dotsContainer.append(dot);
  });
};

const goToSlide = function (idx) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - idx)}%)`;
  });
};

const nextSlide = function () {
  slideIdx = slideIdx === slides.length - 1 ? 0 : ++slideIdx;
  goToSlide(slideIdx);
  activateDot(slideIdx);
};

const prevSlide = function () {
  slideIdx = slideIdx === 0 ? slides.length - 1 : --slideIdx;
  goToSlide(slideIdx);
  activateDot(slideIdx);
};

const goToDot = function (e) {
  const clicked = e.target;

  if (!clicked.classList.contains('dots__dot')) return;

  slideIdx = +clicked.dataset.slide;
  goToSlide(slideIdx);
  activateDot(slideIdx);
};

const activateDot = function (idx) {
  document
    .querySelectorAll('.dots__dot')
    .forEach((dot) => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${idx}"]`)
    .classList.add('dots__dot--active');

  // dots.forEach((dot, i) => {
  //   if (i === idx) {
  //     dot.classList.add('dots__dot--active');
  //   } else {
  //     dot.classList.remove('dots__dot--active');
  //   }
  // });
};

const init = function () {
  createDots();
  activateDot(0);
  goToSlide(0);
};

init();

btnSliderRight.addEventListener('click', nextSlide);
btnSliderLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    nextSlide();
  } else if (event.key === 'ArrowLeft') {
    prevSlide();
  }
});
dotsContainer.addEventListener('click', goToDot);

/*
///////////////////////////////
// Selecting, Creating, and Deleting Elements

// Selecting elements
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics.';
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });
*/
