// Uncomment connect() for an additional geometrical effect

const canvas = document.getElementById("canvasMolecularZeroG");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let numberOfParticles = 20;
const particlesArray = [];

// ------ IMAGE SETUP ------
const img = new Image();
img.src = "images/cube.png";
const imgWidth = 512;
const imgHeight = 512;

const img2 = new Image();
img2.src = "images/pyramid.png";
const img2Width = 725;
const img2Height = 571;

const img3 = new Image();
img3.src = "images/ball.png";
const img3Width = 256;
const img3Height = 243;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 10 + 4;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.opacity = 1;
    this.randomImg = Math.floor(Math.random() * 3 + 1);
  }
  draw() {
    if (this.randomImg === 1) {
      ctx.drawImage(
        img,
        0,
        0,
        imgWidth,
        imgHeight,
        this.x,
        this.y,
        this.radius * 3,
        this.radius * 3
      );
    } else if (this.randomImg === 2) {
      ctx.drawImage(
        img2,
        0,
        0,
        img2Width,
        img2Height,
        this.x,
        this.y,
        this.radius * 3,
        this.radius * 3
      );
    } else {
      ctx.drawImage(
        img3,
        0,
        0,
        img3Width,
        img3Height,
        this.x,
        this.y,
        this.radius * 3,
        this.radius * 3
      );
    }
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.radius > 11) {
      this.opacity = 0.6;
    }
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y + this.radius > canvas.height || this.y + this.radius < 0) {
      this.speedY = -this.speedY;
    }
    this.draw();
  }
}
function init() {
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  //   connect();
  requestAnimationFrame(animate);
}
init();
animate();

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particlesArray = [];
  init();
});

function connect() {
  let opacityValue = 1;
  // this function is all we need to replicate the particle.js library with vanilla JavaScript
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let maxConnectedDistance = 200; // change this value if more and longer connected lines between the particles is desired

      if (distance < maxConnectedDistance) {
        opacityValue = 1 - distance / maxConnectedDistance;
        ctx.strokeStyle = `rgba(20, 220, 220, ${opacityValue})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x - 50, particlesArray[a].y - 50);
        ctx.lineTo(particlesArray[b].x - 50, particlesArray[b].y - 50);
        ctx.stroke();
      }
    }
  }
}
