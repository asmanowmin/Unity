const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restart-button');

const circles = [];
const linePoints = [];

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;

function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

function drawLine() {
    ctx.beginPath();
    ctx.moveTo(linePoints[0].x, linePoints[0].y);
    for (let i = 1; i < linePoints.length; i++) {
        ctx.lineTo(linePoints[i].x, linePoints[i].y);
    }
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
}

function clearCirclesInLine() {
    for (let i = circles.length - 1; i >= 0; i--) {
        const circle = circles[i];
        for (let j = 1; j < linePoints.length; j++) {
            const p1 = linePoints[j - 1];
            const p2 = linePoints[j];
            if (isCircleIntersectingLine(circle, p1, p2)) {
                circles.splice(i, 1);
                break;
            }
        }
    }
}

function isCircleIntersectingLine(circle, p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const px = p1.x + dx * ((circle.x - p1.x) * dx + (circle.y - p1.y) * dy) / (len * len);
    const py = p1.y + dy * ((circle.x - p1.x) * dx + (circle.y - p1.y) * dy) / (len * len);
    return Math.sqrt((circle.x - px) * (circle.x - px) + (circle.y - py) * (circle.y - py)) <= circle.radius;
}

function spawnRandomCircles(numCircles) {
    for (let i = 0; i < numCircles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 20 + Math.random() * 30;
        circles.push({ x, y, radius });
        drawCircle(x, y, radius);
    }
}

canvas.addEventListener('mousedown', (event) => {
    linePoints.push({ x: event.clientX, y: event.clientY });
    canvas.addEventListener('mousemove', onMouseMove);
});

canvas.addEventListener('mouseup', () => {
    canvas.removeEventListener('mousemove', onMouseMove);
    drawLine();
    clearCirclesInLine();
    linePoints.length = 0;
});

restartButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.length = 0;
    spawnRandomCircles(Math.floor(Math.random() * 6) + 5);
});

function onMouseMove(event) {
    linePoints.push({ x: event.clientX, y: event.clientY });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLine();
    for (const circle of circles) {
        drawCircle(circle.x, circle.y, circle.radius);
    }
}
