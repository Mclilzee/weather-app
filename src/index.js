/* eslint-disable no-use-before-define */
import './style.css';
import { fromUnixTime, format } from 'date-fns';

// get last seached location if exist
let location = localStorage.getItem('location');
let unit = 'metric';
if (location) {
  fetchWeatherData(location);
} else {
  fetchWeatherData('Berlin, Germany');
}

// format date from unix time
function getProperDate(date) {
  return format(fromUnixTime(date), 'EEEE hh:00 aa');
}

// get weather data then call to fill dom
async function fetchWeatherData(input) {
  const errorMsg = document.querySelector('.errorMessage');

  try {
    const information = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=9335ef49fc3e92d53f1e7a185462ef51`
    ).then((dataJson) => dataJson.json());

    if (information.cod === 200) {
      const { lat } = information.coord;
      const { lon } = information.coord;
      const data = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=${unit}&appid=9335ef49fc3e92d53f1e7a185462ef51`
      ).then((dataJson) => dataJson.json());
      errorMsg.textContent = '';
      console.log(information.name);
      console.log(information.sys.country);
      console.log(data.hourly);
      console.log(data.daily);
      console.log(data.current);

      location = input;
      localStorage.setItem("location", location);
    } else {
      errorMsg.textContent = `${input} was not found.`;
    }
  } catch (e) {
    console.error(`${e.name}: ${e.message}`);
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
