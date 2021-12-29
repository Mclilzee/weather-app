import { fromUnixTime, format } from 'date-fns';

let unit;
let speedUnit;

// format date from unix time
function getProperDate(date) {
  return format(fromUnixTime(date), 'EEEE hh:00 aa');
}

function getHourlyDate(date) {
  return format(fromUnixTime(date), 'EEE hh:00 aa');
}

// create DOM for hourly information
function populateHourlyDetails(hourlyArray) {
  const container = document.querySelector('.currentWeatherHourlyContainer');
  container.innerHTML = "";

  for (let data of hourlyArray) {
    const hourlyContainer = document.createElement('div');
    hourlyContainer.classList.add('hourlyContainer');

    const hourlyTime = document.createElement('div');
    const hourlyTemp = document.createElement('div');
    const hourlyIcon = document.createElement('img');
    const hourlyType = document.createElement('div');

    hourlyTime.textContent = getHourlyDate(data.dt);
    hourlyTemp.textContent = Math.round(data.temp) + ' ' + unit;
    hourlyIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    hourlyType.textContent = data.weather[0].main;

    hourlyContainer.appendChild(hourlyTime);
    hourlyContainer.appendChild(hourlyTemp);
    hourlyContainer.appendChild(hourlyIcon);
    hourlyContainer.appendChild(hourlyType);

    container.appendChild(hourlyContainer);
  }
}

// fill alerts information, if there is any
function createAlerts(alertsArray) {
  const alertsContainer = document.querySelector(
    '.currentWeatherAlertInformation',
  );

  alertsContainer.innerHTML = '';

  // loop through alerts information and extract data
  for (let alert of alertsArray) {
    const description = document.createElement('p');
    description.textContent = `${alert.sender_name}: ${alert.description}`;

    alertsContainer.appendChild(description);
  }
}

// functionality to update the weather information in the dom
function updateWeatherData(cityName, data, unitName) {
  if (unitName === 'metric') {
    unit = '°C';
    speedUnit = 'km/h';
  } else {
    unit = '°F';
    speedUnit = 'mph';
  }

  document.querySelector('#currentWeatherCityName').textContent = cityName;
  document.querySelector('#currentWeatherTime').textContent = getProperDate(
    data.current.dt,
  );
  document.querySelector(
    '#currentWeatherIcon',
  ).src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png`;
  document.querySelector('#currentWeatherDegree').textContent =
    Math.round(data.current.temp) + ' ' + unit;

  // check if there is any available alerts
  if (data.alerts) {
    createAlerts(data.alerts);
  } else {
    createAlerts([]);
  }

  document.getElementById('currentWeatherFeelsLike').textContent =
    'Feels like: ' + Math.round(data.current.feels_like) + ' ' + unit;
  document.getElementById('currentWeatherClouds').textContent =
    'Clouds: ' + data.current.clouds + '%';
  document.getElementById('currentWeatherHumidity').textContent =
    'Humidity: ' + data.current.humidity + '%';
  document.getElementById('currentWeatherType').textContent =
    data.current.weather[0].main;
  document.getElementById('currentWeatherWind').textContent =
    'Wind: ' + data.current.wind_speed + ' ' + speedUnit;

  populateHourlyDetails(data.hourly.slice(1, 24));
  console.log(data);
}

export default updateWeatherData;
