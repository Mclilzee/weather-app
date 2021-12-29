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

function getDailyDate(date) {
  return format(fromUnixTime(date), "EEEE, dd MMM");
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
    hourlyIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    hourlyType.textContent = data.weather[0].main;

    hourlyContainer.appendChild(hourlyTime);
    hourlyContainer.appendChild(hourlyTemp);
    hourlyContainer.appendChild(hourlyIcon);
    hourlyContainer.appendChild(hourlyType);

    container.appendChild(hourlyContainer);
  }
}

// create DOM for daily temp parts
function createDailyParts(firstText, firstData, secondText, secondData) {
  
  const dailyTempPart = document.createElement("div");
  dailyTempPart.classList.add("dailyTempPart");
  const dailyTempFirstDetail = document.createElement("div");
  const dailyTempSecondDetail = document.createElement("div");

  dailyTempFirstDetail.textContent = firstText + ": " + Math.round(firstData) + " " + unit;
  dailyTempSecondDetail.textContent = secondText + ": " + Math.round(secondData) + " " + unit;

  dailyTempPart.appendChild(dailyTempFirstDetail);
  dailyTempPart.appendChild(dailyTempSecondDetail);

  return dailyTempPart;
}

// create DOM for daily infomration 
function populateDailyDetails(dailyArray) {
  const container = document.querySelector('.dailyWeatherContainer');
  container.innerHTML = "";

  for (let data of dailyArray) {
    const dailyContainer = document.createElement('div');
    dailyContainer.classList.add('dailyContainer');

    const dailyDate = document.createElement('div');
    const dailyIcon = document.createElement('img');
    const dailyType = document.createElement('div');

    const dailyTempContainer = document.createElement("div");
    dailyTempContainer.classList.add("dailyTempContainer");

    const dailyTempFirstPart = createDailyParts("Min", data.temp.min, "Max", data.temp.max);
    const dailyTempSecondPart = createDailyParts("Morning", data.temp.morn, "Day", data.temp.day);
    const dailyTempThirdPart = createDailyParts("Evening", data.temp.eve, "Night", data.temp.night);

    dailyTempContainer.appendChild(dailyTempFirstPart);
    dailyTempContainer.appendChild(dailyTempSecondPart);
    dailyTempContainer.appendChild(dailyTempThirdPart);


    dailyDate.textContent = getDailyDate(data.dt);
    dailyIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    dailyType.textContent = data.weather[0].main;

    dailyContainer.appendChild(dailyDate);
    dailyContainer.appendChild(dailyIcon);
    dailyContainer.appendChild(dailyType);
    dailyContainer.appendChild(dailyTempContainer);

    container.appendChild(dailyContainer);
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

  populateHourlyDetails(data.hourly.slice(1, 26));
  populateDailyDetails(data.daily.slice(1));
  console.log(data);
}

export default updateWeatherData;
