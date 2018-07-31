let rainParticles = [];

function initRain() {
    $("body").css("background-color", "#061928");
    context.strokeStyle = '#8398AD';
    context.lineCap = 'round';

    let init = [];
    let maxParts = canvas.width;

    for (let i = 0; i < maxParts; i++) {
        init.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            len: Math.random() * 2 + 2,
            width: Math.random() * 1,
            xs: Math.random() * 0.4 - 0.2,
            ys: Math.random() * 5 + 4,
        })
    }

    for (let i = 0; i < maxParts; i++) {
        rainParticles[i] = init[i];
    }
}

function drawRain() {

    let now = new Date().getTime(),
        dt = now - (time || now);

    time = now;

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < rainParticles.length; i++) {
        let p = rainParticles[i]
        context.lineWidth = p.width;
        context.beginPath();
        context.moveTo(p.x, p.y);
        context.lineTo(p.x + p.len * p.xs, p.y + p.len * p.ys);
        context.stroke();
    }

    moveRain();
}

function moveRain() {
    for (let i = 0; i < rainParticles.length; i++) {
        let p = rainParticles[i];
        
        p.x += p.xs;
        p.y += p.ys;
        
        if (p.x > canvas.width || p.y > canvas.height) {
            p.x = Math.random() * canvas.width;
            p.y = -20;
        }
    }
}