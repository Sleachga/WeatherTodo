let canvas = document.getElementById("canvas");

let context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fps = 60;
const interval = 1000 / fps;
let now, delta, time;

const weatherCodes = {
  cloudy: [1003, 1006, 1009, 1030, 1135],
  rain: [
    1063,
    1072,
    1087,
    1150,
    1153,
    1168,
    1171,
    1180,
    1183,
    1186,
    1189,
    1192,
    1195,
    1198,
    1240,
    1243,
    1246,
    1249,
    1252,
    1264,
    1273,
    1276
  ],
  sun: [1000],
  snow: [
    1066,
    1069,
    1114,
    1117,
    1147,
    1201,
    1204,
    1207,
    1210,
    1213,
    1216,
    1219,
    1222,
    1225,
    1237,
    1255,
    1258,
    1261,
    1279,
    1282
  ]
};

function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function deleteCookie(cname) {
  if (getCookie(cname)) {
    document.cookie =
      cname + "=" + "deleted;" + "expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
  }
}

// Check if local variables exist or have expired and start app accordingly
let localStorageExists;
let weatherInfo = localStorage.getItem("weatherInfo");
weatherInfo == null
  ? (localStorageExists = false)
  : (localStorageExists = true);

// If localstorage exists, check if expired
if (localStorageExists) {
  weatherInfo = JSON.parse(weatherInfo);
  let now = new Date();
  if (now > weatherInfo.exp) {
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
    "http://api.apixu.com/v1/current.json?key=981a745ea32a46bda29231427191503&q=" +
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
    // No Cookies
    weatherText = weatherInfo.weather;
    temperature = weatherInfo.temperature;
    code = weatherInfo.code;
  } else {
    // Get Current Time
    let now = new Date();
    let expireDate = new Date(now.getTime() + 1000 * 60 * 60);

    weatherText = data.current.condition.text;
    temperature = data.current.feelslike_f;
    code = parseInt(data.current.condition.code);

    let weatherInfo = JSON.stringify({
      weather: weatherText,
      temperature: temperature,
      code: code,
      exp: expireDate
    });

    localStorage.setItem("weatherInfo", weatherInfo);

    // DEBUG PURPOSES
    console.log("Code Cookie: " + getCookie("code"));
  }

  let celsius = false;

  $("#weatherText").text(weatherText.toUpperCase());
  numTextChars = weatherText.length;

  if (numTextChars > 20) {
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
    if (key == 13) {
      if ($("#todoInput").val().length > 0) {
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
          text: $("#todoInput").val()
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
