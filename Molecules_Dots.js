// ----- PARTICLE TRANSLATE ON MOUSEMOVE -----
// Here we create a bunch of particles on a canvas and make them move towards or away from the cursor when the cursor gets close. Attraction or repulsion on mousemove.

const canvas = document.querySelector("#canvasText"); // this is the element that houses our canvas
const ctx = canvas.getContext("2d"); // this is our canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 1000;

// Handle mouse
const mouse = {
  // we need this object to make our mouse cursor coordinates available all over our application, since event.x and event.y will only be available inside an eventListener.
  x: null,
  y: null,
  radius: 150, // this sets the radius around the mouse cursor inside which particles will start interacting with the cursor
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

ctx.fillStyle = "purple";
ctx.font = "40px Helvetica";
ctx.fillText("Jinx", 0, 40);

const data = ctx.getImageData(0, 0, 100, 100); // here we get image data within the area (0, 0, 100, 100), which is (x, y, x2, y2)

class Particle {
  constructor(x, y) {
    // all other arguments except x and y will be calculated here in the constructor, so no need to pass them as arguments as well
    this.x = x;
    this.y = y;
    this.size = 3; // this is the radius of each circle particle in px
    this.baseX = this.x; // this is the starting x position, which is necessary to define so that the particles can return to their original positions. It can also be set to x instead of this.x, but this allows us to define this.x as i.e. x + 100, right here in the constructor.
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1; // the random function will cause particles to move at different speeds
  }
  draw() {
    //   this is how we draw a circle on the canvas
    ctx.fillStyle = "#007";
    ctx.beginPath(); // analogous to putting the pencil on the canvas before starting to draw
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  update() {
    let dx = mouse.x - this.x; // this calculates the distance between two points along the x-axis. mouse.x is where the cursor is, and this.x is a certain particle's position we want to calculate the distance to.
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance; // equation for calculating distance between particle and cursor
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance; // this calculation takes any range of numbers and converts it to a range between 0 and 1. So here it will convert values between 0 and our maxDistance into a range of 0 to 1. This so that we can multiply the values inside the if statement below by this number and get particles to slow down as the distance between them and the mouse increases until the reach a speed of 0. As they reach the outer radius of the interaction circle radius around the mouse.
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;
    if (distance < mouse.radius) {
      //   this.size = 8; // this will increase the size of the particles near the cursor
      //   this.x += forceDirectionX * 3; // this will make the particles move towards the cursor
      //   this.y += forceDirectionY * 3; // this will make the particles move towards the cursor
      //   this.x += directionX; // this will make the particles move towards the cursor, with the speed being higher closer to the cursor
      //   this.y += directionY; // this will make the particles move towards the cursor, with the speed being higher closer to the cursor
      this.x -= directionX; // this will make the particles move away the cursor, dynamically
      this.y -= directionY; // this will make the particles move away the cursor, dynamically
    } else {
      //   this.size = 3;
    }
  }
}

function init() {
  // its job is to take the particle class we just created and call it many times to fill the array with randomized particle objects
  particlesArray = [];
  for (let i = 0; i < numberOfParticles; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    particlesArray.push(new Particle(x, y));
  }
}
init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].draw();
    particlesArray[i].update();
  }
  requestAnimationFrame(animate);
}
animate();
