class Eye {
  constructor(selector) {
    this.eye = document.querySelector(selector);
    this.pupil = this.eye.querySelector('.pupil');
    this.area = this.eye.getBoundingClientRect();
  }

  movePupil(mouseX, mouseY) {
    const radian = Math.atan2(
      mouseY - (this.area.y + this.area.height * 0.5),
      mouseX - (this.area.x + this.area.width * 0.5)
    );
    const degree = (180 * radian) / Math.PI - 90;
    this.pupil.style.transform = `rotate(${degree}deg)`;
  }
}

const leftEye = new Eye('.left-eye');
const rightEye = new Eye('.right-eye');

window.addEventListener('mousemove', (event) => {
  leftEye.movePupil(event.pageX, event.pageY);
  rightEye.movePupil(event.pageX, event.pageY);
});
