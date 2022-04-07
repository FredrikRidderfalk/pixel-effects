// ----- MOLECULAR ZERO-G -----
// Here we replicate the particle.js effect

// ------ SETUP ------
const canvas = document.getElementById("canvasMolecularZeroGParticles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

// ------ HANDLE MOUSE ------
const mouse = {
  // we need this object to make our mouse cursor coordinates available all over our application, since event.x and event.y will only be available inside an eventListener.
  x: undefined,
  y: undefined,
  radius: (canvas.height / 80) * (canvas.width / 80), // Radius for interaction zone surrounding the mouse cursor
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

// ------ CLASS AS BLUEPRINT ------
// Creates particles
class Particle {
  constructor(x, y, directionX, directionY, size, color, opacity) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
    this.opacity = opacity;
  }
  // Method to draw individual particles
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = `rgba(245, 155, 235, ${this.opacity})`;
    ctx.fill();
  }
  // Method to check mouse position, particle position, to move the particle, and call draw()
  update() {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // --- CALCULATIONS ---
    let dx = mouse.x - this.x; // this calculates the distance between two points along the x-axis. mouse.x is where the cursor is, and this.x is a certain particle's position we want to calculate the distance to.
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // --- EFFECTS ---
    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 10;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 10;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 10;
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 10;
      }
    }
    // MOVEMENT
    this.x += this.directionX / 2;
    this.y += this.directionY / 2;

    // Draw particles
    this.draw();
  }
}

// Fill the particle array
function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.width * canvas.height) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 5 + 1;
    let opacity = Math.random();
    let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
    let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
    let directionX = Math.random() * 5 - 2.5;
    let directionY = Math.random() * 5 - 2.5;
    let color = "#8C5523";
    particlesArray.push(
      new Particle(x, y, directionX, directionY, size, color, opacity)
    );
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

function connect() {
  let opacityValue = 1;
  // this function is all we need to replicate the particle.js library with vanilla JavaScript
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let maxConnectedDistance = (canvas.width / 100) * (canvas.height / 100); // change this value if more and longer connected lines between the particles is desired

      if (distance < maxConnectedDistance) {
        opacityValue = 1 - distance / maxConnectedDistance;
        ctx.strokeStyle = `rgba(90, 90, 90, ${opacityValue})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        // ctx.globalAlpha = 1;
        ctx.stroke();
        // ctx.globalAlpha = 0;
      }
    }
  }
}

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  mouse.radius = (canvas.height / 80) * (canvas.width / 80);
  particlesArray = [];
  init();
});

window.addEventListener("mouseout", function () {
  mouse.x = undefined;
  mouse.y = undefined;
});

init();
animate();
