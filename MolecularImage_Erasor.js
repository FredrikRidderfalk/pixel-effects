// ----- MOLECULAR TEXT -----
// Here we transform our molecular text into bubbles *blub blub*

// ------ SETUP ------
const canvas = document.querySelector("#canvasMolecularImage"); // Our canvas element
const ctx = canvas.getContext("2d"); // Our canvas that contains a myriad of built-in methods
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.querySelector("body").style.backgroundColor = "#000";

let particlesArray = [];
let adjustX = 30; // use this to move the text around
let adjustY = 15; // use this to move the text around

// ------ HANDLE MOUSE ------
const mouse = {
  // we need this object to make our mouse cursor coordinates available all over our application, since event.x and event.y will only be available inside an eventListener.
  x: undefined,
  y: undefined,
  radius: 42, // Radius for interaction zone surrounding the mouse cursor
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

function drawImage() {
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = 2;
      this.baseX = this.x;
      this.baseY = this.y;
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
        this.x -= directionX * mouse.radius; // Repulsion effect
        this.y -= directionY * mouse.radius; // Repulsion effect
        this.size = 1;
      } else {
        if (this.x !== this.baseX) {
          // Retraction effect
          let dx = this.x - this.baseX;
          this.x -= dx / 20; // Retraction speed
          this.size = Math.random() * 2;
        }
        if (this.y !== this.baseY) {
          // Retraction effect
          let dy = this.y - canvas.height; // subtracting with canvas.height here knocks the pixels down to the "ground"
          this.y -= dy / 20; // Retraction speed
          this.size = Math.random() * 2;
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
          let positionX = x + adjustX; // positionX represents our pixels in rows that passed the opacity check
          let positionY = y + adjustY; // positionY represents our pixels in columns that passed the opacity check
          let color = `rgb(${data.data[y * 4 * data.width + x * 4]}, ${
            data.data[y * 4 * data.width + x * 4 + 1]
          }, ${data.data[y * 4 * data.width + x * 4 + 2]})`;
          particlesArray.push(
            new Particle(positionX * 6, positionY * 6, color)
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
png.src = "images/woman.jpg";

window.addEventListener("load", (event) => {
  ctx.drawImage(png, 0, 0);
  drawImage();
});
