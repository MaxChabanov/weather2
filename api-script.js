const API_KEY = "bcc6d928ef62229a620786614b350964";

export async function fetchByCoords(userPosition) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${userPosition.lat}&lon=${userPosition.lon}&appid=${API_KEY}&units=metric`
  )
    .then((res) => res.json())
    .then(function (res) {
      return res;
    });
}

export async function fetchByCity(city) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  )
    .then((res) => res.json())
    .then((res) => res);
}
