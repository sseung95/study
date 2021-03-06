'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

/////////////////////////////
// WORKOUT
class Workout {
  id = (Date.now() + '').slice(-10);
  date = new Date();
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

//////////////////////////////////////
// APPLICATION
class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();

    this._getLocalStorage();

    // ?????????
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveMap.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation) {
      // _loadMap()??? ??????????????? ???????????? this ???????????? undefined => bind ?????????.
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () =>
        alert('?????? ????????? ????????? ??? ????????????.')
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // ?????? ?????? ?????????
    this.#map.on('click', this._showForm.bind(this));

    // ????????? ???????????? work ??????
    this.#workouts.forEach((workout) => {
      this._renderWorkoutMarker(workout);
    });
  }

  _showForm(mapE) {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every((inp) => inp > 0);

    e.preventDefault();

    let workout;
    const { lat, lng } = this.#mapEvent.latlng;
    const coords = [lat, lng];

    // ????????? ????????? ????????????
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    // workout??? running??????, Running ?????? ??????
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // ?????? ??? ????????? ??????
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert('0?????? ??? ????????? ??????????????????!');
      }

      workout = new Running(coords, distance, duration, cadence);
    }

    // workout??? cycling??????, cycling ?????? ??????
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        return alert('0?????? ??? ????????? ??????????????????!');
      }

      workout = new Cycling(coords, distance, duration, elevation);
    }

    // ????????? ????????? workout ????????? ??????
    this.#workouts.push(workout);

    // ????????? ?????? ??????
    this._renderWorkoutMarker(workout);

    // workout ????????? ??????
    this._renderWorkout(workout);

    // form ????????? + ?????? ??? ?????????
    this._hideForm();

    // ????????????????????? ??????
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout, type) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '?????????????' : '?????????????'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    const isRunning = () => workout.type === 'running';

    const li = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${isRunning() ? '?????????????' : '?????????????'}</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">???</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">??????</span>
      <span class="workout__value">${
        isRunning() ? workout.pace.toFixed(1) : workout.speed.toFixed(1)
      }</span>
      <span class="workout__unit">${isRunning() ? 'min/km' : 'km/h'}</span>
      </div>
      <div class="workout__details">
      <span class="workout__icon">${isRunning() ? '????????' : '???'}</span>
      <span class="workout__value">${
        isRunning() ? workout.cadence : workout.elevationGain
      }</span>
      <span class="workout__unit">${isRunning() ? 'spm' : 'm'}</span>
    </div>
  </li>`;
    form.insertAdjacentHTML('afterend', li);
  }

  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'));
  }

  _moveMap(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    const { id } = workoutEl.dataset;
    const workout = this.#workouts.find((w) => w.id === id);

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      anmimate: true,
      pan: {
        duration: 1,
      },
    });

    // workout.click();
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const workouts = JSON.parse(localStorage.getItem('workouts'));

    if (!workouts) return;

    this.#workouts = workouts;

    this.#workouts.forEach((workout) => {
      this._renderWorkout(workout);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }

  /* 
  TODO: 
  1. workout ??????, ??????
  2. workout ??????
  3. ????????????????????? ?????? ????????? Running, Cycling ????????? ?????????
  */
}

const app = new App();
