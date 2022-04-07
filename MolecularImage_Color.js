// ----- MOLECULAR TEXT -----
// Here we transform our molecular text into bubbles *blub blub*

// ------ SETUP ------
const canvas = document.querySelector("#canvasMolecularImage"); // Our canvas element
const ctx = canvas.getContext("2d"); // Our canvas that contains a myriad of built-in methods
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// document.querySelector("body").style.backgroundColor = "#00162f";

let particlesArray = [];

// ------ HANDLE MOUSE ------
const mouse = {
  // we need this object to make our mouse cursor coordinates available all over our application, since event.x and event.y will only be available inside an eventListener.
  x: undefined,
  y: undefined,
  radius: 100, // Radius for interaction zone surrounding the mouse cursor
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

function drawImage() {
  let imageWidth = png.width;
  let imageHeight = png.height;
  const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  class Particle {
    constructor(x, y, color, size) {
      // All other arguments except x and y will be calculated here in the constructor, so no need to pass them as arguments
      this.x = x + canvas.width / 2 - png.width * 2;
      this.y = y + canvas.height / 2 - png.height * 2;
      this.color = color;
      this.size = 2;
      this.baseX = x + canvas.width / 2 - png.width * 2;
      this.baseY = y + canvas.height / 2 - png.height * 2;
      this.density = Math.random() * 10 + 2;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
    update() {
      // This is where we calculate particle movement and cursor interactions

      ctx.fillStyle = this.color;

      // Collision detection
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      this.distance = distance;
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density * 0.6;
      let directionY = forceDirectionY * force * this.density * 0.6;

      // --- EFFECTS ---
      if (distance < mouse.radius + this.size) {
        this.x -= directionX; // Repulsion effect
        this.y -= directionY; // Repulsion effect
      } else {
        if (this.x !== this.baseX) {
          // Retraction effect
          let dx = this.x - this.baseX;
          this.x -= dx / 20; // Retraction speed
        }
        if (this.y !== this.baseY) {
          // Retraction effect
          let dy = this.y - this.baseY;
          this.y -= dy / 20; // Retraction speed
        }
      }
      this.draw();
    }
  }

  // ------ INIT FUNCTION ------
  function init() {
    // This function takes the Particle class and calls it many times to fill the array with particle objects
    particlesArray = [];
    for (let y = 0; y < data.height; y++) {
      for (let x = 0; x < data.width; x++) {
        if (data.data[y * 4 * data.width + x * 4 + 3] > 128) {
          let positionX = x; // positionX represents our pixels in rows that passed the opacity check
          let positionY = y; // positionY represents our pixels in columns that passed the opacity check
          let color = `rgb(${data.data[y * 4 * data.width + x * 4]}, ${
            data.data[y * 4 * data.width + x * 4 + 1]
          }, ${data.data[y * 4 * data.width + x * 4 + 2]})`;
          particlesArray.push(
            new Particle(positionX * 4, positionY * 4, color)
          );
        }
      }
    }
  }
  init();

  // ------ ANIMATE FUNCTION ------
  function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
  }
  init();
  animate();

  window.addEventListener("resize", function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
  });
}

const png = new Image();
png.src = "images/apple.png";

window.addEventListener("load", (event) => {
  ctx.drawImage(png, 0, 0);
  drawImage();
});