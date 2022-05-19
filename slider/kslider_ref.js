// 로드준비
function kSlider(target, option) {
  const toBeLoaded = document.querySelectorAll(`${target} img`);

  if (toBeLoaded.length === 0) {
    throw new Error(`${target} 라는 노드를 찾지 못했습니다.`);
  }

  let loadedImages = 0;
  toBeLoaded.forEach((item) => {
    item.onload = () => {
      loadedImages++;

      if (loadedImages === toBeLoaded.length) {
        run(target, option);
      }
    };
  });
}

// 준비시키기
function run(target, option) {
  const OPTION = setOption(option);
  setNode(target, OPTION);
  setSliding(target, OPTION);
}

// 옵션준비
function setOption(option) {
  // 항목 점검
  let OPTION = {
    speed: 1000,
    direction: 'horizontal',
  };

  for (prop in option) {
    if (prop in OPTION) {
      // 값 점검
      exception(prop, option[prop]);

      OPTION[prop] = option[prop];
    } else {
      throw new Error(`'${prop}'은 사용할 수 없는 옵션입니다.`);
    }
  }

  function exception(prop, value) {
    switch (prop) {
      case 'speed':
        if (value > 0) break;
      case 'direction':
        if (value === 'horizontal' || value === 'vertical') break;
      default:
        throw new Error(`'${value}'은 사용할 수 없는 값입니다.`);
    }
  }

  return Object.freeze(OPTION);
}

// 노드준비
function setNode(target) {
  const slider = document.querySelector(target);
  const kindWrap = document.createElement('div');
  const kindSlider = document.createElement('div');
  slider.classList.add('k_list');
  kindWrap.classList.add('kind_wrap');
  kindSlider.classList.add('kind_slider');
  slider.parentNode.insertBefore(kindWrap, slider);
  kindWrap.appendChild(kindSlider);
  kindSlider.appendChild(slider);

  const slideItems = slider.children;

  for (let i = 0; i < slideItems.length; i++) {
    slideItems[i].classList.add('k_item');
  }

  const cloneA = slideItems[0].cloneNode(true);
  const cloneC = slideItems[slideItems.length - 1].cloneNode(true);
  slider.insertBefore(cloneC, slideItems[0]);
  slider.appendChild(cloneA);

  const moveButton = createMoveButton();
  kindWrap.appendChild(moveButton);

  function createMoveButton() {
    const moveButton = document.createElement('div');
    moveButton.classList.add('arrow');

    const prevBtn = document.createElement('a');
    const nextBtn = document.createElement('a');
    prevBtn.classList.add('prev');
    nextBtn.classList.add('next');
    prevBtn.textContent = '이전';
    nextBtn.textContent = '다음';
    prevBtn.href = '';
    nextBtn.href = '';
    moveButton.appendChild(prevBtn);
    moveButton.appendChild(nextBtn);

    return moveButton;
  }
}

// 동작준비
function setSliding(target, OPTION) {
  /* 주요 변수 초기화 */
  let moveDist = 0;
  let currentNum = 1;

  /* 클론 포함 세팅 */
  const slider = document.querySelector(target);
  const slideCloneItems = slider.children;
  const moveButton = document.querySelector('.arrow');

  /* 클론 포함 넓이 세팅 */
  const liWidth = slideCloneItems[0].clientWidth;
  const sliderWidth = liWidth * slideCloneItems.length;
  slider.style.width = `${sliderWidth}px`;

  /* 처음 위치 잡기 */
  moveDist = -liWidth;
  slider.style.left = `${-liWidth}px`;

  const POS = { moveDist, liWidth, currentNum };

  /* 이벤트 리스너 걸기 */
  moveButton.addEventListener('click', (ev) => {
    sliding(ev, OPTION, target, POS);
  });
}

// 동작
function sliding(ev, OPTION, target, POS) {
  ev.preventDefault();

  const slider = document.querySelector(target);
  const slideCloneItems = slider.children;

  if (ev.target.className === 'next') {
    // 다음이 눌렸을때
    move(-1);
    if (POS.currentNum === slideCloneItems.length - 1) {
      // 마지막이면
      setTimeout(() => {
        slider.style.transition = 'none'; // 애니끄고
        POS.moveDist = -POS.liWidth; // 진짜A의 값으로 만들고
        slider.style.left = `${POS.moveDist}px`; //진짜A의 위치로 보내고
        POS.currentNum = 1; // 현재번호 업데이트
      }, OPTION.speed);
    }
  } else {
    // 이전이 눌렸을때
    move(1);
    if (POS.currentNum === 0) {
      // 처음이면
      setTimeout(() => {
        slider.style.transition = 'none';
        POS.moveDist = -POS.liWidth * (slideCloneItems.length - 2);
        slider.style.left = `${POS.moveDist}px`;
        POS.currentNum = slideCloneItems.length - 2;
      }, OPTION.speed);
    }
  }

  function move(direction) {
    // 이동 <-   ->
    POS.currentNum += -1 * direction;
    POS.moveDist += POS.liWidth * direction;
    slider.style.left = `${POS.moveDist}px`;
    slider.style.transition = `all ${OPTION.speed}ms ease`;
  }
}
