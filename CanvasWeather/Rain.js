let particles = [];

function initRain() {
     
    canvas.strokeStyle = 'rgba(174,194,224,0.5)';
    canvas.lineWidth = 1;
    canvas.lineCap = 'round';

    let init = [];
    let maxParts = 1000;

    for (let i = 0; i < maxParts; i++) {
        init.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            len: Math.random() * 1,
            xs: -4 + Math.random() * 4 + 2,
            ys: Math.random() * 10 + 10
        })
    }

    for (let i = 0; i < maxParts; i++) {
        particles[i] = init[i];
    }
}

function drawRain() {
    requestAnimationFrame(drawRain);

    // Set NOW and DELTA
    now = Date.now()
    delta = now - then;

    // New frame
    if (delta > interval) {
        then = now - (delta % interval);
        canvas.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i]
            canvas.beginPath();
            canvas.moveTo(p.x, p.y);
            canvas.lineTo(p.x + p.len * p.xs, p.y + p.len * p.ys);
            canvas.stroke();
        }

        moveRain();
    }
}

function moveRain() {

    requestAnimationFrame(moveRain);

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