let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let fps = 60;
        const interval = 1000 / fps;
        let now, delta, time;

        const weatherCodes = {
            0: 'rain', 1: 'rain', 2: 'rain', 3: 'rain', 4: 'rain',
            5: 'snow', 6: 'rain', 7: 'snow', 8: 'rain', 9: 'rain',
            10: 'rain', 11: 'rain', 12: 'rain', 13: 'snow', 14: 'snow',
            15: 'snow', 16: 'snow', 17: 'snow', 18: 'snow', 19: 'sun',
            20: 'cloudy', 21: 'cloudy', 22: 'cloudy', 23: 'cloudy', 
            24: 'cloudy', 25: 'sun', 26: 'cloudy', 27: 'cloudy', 
            28: 'cloudy', 29: 'cloudy', 30: 'cloudy', 31: 'sun',
            32: 'sun', 33: 'sun', 34: 'sun', 35: 'rain', 36: 'sun',
            37: 'rain', 38: 'rain', 39: 'rain', 40: 'rain', 41: 'snow',
            42: 'snow', 43: 'snow', 44: 'cloudy', 45: 'rain', 46: 'snow',
            47: 'rain'
        }


        function setCookie(cname, cvalue, exdays) {
            let d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        } 

        function getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
        
        let cookiesExist = false;
        let weather = getCookie("weather");
        if (weather == "") {
            // Get User Location and start app
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(setPosition, showError);
            }
        }
        else {
            cookiesExist = true;
            runApp(null)
        }

        function setPosition(position) {
            return fetch("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D%22(" 
                + position.coords.latitude + "%2C" + position.coords.longitude 
                + ")%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
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
                    alert("The request timed out.")
                    break;
                case error.UNKNOWN_ERROR:
                    alert("An unknown error occured.");
                    break
            }
        }

        function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
        }   

        function runApp(data) {
            
            $('#loading').hide();
            $('#container').show();
            $('#container').css('display', 'grid');
            
            let weatherText, temperature, code;

            if (cookiesExist) { // No Cookies
                weatherText = getCookie("weather");
                temperature = getCookie("temperature");
                code = getCookie("code");
            }
            else {
                weatherText = data.query.results.channel.item.condition.text;
                setCookie("weather", weatherText, (1/24)); // Set the cookie for 1 hour

                temperature = data.query.results.channel.item.condition.temp;
                setCookie("temperature", temperature, (1/24));

                code = parseInt(data.query.results.channel.item.condition.code);
                setCookie("code", code, (1/24));
            }

            let celsius = false;

            $('#weatherText').text(weatherText.toUpperCase());
            numTextChars = weatherText.length;
            $('#weatherText').css('font-size', (numTextChars / 3) + 'vw');

            $('#temperature').css('font-size', (numTextChars / 3) + 'vw');
            $('#temperature').html(temperature + '&#8457;');
            $('#temperature').click(function(){
                if (!celsius) {
                    temperature = (temperature - 32) * 5/9;
                    $('#temperature').html(Math.floor(temperature) + '&#8451;');
                }
                else {
                    temperature = (temperature * 9/5) + 32;
                    $('#temperature').html(Math.floor(temperature) + '&#8457;');
                }
                celsius = !celsius;
            });

            // ------------- Handle Todo List Stuff -------------------- //

            let todos = {};

            if (localStorage.getItem("todos") === null) {
                localStorage.setItem("todos", JSON.stringify(todos));
            }
            else {
                todos = JSON.parse(localStorage.getItem("todos"));
            }

            for (let key in todos) {
                if (todos[key].checked) {
                    $('#todoItems').append('<li class="checked" id="' + key + '">' + todos[key].text + '</li>');
                }
                else {
                    $('#todoItems').append('<li id="' + key + '">' + todos[key].text + '</li>');
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
                }
            }

            let list = document.getElementById('todoItems');
            list.addEventListener('click', function(e) {
                if (e.target.tagName === 'LI') {
                    e.target.classList.toggle('checked');
                    let id = e.target.id;
                    todos[id].checked = !todos[id].checked;
                    localStorage.setItem("todos", JSON.stringify(todos));
                }
            }, false);

            window.onkeyup = function(e) {
                let key = e.keycode ? e.keycode : e.which;
                if (key == 13) {
                    if ($('#todoInput').val().length > 0) {
                        // Gen unique ID
                        let uuid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase(); 
                                                
                        todos[uuid] = {
                            checked: false,
                            text: $('#todoInput').val()
                        };

                        localStorage.setItem("todos", JSON.stringify(todos));

                        let li = document.createElement("li");
                        li.setAttribute("id", uuid);

                        let t = document.createTextNode($('#todoInput').val());
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
                        }
                    }
                }
            }
            
            // ----------------------- Weather Animation Logic---------------------------- //

            let weather = weatherCodes[code];

            if (weather == 'rain') initRain(); 
            else if (weather == 'sun') initSun(); 
            else if (weather == 'snow') initSnow(); 
            else if (weather == 'cloudy') initCloudy(); 

            $(window).resize(function(){
                canvas.width = $(window).width();
                canvas.height = $(window).height();

                if (weather == 'rain') initRain(); 
                else if (weather == 'sun') initSun(); 
                else if (weather == 'snow') initSnow();
                else if (weather == 'cloudy') initCloudy();
            });

            setInterval(function(){
                if (weather == 'rain') {
                    requestAnimationFrame(drawRain);
                    drawRain();
                }
                else if (weather == 'sun') {
                    requestAnimationFrame(drawSun);
                    drawSun();
                }
                else if (weather == 'snow') {
                    requestAnimationFrame(drawSnow);
                    drawSnow();
                }
                else if (weather == 'cloudy') {
                    requestAnimationFrame(drawClouds);
                    drawClouds();
                }
            }, 1000/fps)
        }