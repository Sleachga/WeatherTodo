function initSun() {
    $("body").css("background-color", "#7EC6F6");
    
    sunPos = { 
        x: (5/6) * canvas.width,
        y: (1/6) * canvas.height
    };

    rayLen = Math.hypot(sunPos.x, canvas.height - sunPos.y);
}

const smallestRadius = 50;
let curRadius = smallestRadius;
let add = true;
let sunPos = {};

function drawSun() {
    if (add) curRadius+= 0.03;
    else curRadius-= 0.03;

    if (curRadius > smallestRadius + 20) add = false;
    if (curRadius < smallestRadius) add = true;

    // Fill the circle
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc(sunPos.x, sunPos.y, curRadius, 0, 2 * Math.PI);
    context.fillStyle = "rgba(255, 255, 255, 1)";
    context.fill();

    // Make the shadow
    context.strokeStyle = "#ffffff";
    context.shadowColor = '#ffffff';
    context.shadowBlur = 50;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.stroke();

    drawSunRays();
}

// Find the distance from center of sun to bottom left corner (furthest corner)
// Draw a ray to there and rotate it

class sunray {
    constructor(angle) {
        this.angle = angle;
    }
}

let rayLen = 0;
let sunrays = [0, 45, 90, 135, 180, 225, 270, 315];

function drawSunRays() {
    for (let i = 0; i < sunrays.length; i++) {
        context.beginPath();

        context.moveTo(sunPos.x, sunPos.y);
        
        context.lineTo(sunPos.x + rayLen * Math.cos(Math.PI * (sunrays[i] + 2) / 180), 
            sunPos.y + rayLen * Math.sin(Math.PI * (sunrays[i] + 2) / 180));
        
        context.lineTo(sunPos.x + rayLen * Math.cos(Math.PI * (sunrays[i] - 2) / 180), 
            sunPos.y + rayLen * Math.sin(Math.PI * (sunrays[i] - 2) / 180));
        
        context.lineTo(sunPos.x, sunPos.y);
        context.fillStyle = "#ffffff";
        context.fill();

        sunrays[i]+=0.1;
    }
}