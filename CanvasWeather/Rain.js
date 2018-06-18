let particles = [];

function initRain() {
    context.strokeStyle = '#8398AD';
    context.lineCap = 'round';

    let init = [];
    let maxParts = 1000;

    for (let i = 0; i < maxParts; i++) {
        init.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            len: Math.random() * 0.7,
            width: Math.random() * 2,
            xs: Math.random() * 1 - 0.5,
            // xs: -4 + Math.random() * 4 + 2,
            ys: Math.random() * 10 + 15
        })
    }

    for (let i = 0; i < maxParts; i++) {
        particles[i] = init[i];
    }
}

function drawRain() {
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i]
        context.lineWidth = p.width;
        context.beginPath();
        context.moveTo(p.x, p.y);
        context.lineTo(p.x + p.len * p.xs, p.y + p.len * p.ys);
        context.stroke();
    }

    moveRain();
}

function moveRain() {
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.xs;
        p.y += p.ys;
        if (p.x > canvas.width || p.y > canvas.height) {
            p.x = Math.random() * canvas.width;
            p.y = -20;
        }
    }
}