function initSun() {
    $("body").css("background-color", "#7EC6F6");
}

const smallestRadius = 50;
let curRadius = smallestRadius;
let add = true;

function drawSun() {
    if (add) curRadius+= 0.05;
    else curRadius-= 0.05;

    if (curRadius > smallestRadius + 30) add = false;
    if (curRadius < smallestRadius) add = true;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc((5/6) * canvas.width, (1/6) * canvas.height, curRadius, 0, 2 * Math.PI);
    context.fillStyle = "rgba(255, 255, 255, 1)";
    context.fill();
}