/* eslint-disable no-use-before-define */
import './style.css';
import updateWeatherData from './fillInformation';



const loadingScreen = document.querySelector(".loadingScreen");
const errorMsg = document.querySelector('.errorMessage');


// get last seached location if exist
let location = localStorage.getItem('location');
let unit = localStorage.getItem('unit');
const unitDOM = document.querySelector('.switchUnit');

if (!unit) {
  unit = 'metric';
} else {
  if (unit === 'metric') {
    unitDOM.textContent = 'Switch to °F';
  } else {
    unitDOM.textContent = 'Switch to °C';
  }
}

if (location) {
  fetchWeatherData(location);
} else {
  fetchWeatherData('Berlin, Germany');
}

// get weather data then call to fill dom
async function fetchWeatherData(input) {

  loadingScreen.classList.toggle("loadingScreenHidden");
  try {
    const information = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=9335ef49fc3e92d53f1e7a185462ef51`,
    ).then((dataJson) => dataJson.json());

    if (information.cod === 200) {
      const { lat } = information.coord;
      const { lon } = information.coord;
      let countryName = '';
      if (information.sys.country) {
        countryName = ', ' + information.sys.country;
      }
      const cityName = `${information.name}${countryName}`;
      const data = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=${unit}&appid=9335ef49fc3e92d53f1e7a185462ef51`,
      ).then((dataJson) => dataJson.json());
      errorMsg.textContent = '';

      updateWeatherData(cityName, data, unit);

      location = input;
      localStorage.setItem('location', location);
      localStorage.setItem('unit', unit);
    } else {
      errorMsg.textContent = `${input} was not found.`;
    }
  } catch (e) {
    console.error(`${e.name}: ${e.message}`);
  } finally {
    loadingScreen.classList.toggle("loadingScreenHidden");
  }
}

document.querySelector('.userInputForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = e.target.inputField.value;
  fetchWeatherData(input);
});

// switch Unit and repopulate dom with stored location
document.querySelector('.switchUnit').addEventListener('click', (e) => {
  if (unit === 'imperial') {
    e.target.textContent = 'Switch to °F';
    unit = 'metric';
    fetchWeatherData(location);
  } else {
    e.target.textContent = 'Switch to °C';
    unit = 'imperial';
    fetchWeatherData(location);
  }
});
