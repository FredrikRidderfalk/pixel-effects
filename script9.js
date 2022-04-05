// ---------- EFFECT 5 ----------
// ----- PARTICLE MANIPULATION ON MOUSEMOVE -----
// Here we create a bunch of particles on a canvas and manipulate them with our update() function's if statement. We're saying "if the particles are less than a certain distance from the mouse cursor, do something to the particles like change their size, and change it back when the cursor moves away again (although this is optional)"

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
  //   console.log(mouse.x, mouse.y);
});

ctx.fillStyle = "darkBlue";
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
    ctx.fillStyle = "turquoise";
    ctx.beginPath(); // analogous to putting the pencil on the canvas before starting to draw
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  update() {
    let dx = mouse.x - this.x; // this calculates the distance between two points along the x-axis. mouse.x is where the cursor is, and this.x is a certain particle's position we want to calculate the distance to.
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) {
      this.size = 8;
    } else {
      this.size = 3;
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
