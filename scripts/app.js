let canvas = document.getElementById("canvas");

let context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fps = 60;
const interval = 1000 / fps;
let now, delta, time;

const weatherCodes = {
  cloudy: [
    1003, // Partly Cloudy
    1006, // Cloudy
    1009, // Overcast
    1030, // Mist
    1135 // Fog
  ],
  rain: [
    1063, // Patchy Rain Possible
    1072, // Patchy freezing drizzle possible
    1087, // Thundery outbreaks possible
    1150, // Patchy light drizzle
    1153, // Light drizzle
    1168, // Freezing drizzle
    1171, // Heavy freezing drizzle
    1180, // Patchy light rain
    1183, // Light rain
    1186, // Moderate rain at times
    1189, // Moderate rain
    1192, // Heavy rain at times
    1195, // Heavy rain
    1198, // Light freezing rain
    1240, // Light rain shower
    1243, // Moderate or heavy rain shower
    1246, // Torrential rain shower
    1249, // Light sleet showers
    1252, // Moderate or heavy sleet showers
    1264, // Moderate or heavy showers of ice pellets
    1273, // Patchy light rain with thunder
    1276 // Moderate or heavy rain with thunder
  ],
  sun: [1000], // Sunny
  snow: [
    1066, // Patchy snow possible
    1069, // Patchy sleet possible
    1114, // Blowing snow
    1117, // Blizzard
    1147, // Freezing fog
    1201, // Moderate or heavy freezing rain
    1204, // Light sleet
    1207, // Moderate or heavy sleet
    1210, // Patchy light snow
    1213, // Light snow
    1216, // Patchy moderate snow
    1219, // Moderate snow
    1222, // Patchy heavy snow
    1225, // Heavy snow
    1237, // Ice pellets
    1255, // Light snow showers
    1258, // Moderate or heavy snow showers
    1261, // Light showers of ice pellets
    1279, // Patchy light snow with thunder
    1282 // Moderate or heavy snow with thunder
  ]
};

// Check if local variables exist or have expired and start app accordingly
let localStorageExists;
let weatherInfo = localStorage.getItem("weatherInfo");

// If weatherInfo is null, local storage doesn't exist yet (1st time)
weatherInfo == null
  ? (localStorageExists = false)
  : (localStorageExists = true);

// If localstorage exists, check if expired.  Start app accordingly afterwards.
if (localStorageExists) {
  weatherInfo = JSON.parse(weatherInfo);
  let now = new Date();
  let expireDate = new Date(weatherInfo.exp);

  // If current time is past weatherInfo expiration then start app and tell it to overwrite weatherInfo
  if (now > expireDate) {
    localStorageExists = false;
    navigator.geolocation.getCurrentPosition(setPosition, showError);
  } else {
    // Get User Location and start app
    if (navigator.geolocation) {
      runApp(null);
    }
  }
} else {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
}

function setPosition(position) {
  return fetch(
    "https://api.apixu.com/v1/current.json?key=981a745ea32a46bda29231427191503&q=" +
      position.coords.latitude +
      "," +
      position.coords.longitude
  )
    .then(response => response.json())
    .then(runApp);
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied location request.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occured.");
      break;
  }
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function runApp(data) {
  $("#loading").hide();
  $("#container").show();
  $("#container").css("display", "grid");
  $("#refreshWeather").show();

  let weatherText, temperature, code;

  if (localStorageExists) {
    // Set vars from local storage
    weatherText = weatherInfo.weather;
    temperature = weatherInfo.temperature;
    code = weatherInfo.code;
  } else {
    // Get Current Time
    let now = new Date();
    let expireDate = new Date(now.getTime() + 1000 * 60 * 60); // Set expire date for one hour in the future

    weatherText = data.current.condition.text;
    temperature = Math.round(parseInt(data.current.feelslike_f));
    code = parseInt(data.current.condition.code);

    let weatherInfo = JSON.stringify({
      weather: weatherText,
      temperature: temperature,
      code: code,
      exp: expireDate
    });

    localStorage.setItem("weatherInfo", weatherInfo);
  }

  let celsius = false;

  $("#weatherText").text(weatherText.toUpperCase());
  numTextChars = weatherText.length;

  if (numTextChars > 30) {
    $("#weatherText").css("font-size", "2vw");
    $("#temperature").css("font-size", "2vw");
  } else if (numTextChars <= 30 && numTextChars > 20) {
    $("#weatherText").css("font-size", "3vw");
    $("#temperature").css("font-size", "3vw");
  } else if (numTextChars <= 20 && numTextChars > 10) {
    $("#weatherText").css("font-size", "4vw");
    $("#temperature").css("font-size", "4vw");
  } else {
    $("#weatherText").css("font-size", "6vw");
    $("#temperature").css("font-size", "6vw");
  }

  $("#temperature").html(temperature + "&#8457;");
  $("#temperature").click(function() {
    if (!celsius) {
      temperature = ((temperature - 32) * 5) / 9;
      $("#temperature").html(Math.floor(temperature) + "&#8451;");
    } else {
      temperature = (temperature * 9) / 5 + 32;
      $("#temperature").html(Math.floor(temperature) + "&#8457;");
    }
    celsius = !celsius;
  });

  // ------------- Handle Todo List Stuff -------------------- //

  let todos = {};

  if (localStorage.getItem("todos") === null) {
    localStorage.setItem("todos", JSON.stringify(todos));
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  for (let key in todos) {
    if (todos[key].checked) {
      $("#todoItems").append(
        '<li class="checked" id="' + key + '">' + todos[key].text + "</li>"
      );
    } else {
      $("#todoItems").append(
        '<li id="' + key + '">' + todos[key].text + "</li>"
      );
    }
  }

  let liList = document.getElementsByTagName("LI");
  for (let i = 0; i < liList.length; i++) {
    let span = document.createElement("SPAN");
    let x = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(x);
    liList[i].appendChild(span);
  }

  let close = document.getElementsByClassName("close");
  for (let i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      let div = this.parentElement;
      delete todos[div.id];
      localStorage.setItem("todos", JSON.stringify(todos));
      div.style.display = "none";
    };
  }

  let list = document.getElementById("todoItems");
  list.addEventListener(
    "click",
    function(e) {
      if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        let id = e.target.id;
        todos[id].checked = !todos[id].checked;
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    },
    false
  );

  window.onkeyup = function(e) {
    let key = e.keycode ? e.keycode : e.which;

    let todoText = $("#todoInput")
      .val()
      .trim();

    let maxTodoLength = 60;

    if (key == 13 && todoText != "") {
      if (todoText.length > 0 && todoText.length < maxTodoLength) {
        // Gen unique ID
        let uuid = (
          S4() +
          S4() +
          "-" +
          S4() +
          "-4" +
          S4().substr(0, 3) +
          "-" +
          S4() +
          "-" +
          S4() +
          S4() +
          S4()
        ).toLowerCase();

        todos[uuid] = {
          checked: false,
          text: todoText
        };

        localStorage.setItem("todos", JSON.stringify(todos));

        let li = document.createElement("li");
        li.setAttribute("id", uuid);

        let t = document.createTextNode($("#todoInput").val());
        li.appendChild(t);
        document.getElementById("todoItems").appendChild(li);

        document.getElementById("todoInput").value = "";

        let span = document.createElement("SPAN");
        let text = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(text);
        li.appendChild(span);
      } else if (todoText.length > maxTodoLength) {
        alert(
          "Todo length must be less than " + maxTodoLength + " characters!"
        );
      }

      for (let i = 0; i < close.length; i++) {
        close[i].onclick = function() {
          let div = this.parentElement;
          delete todos[div.id];
          localStorage.setItem("todos", JSON.stringify(todos));
          div.style.display = "none";
        };
      }
    }
  };

  $("#refreshWeather").click(function() {
    localStorage.removeItem("weatherInfo");
    window.location.reload(true);
  });

  // ----------------------- Weather Animation Logic---------------------------- //

  let weather;
  if (weatherCodes["cloudy"].includes(code)) {
    weather = "cloudy";
    initCloudy();
  } else if (weatherCodes["rain"].includes(code)) {
    weather = "rain";
    initRain();
  } else if (weatherCodes["sun"].includes(code)) {
    weather = "sun";
    initSun();
  } else if (weatherCodes["snow"].includes(code)) {
    weather = "snow";
    initSnow();
  }

  $(window).resize(function() {
    canvas.width = $(window).width();
    canvas.height = $(window).height();

    if (weather == "rain") initRain();
    else if (weather == "sun") initSun();
    else if (weather == "snow") initSnow();
    else if (weather == "cloudy") initCloudy();
  });

  setInterval(function() {
    if (weather == "rain") {
      requestAnimationFrame(drawRain);
      drawRain();
    } else if (weather == "sun") {
      requestAnimationFrame(drawSun);
      drawSun();
    } else if (weather == "snow") {
      requestAnimationFrame(drawSnow);
      drawSnow();
    } else if (weather == "cloudy") {
      requestAnimationFrame(drawClouds);
      drawClouds();
    }
  }, 1000 / fps);
}
