import { fetchByCoords, fetchByCity } from "./api-script.js";
import { getNavigation } from "./navigation-script.js";

let cityInput = document.querySelector("#cityInput");
let getCityForm = document.querySelector("#getCityForm");
let prevSearchText = document.querySelector("#previousSearch");
let previousSearchLink = document.querySelector("#previousSearchLink");
let searchHistoryContainer = document.querySelector("#searchHistoryContainer");
let weatherList = document.querySelector("#weatherList");
let weatherListContainer = document.querySelector("#weatherBlock");
let getPositionBtn = document.querySelector("#getWeatherBtn");
let loader = document.querySelector("#loading");
let skyIcon = document.querySelector("#weatherIcon");

//Getting weather by clicking on a history item
let searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
if (searchHistory) {
  createNewSearchHistoryItem();
}

function createNewSearchHistoryItem() {
  searchHistory.map((element) => {
    let searchHistoryItem = document.createElement("p");
    let searchHistoryText = document.createTextNode(element);
    searchHistoryItem.appendChild(searchHistoryText);
    searchHistoryItem.classList.add("search-word");

    searchHistoryContainer.appendChild(searchHistoryItem);
  });
}

let historyItems = document.querySelectorAll(".search-word");
historyItems.forEach((element) => {
  element.onclick = async function () {
    let weatherDataSearchHistory = await fetchByCity(element.innerText);
    showWeather(weatherDataSearchHistory);
    prevSearchText.textContent = `Weather in: `;
    previousSearchLink.textContent = element.innerHTML;
  };
});

//Show the weather function
function showWeather(weatherData) {
  let temp = Math.floor(weatherData.main.temp);
  let humidity = Math.floor(weatherData.main.humidity);
  let sky = weatherData.weather[0].description;
  let weatherIcon = weatherData.weather[0].icon;

  if (weatherList) {
    while (weatherList.firstChild) {
      weatherList.removeChild(weatherList.firstChild);
    }
  }

  let tempItem = document.createElement("li");
  let tempItemText = document.createTextNode(`Temperature: ${temp}`);
  tempItem.appendChild(tempItemText);
  weatherList.appendChild(tempItem);

  let humidityItem = document.createElement("li");
  let humidityItemText = document.createTextNode(`Humidity: ${humidity}`);
  humidityItem.appendChild(humidityItemText);
  weatherList.appendChild(humidityItem);

  let skyItem = document.createElement("li");
  let skyItemText = document.createTextNode(sky);
  skyItem.appendChild(skyItemText);
  weatherList.appendChild(skyItem);

  skyIcon.style.display = "block";
  skyIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
  );
  weatherListContainer.appendChild(skyIcon);
}

//Previous search
let prevCityValue = localStorage.getItem("prevCity");
if (prevCityValue) {
  prevSearchText.textContent = `You also searched for: `;
  previousSearchLink.textContent = prevCityValue;
  previousSearchLink.classList.add("search-word");

  const prevCity = await fetchByCity(prevCityValue);

  previousSearchLink.onclick = function () {
    showWeather(prevCity);
    prevSearchText.textContent = `Weather in: `;
    previousSearchLink.textContent = prevCityValue;

    //We only need to get the weather by clicking this once, so
    //We need to empty the onclick function (if removed, a bug will appear)
    previousSearchLink.onclick = function () {};
  };
}

//This func runs when pressed the submit or text from search history
//Or previous search
async function getWeather(event) {
  loader.style.display = "flex";
  let city = event.target[0].value;

  try {
    const weatherData = await fetchByCity(city);
    if (weatherData.cod == 200) {
      showWeather(weatherData);
      loader.style.display = "none";

      //Local storage
      localStorage.setItem("prevCity", cityInput.value);

      prevCityValue = cityInput.value;
      prevSearchText.textContent = `Weather in: `;
      previousSearchLink.textContent = prevCityValue;

      const prevCity = await fetchByCity(prevCityValue);

      previousSearchLink.onclick = function () {
        showWeather(prevCity);
      };

      if (searchHistory) {
        searchHistory.unshift(city);
        localStorage.setItem(
          "searchHistory",
          JSON.stringify(searchHistory.filter((v, i, a) => a.indexOf(v) === i))
        );
      } else {
        let searchHistory = [city];
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
      }
    } else {
      if (!cityInput.value) {
        alert("Please enter your city!");
      } else {
        alert("Error: city not found");
      }
    }
  } catch (error) {}

  event.target[0].value = "";
}

getCityForm.onsubmit = function (event) {
  event.preventDefault();
  getWeather(event);
};

//Get user position
getPositionBtn.onclick = async function getUserLocation() {
  if (weatherList) {
    while (weatherList.firstChild) {
      weatherList.removeChild(weatherList.firstChild);
    }
  }
  skyIcon.style.display = "none";

  loader.style.display = "flex";
  let coords = await getNavigation();
  let weather = await fetchByCoords(coords);
  loader.style.display = "none";

  showWeather(weather);

  prevSearchText.textContent = `Weather in: `;
  previousSearchLink.textContent = weather.sys.country;
};
