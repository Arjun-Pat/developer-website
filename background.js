const DEBUG = false; //Set to true to see debug logs

window.onload = () => {
  const canvas = document.getElementById('background-canvas');
  const ctx = canvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  if (DEBUG) console.log("✅ Canvas initialized:", width, height);

  
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    if (DEBUG) console.log("✅ Canvas resized:", width, height);
  }

  resizeCanvas();

  // Triangle size (fixed)
  const triangleSize = 60;

  // Triangle grid storage
  const triangles = [];
  const maxActiveTriangles = 28;

  window.addEventListener('resize', () => {
    resizeCanvas();
    initTriangles();
  });

  // Initialize right-angled triangles in a grid
  function initTriangles() {
    triangles.length = 0;

    const cols = Math.ceil(width / triangleSize);
    const rows = Math.ceil(height / triangleSize);

    if (DEBUG) console.log("✅ Triangle grid initialized:", cols, "cols x", rows, "rows");

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * triangleSize;
        const y = row * triangleSize;

        for (let dir of ['bottom-right', 'top-left']) {
          for (let split = 0; split < 2; split++) {
            const baseOpacity = Math.random() * 0.07 + 0.03;
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
              fadeDelay: 0.0001,
              fadeTimer: 0
            });
          }
        }
      }
    }

    if (DEBUG) console.log("✅ Total triangles initialized:", triangles.length);
  }

  function drawTriangles() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    triangles.forEach(tri => {
      ctx.beginPath();
      if (tri.direction === 'bottom-right') {
        if (tri.splitIndex === 0) {
          ctx.moveTo(tri.x, tri.y);
          ctx.lineTo(tri.x + tri.size, tri.y);
          ctx.lineTo(tri.x, tri.y + tri.size);
        } else {
          ctx.moveTo(tri.x + tri.size, tri.y);
          ctx.lineTo(tri.x + tri.size, tri.y + tri.size);
          ctx.lineTo(tri.x, tri.y + tri.size);
        }
      } else if (tri.direction === 'top-left') {
        if (tri.splitIndex === 0) {
          ctx.moveTo(tri.x + tri.size, tri.y);
          ctx.lineTo(tri.x + tri.size, tri.y + tri.size);
          ctx.lineTo(tri.x, tri.y);
        } else {
          ctx.moveTo(tri.x, tri.y + tri.size);
          ctx.lineTo(tri.x + tri.size, tri.y + tri.size);
          ctx.lineTo(tri.x, tri.y);
        }
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(255,255,255, ${tri.opacity * tri.gradientFactor})`;
      ctx.fill();
    });
  }

  function updateTriangles(deltaTime) {
    let activeCount = 0;

    triangles.forEach(tri => {
      if (tri.animating) {
        tri.opacity += tri.fadeSpeed * tri.animationDirection * deltaTime;
        if (tri.opacity >= tri.baseOpacity + 0.2) {
          tri.opacity = tri.baseOpacity + 0.2;
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

    const toActivate = maxActiveTriangles - activeCount;
    const available = triangles.filter(tri => !tri.animating && tri.fadeTimer >= tri.fadeDelay);
    for (let i = 0; i < Math.min(toActivate, available.length); i++) {
      const tri = available[Math.floor(Math.random() * available.length)];
      tri.animating = true;
      tri.animationDirection = 1;
    }

    if (DEBUG && activeCount > 0) {
      console.log("✅ Active triangles animating:", activeCount);
    }
  }

  let lastTime = null;
  function animate(time) {
    if (!lastTime) lastTime = time;
    const deltaTime = time - lastTime;
    lastTime = time;

    updateTriangles(deltaTime);
    drawTriangles();
    requestAnimationFrame(animate);
  }

  // Run everything
  initTriangles();

  // Force-start a few triangles immediately
  for (let i = 0; i < 10; i++) {
    if (triangles[i]) {
      triangles[i].animating = true;
      triangles[i].animationDirection = 1;
    }
  }

  requestAnimationFrame(animate);
};
