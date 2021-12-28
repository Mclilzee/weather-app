import { fromUnixTime, format } from 'date-fns';

// format date from unix time
function getProperDate(date) {
  return format(fromUnixTime(date), 'EEEE hh:00 aa');
}

// fill alerts information, if there is any
function createAlerts(alertsArray) {
  const alertsContainer = document.querySelector(
    '.currentWeatherAlertInformation',
  );

  alertsContainer.innerHTML = '';

  // loop through alerts information and extract data
  for (alert of alertsArray) {
    const description = document.createElement('p');
    description.textContent = `${alert.sender_name}: ${alert.description}`;

    alertsContainer.appendChild(description);
  }
}

// functionality to update the weather information in the dom
function updateWeatherData(cityName, data, unit) {
  if (unit === 'metric') {
    unit = '°C';
  } else {
    unit = '°F';
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
  console.log(data);
}

export default updateWeatherData;
