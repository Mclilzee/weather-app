import { fromUnixTime, format } from 'date-fns';

// format date from unix time
function getProperDate(date) {
  return format(fromUnixTime(date), 'EEEE hh:00 aa');
}

function createAlerts(alertsArray) {
  const alertsContainer = document.querySelector(
    '.currentWeatherAlertInformation',
  );

  alertsContainer.innerHTML = '';

  for (alert of alertsArray) {
    const description = document.createElement('p');
    description.textContent = `${alert.sender_name}: ${alert.description}`;

    alertsContainer.appendChild(description);
  }
}
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

  if (data.alerts) {
    createAlerts(data.alerts);
  } else {
    createAlerts([]);
  }
  console.log(data);
}

export default updateWeatherData;
