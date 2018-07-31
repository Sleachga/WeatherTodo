let snowParticles = [];

function initSnow() {
    $("body").css("background-color", "#061928");
    context.strokeStyle = '#8398AD';
    context.lineCap = 'round';

    let init = [];
    let maxParts = canvas.width/3;

    for (let i = 0; i < maxParts; i++) {
        init.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 2,
            xs: Math.random() * 1 - 0.5,
            ys: Math.random() + 0.3,
        })
    }

    for (let i = 0; i < maxParts; i++) {
        snowParticles[i] = init[i];
    }
}

function drawSnow() {

    let now = new Date().getTime(),
        dt = now - (time || now);

    time = now;

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < snowParticles.length; i++) {
        let p = snowParticles[i]
        context.lineWidth = p.width;
        context.beginPath();
        context.moveTo(p.x, p.y);
        context.arc(p.x, p.y, snowParticles[i].radius, 0, 2 * Math.PI);
        context.fillStyle = '#ffffff';
        context.fill();
    }

    moveSnow();
}

function moveSnow() {
    for (let i = 0; i < snowParticles.length; i++) {
        let p = snowParticles[i];
        
        p.x += p.xs;
        p.y += p.ys;
        
        if (p.x > canvas.width || p.y > canvas.height) {
            p.x = Math.random() * canvas.width;
            p.y = -20;
        }
    }
}