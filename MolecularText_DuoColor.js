// ----- MOLECULAR TEXT -----
// Here we bedazzle our molecular text with connecting lines, much like the library particle.js does. We add color to our connecting lines.

const canvas = document.querySelector("#canvasMolecularText"); // this is the element that houses our canvas
const ctx = canvas.getContext("2d"); // this is our canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let adjustX = 15; // use this to move the text around
let adjustY = 24; // use this to move the text around
// const numberOfParticles = 1000;

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
ctx.fillText("Habibi", 0, 30); // coordinates for where the text should start being drawn

const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height); // here we get image data within the area (0, 0, 100, 100), which is (x, y, x2, y2)

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
    let force = (maxDistance - distance) / maxDistance; // this calculation takes any range of numbers and converts it to a range between 0 and 1. So here it will convert values between 0 and our maxDistance into a range of 0 to 1. This so that we can multiply the values inside the if statement below by this number and get particles to slow down as the distance between them and the mouse increases until they reach a speed of 0 as they reach the outer radius of the interaction circle radius around the mouse.
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
      if (this.x !== this.baseX) {
        // this if statement checks if a position of a particle is the same as its starting position, baseX. If it isn't, it will move back towards its starting position.
        let dx = this.x - this.baseX;
        this.x -= dx / 10; // change the value here to alter the speed at which the particles return to their starting positions
      }
      if (this.y !== this.baseY) {
        // this if statement checks if a position of a particle is the same as its starting position, baseY. If it isn't, it will move back towards its starting position.
        let dy = this.y - this.baseY;
        this.y -= dy / 10; // change the value here to alter the speed at which the particles return to their starting positions
      }
    }
  }
}

function init() {
  // its job is to take the particle class we just created and call it many times to fill the array with particle objects, and their positions are based on our image data
  particlesArray = [];
  for (let y = 0; y < textCoordinates.height; y++) {
    // textCoordinates.height, textCoordinates.width, and textCoordinates.data are properties we get from the getImageData method
    for (let x = 0; x < textCoordinates.width; x++) {
      if (
        textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
      ) {
        // the value 128 is roughtly 50% of the maximum 255 value for opacity (a.k.a. alpha. Usually its value is between 0 and 1, but in this data array it's between 0 and 255). So here we make the decision to add all pixels to our array that have more than 50% opacity. We can i.e. lower the value if we want to include pixels with less opacity.
        let positionX = x + adjustX; // positionX represents our pixels in rows that passed the opacity check
        let positionY = y + adjustY; // positionY represents our pixels in columns that passed the opacity check
        particlesArray.push(new Particle(positionX * 10, positionY * 10));
      }
    }
  }
}
init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].draw();
    particlesArray[i].update();
  }
  connect();
  requestAnimationFrame(animate);
}
animate();

function connect() {
  let opacityValue = 1;
  // this function is all we need to replicate the particle.js library with vanilla JavaScript
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let maxConnectedDistance = 25; // change this value if more and longer connected lines between the particles is desired

      if (distance < maxConnectedDistance) {
        opacityValue = 1 - distance / maxConnectedDistance;
        if (distance < maxConnectedDistance - 10) {
          ctx.strokeStyle = `rgba(0, 0, 119, ${opacityValue})`;
        } else {
          ctx.strokeStyle = `rgba(190, 80, 119, ${opacityValue})`;
        }
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}
