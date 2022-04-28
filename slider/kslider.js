function kSlider(target, option) {
  // 이미지만 로드 확인 후 innerName 실행
  const toBeLoaded = document.querySelectorAll(`${target} img`);
  let loadedImages = 0;
  toBeLoaded.forEach((item) => {
    item.onload = () => {
      loadedImages++;

      if (loadedImages === toBeLoaded.length) {
        innerName(target, option);
      }
    };
  });

  function innerName() {
    /* 노드 준비 */
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

    /* 주요 변수 초기화 */
    let moveDist = 0;
    let currentNum = 1;
    const speedTime = option.speed;
    console.log(speedTime);

    /* CSSOM 셋업 */
    const slideCloneItems = slider.children;
    const liWidth = slideItems[0].clientWidth;
    const sliderWidth = liWidth * slideCloneItems.length;
    slider.style.width = `${sliderWidth}px`;
    moveDist = -liWidth;
    slider.style.left = `${-liWidth}px`;

    /* 리스너 설치하기 */
    moveButton.addEventListener('click', moveSlide);

    function moveSlide(ev) {
      ev.preventDefault();
      if (ev.target.className === 'next') {
        // 다음이 눌렸을때
        move(-1);
        if (currentNum === slideCloneItems.length - 1) {
          // 마지막이면
          setTimeout(() => {
            slider.style.transition = 'none'; // 애니끄고
            moveDist = -liWidth; // 진짜A의 값으로 만들고
            slider.style.left = `${moveDist}px`; //진짜A의 위치로 보내고
            currentNum = 1; // 현재번호 업데이트
          }, speedTime);
        }
      } else {
        // 이전이 눌렸을때
        move(1);
        if (currentNum === 0) {
          // 처음이면
          setTimeout(() => {
            slider.style.transition = 'none';
            moveDist = -liWidth * (slideCloneItems.length - 2);
            slider.style.left = `${moveDist}px`;
            currentNum = slideCloneItems.length - 2;
          }, speedTime);
        }
      }
    }

    /* 함수 */
    function move(direction) {
      // 이동 <-   ->
      currentNum += -1 * direction;
      moveDist += liWidth * direction;
      slider.style.left = `${moveDist}px`;
      slider.style.transition = `all ${speedTime}ms ease`;
    }

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
}
