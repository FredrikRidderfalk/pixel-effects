// ----- MOLECULAR TEXT -----
// Here we transform our molecular text into bubbles *blub blub*

// ------ SETUP ------
const canvas = document.querySelector("#canvasMolecularText"); // Our canvas element
const ctx = canvas.getContext("2d"); // Our canvas that contains a myriad of built-in methods
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.querySelector("body").style.backgroundColor = "#00162f";

let particlesArray = [];
let adjustX = 15; // use this to move the text around
let adjustY = 24; // use this to move the text around
ctx.lineWidth = 3;

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

// ------ TEXT ------
// ctx.fillStyle = "#007";
ctx.font = "40px Helvetica";
ctx.fillText("Habibi", 0, 30); // Text and x y coordinates for where the text starts

// ------ GET CANVAS DATA ------
const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height); // Get image data within the area (x, y, x2, y2)

// ------ CLASS AS BLUEPRINT ------
class Particle {
  constructor(x, y) {
    // All other arguments except x and y will be calculated here in the constructor, so no need to pass them as arguments
    this.x = x;
    this.y = y;
    this.size = 4; // Circle radius in px
    this.baseX = this.x; // Starting x position
    this.baseY = this.y; // Starting y position
    this.density = Math.random() * 8 + 1; // the random function will cause particles to move at different speeds
    this.distance;
  }
  draw() {
    // Custom gradient
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "green");
    gradient.addColorStop(0.5, "cyan");
    gradient.addColorStop(1, "orange");

    // --- DRAWING ---
    ctx.fillStyle = gradient;
    ctx.beginPath(); // analogous to putting the pencil on the canvas before starting to draw
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  update() {
    // --- CALCULATIONS ---
    let dx = mouse.x - this.x; // this calculates the distance between two points along the x-axis. mouse.x is where the cursor is, and this.x is a certain particle's position we want to calculate the distance to.
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    this.distance = distance; // Saves the variable 'distance' to our class constructor method
    let forceDirectionX = dx / distance; // equation for calculating distance between particle and cursor
    let forceDirectionY = dy / distance; // equation for calculating distance between particle and cursor
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    // --- EFFECTS ---
    if (distance < mouse.radius) {
      this.x -= directionX * mouse.radius; // Repulsion effect
      this.y -= directionY * mouse.radius; // Repulsion effect
      this.size = 2;
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
  }
}

// ------ INIT FUNCTION ------
function init() {
  // This function takes the Particle class and calls it many times to fill the array with particle objects
  particlesArray = [];
  for (let y = 0; y < textCoordinates.height; y++) {
    for (let x = 0; x < textCoordinates.width; x++) {
      if (
        textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
      ) {
        let positionX = x + adjustX; // positionX represents our pixels in rows that passed the opacity check
        let positionY = y + adjustY; // positionY represents our pixels in columns that passed the opacity check
        particlesArray.push(new Particle(positionX * 10, positionY * 10));
      }
    }
  }
}
init();

// ------ ANIMATE FUNCTION ------
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].draw();
    particlesArray[i].update();
  }
  requestAnimationFrame(animate);
}
animate();
