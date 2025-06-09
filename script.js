const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// Triangle size (fixed)
const triangleSize = 60;

// Triangle grid storage
const triangles = [];
const maxActiveTriangles = 35; // max triangles animating at once

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  initTriangles();
});

// Initialize right-angled triangles in a grid
function initTriangles() {
  triangles.length = 0; // clear all existing triangles

  const cols = Math.ceil(width / triangleSize);
  const rows = Math.ceil(height / triangleSize);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * triangleSize;
      const y = row * triangleSize;

      // Split each direction triangle into two smaller ones
      for (let dir of ['bottom-right', 'top-left']) {
        for (let split = 0; split < 2; split++) {
          const baseOpacity = Math.random() * 0.02 + 0.01;
          const gradientFactor = 1 - ((x / width + y / height) / 2) * 0.6;

          triangles.push({
            x,
            y,
            size: triangleSize,
            direction: dir,
            splitIndex: split,
            baseOpacity,
            opacity: baseOpacity,
            gradientFactor,
            animating: false,
            animationDirection: 1,
            fadeSpeed: Math.random() * 0.00008 + 0.000005,
            fadeDelay: Math.random() * 5000 + 2000, // 2-7 seconds
            fadeTimer: 0
          });
        }
      }
    }
  }
}

// Draw triangles
function drawTriangles() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  triangles.forEach(tri => {
    ctx.beginPath();
    if (tri.direction === 'bottom-right') {
      if (tri.splitIndex === 0) {
        // Left small triangle
        ctx.moveTo(tri.x, tri.y);
        ctx.lineTo(tri.x + tri.size, tri.y);
        ctx.lineTo(tri.x, tri.y + tri.size);
        ctx.closePath();
      } else {
        // Right small triangle
        ctx.moveTo(tri.x + tri.size, tri.y);
        ctx.lineTo(tri.x + tri.size, tri.y + tri.size);
        ctx.lineTo(tri.x, tri.y + tri.size);
        ctx.closePath();
      }
    } else if (tri.direction === 'top-left') {
      if (tri.splitIndex === 0) {
        // Top small triangle
        ctx.moveTo(tri.x + tri.size, tri.y);
        ctx.lineTo(tri.x + tri.size, tri.y + tri.size);
        ctx.lineTo(tri.x, tri.y);
        ctx.closePath();
      } else {
        // Bottom small triangle
        ctx.moveTo(tri.x, tri.y + tri.size);
        ctx.lineTo(tri.x + tri.size, tri.y + tri.size);
        ctx.lineTo(tri.x, tri.y);
        ctx.closePath();
      }
    }
    ctx.fillStyle = `rgba(255,255,255, ${tri.opacity * tri.gradientFactor})`;
    ctx.fill();
  });
}

// Update triangle opacities and control animation
function updateTriangles(deltaTime) {
  let activeCount = 0;

  triangles.forEach(tri => {
    if (tri.animating) {
      tri.opacity += tri.fadeSpeed * tri.animationDirection * deltaTime;
      if (tri.opacity >= tri.baseOpacity + 0.1) {
        tri.opacity = tri.baseOpacity + 0.1;
        tri.animationDirection = -1;
      }
      if (tri.opacity <= tri.baseOpacity) {
        tri.opacity = tri.baseOpacity;
        tri.animating = false;
        tri.fadeTimer = 0;
      }
      activeCount++;
    } else {
      tri.fadeTimer += deltaTime;
    }
  });

  // Activate new triangles if needed
  const toActivate = maxActiveTriangles - activeCount;
  if (toActivate > 0) {
    const available = triangles.filter(tri => !tri.animating && tri.fadeTimer >= tri.fadeDelay);
    for (let i = 0; i < Math.min(toActivate, available.length); i++) {
      const tri = available[Math.floor(Math.random() * available.length)];
      tri.animating = true;
      tri.animationDirection = 1;
    }
  }
}

let lastTime = performance.now();
function animate(time) {
  const deltaTime = time - lastTime;
  lastTime = time;
  updateTriangles(deltaTime);
  drawTriangles();
  requestAnimationFrame(animate);
}

// Initialize and animate
initTriangles();
animate();
