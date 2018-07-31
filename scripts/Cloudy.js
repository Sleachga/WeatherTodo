let clouds = []

function initCloudy() {
    clouds = [];

    numClouds = Math.floor(canvas.width/80) - 3;
    if (numClouds < 4) {
        numClouds = 4;
    }

    $("body").css("background-color", "#7EC6F6");

    minimumSpeed = 0.05

    for (let i = 0; i < numClouds; i++) {    
        cloud = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() >= 0.5 ? (-1 * ((Math.random() * 0.1) + minimumSpeed)) : (Math.random() * 0.1) + minimumSpeed
        };
        clouds.push(cloud);
    }
}

function drawCloud(cloud){
    context.beginPath();
    context.arc(cloud.x, cloud.y, 50, 0, 2 * Math.PI);
    context.arc(cloud.x + 30, cloud.y - 50, 30, 0, 2 * Math.PI);
    context.arc(cloud.x + 110, cloud.y - 40, 70, 0, 2 * Math.PI);
    context.arc(cloud.x + 180, cloud.y, 50, 0, 2 * Math.PI);
    context.fillStyle = "rgba(255, 255, 255, 1)";
    context.rect(cloud.x, cloud.y - 10, 180, 60);
    context.fill();
    
    // Make the shadow
    context.strokeStyle = "rgba(255, 255, 255, 0)";
    context.shadowColor = '#7D8A84';
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.stroke();
}

function drawClouds() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Clouds
    for (let i = 0; i < clouds.length; i++) {
        drawCloud(clouds[i], context);
    }

    // Handle movement
    for (let i = 0; i < clouds.length; i++) {

        // If off screen to the left move to correct spot
        if (clouds[i].x < -245) {
            clouds[i].x = canvas.width + 45;
        }

        // if off screen to the right move to correct spot
        if (clouds[i].x > canvas.width + 80) {
            clouds[i].x = -215;
        }

        clouds[i].x += clouds[i].speed;
    }
}