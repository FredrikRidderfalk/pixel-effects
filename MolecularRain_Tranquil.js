// ----- PARTICLES FEATURING COLORS, DIFFERENT MOVE PATTERNS AND SHAPES -----
// ----- WE EXPERIMENT WITH FILTERS, BLEND MODES, AND GRADIENTS -----
// Here we create arc paths for the particles with some trigonometry

const myImage = new Image();
myImage.src = "images/ds-tranquil.jpg";

// This event listener applies a snowy rain to myImage
myImage.addEventListener("load", function () {
  const canvas = document.querySelector("#canvasMolecularRain"); // this is the element that houses our canvas
  const ctx = canvas.getContext("2d"); // this is our canvas
  canvas.width = 1280; // this needs to match the width in the css
  canvas.height = 720; // this needs to match the height in the css

  ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height); // Here, on the first page load, we draw the image on our canvas using the built-in HTML canvas drawImage method
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height); // Here we call getImageData on it (ctx, which is the canvas) to get information about all its pixels, and we save it to our custom pixels variable
  ctx.clearRect(0, 0, canvas.width, canvas.height); // after loading the image, we may not need it anymore, and can delete the original image with clearRect()

  let particlesArray = [];
  const numberOfParticles = 5000;

  let mappedImage = []; // the goal of this array is to hold a brightness value of each pixel in the image, along with its x and y coordinates so that we can compare it to the x and y coordinates of each particle, and adjust their movement speed accordingly
  for (let y = 0; y < canvas.height; y++) {
    let row = []; // this array holds the pixel data of each pixel in a row, and we have canvas.height number of rows
    for (let x = 0; x < canvas.width; x++) {
      const red = pixels.data[y * 4 * pixels.width + x * 4]; // this is just one of many valid formulas to get every fourth value from the image data. Red is the first value, then green, then blue, then alpha.
      const green = pixels.data[y * 4 * pixels.width + x * 4 + 1];
      const blue = pixels.data[y * 4 * pixels.width + x * 4 + 2];
      const brightness = calculateRelativeBrightness(red, green, blue);
      const cell = [
        (cellBrightness = brightness),
        (cellColor = "rgb(" + red + "," + green + "," + blue + ")"),
      ]; // each cell holds relative brightness value for individual pixels in the image. The cellColor can be used in the draw() function for ctx.fillStyle
      row.push(cell); // each cell array represents one pixel in the image
    }
    mappedImage.push(row);
  }

  //   The calculateRelativeBrightness function adjusts red, green, and blue colors so that they appear equally bright for the human eye at the same rgb values
  function calculateRelativeBrightness(red, green, blue) {
    return (
      Math.sqrt(
        red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114
      ) / 100
    );
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.speed = 0;
      this.velocity = Math.random() * 0.5;
      this.size = Math.random() * 1.5 + 0.5;
      this.position1 = Math.floor(this.y); // this is because array indexes need to be integers, not floats
      this.position2 = Math.floor(this.x); // this is because array indexes need to be integers, not floats
      this.angle = 0; // We want each particle to fluctuate depending on the brightness of the underlying area in the image
    }
    update() {
      // this runs once every frame
      this.position1 = Math.floor(this.y); // we need these in the update function to make sure that every time we update the x and y position, these values stay as whole numbers
      this.position2 = Math.floor(this.x); // we need these in the update function to make sure that every time we update the x and y position, these values stay as whole numbers
      if (
        mappedImage[this.position1] &&
        mappedImage[this.position1][this.position2]
      ) {
        this.speed = mappedImage[this.position1][this.position2][0]; // relative brightness is now reflected in this.speed
      } // This if statement makes sure that we only assign a speed if a particle is within the canvas area
      let movement = 2.55 - this.speed + this.velocity; // relative brightness is a number between 0 and 2.55. We want the dark particles with a value close to 0 move really fast, we take the maximum value of 2.55 and subtract this.speed. We also don't want particles with the same color to move exactly the same speed, so we randomize it somewhat by adding this.velocity.
      this.angle += this.speed / 20; // set it to ++ (+=1) for a vibration effect. The lower the value, the more clear we can see trailing circles being drawn on the canvas. 0.2 draws clear circles. We can also set it to this.speed for the speed to vary depending on how bright the underlying background is.

      //   this.y += this.velocity; // this creates snow/rain particles that doesn't interact with each other
      this.y += movement + Math.sin(this.angle) * 3; // change this for more/less wiggle effect
      this.x += movement + Math.cos(this.angle) * 3; // change this for more/less wiggle effect
      if (this.y >= canvas.height) {
        this.y = 0;
        this.x = Math.random() * canvas.width;
      }
      if (this.x >= canvas.width) {
        this.x = 0;
        this.y = Math.random() * canvas.height;
      }
    }
    draw() {
      ctx.beginPath();
      //   ctx.fillStyle = "white";
      if (
        mappedImage[this.position1] &&
        mappedImage[this.position1][this.position2]
      ) {
        ctx.fillStyle = mappedImage[this.position1][this.position2][1]; // in the very end we chose index position 1 instead of 0 since cellColor is the second item in the cell array. This makes us draw in color. Comment out and use "white" instead if desiring grayscale
      } // This if statement makes sure that we only assign a change the color of a particle if that particle is within the canvas area
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function init() {
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }
  init();
  function animate() {
    //ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height); // comment this out to make the image invisible, which creates a wonderful effect together with the particle waterfall effect

    // the next 3 lines give particles fade-in trails
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 0.2; // if we add this here with a new value, we change the fade-in trails after the image has been drawn
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      ctx.globalAlpha = particlesArray[i].speed * 0.5; // Change the value 0.5 to change the speed. Comment this out to maintain a more consistent waterfall effect over the whole image
      particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
});
