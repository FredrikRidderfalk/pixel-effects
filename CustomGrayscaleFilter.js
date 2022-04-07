const canvas = document.querySelector("#canvasGrayScale");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ---------- IMAGE ----------

const image1 = new Image();
image1.src = "images/futureworks.png";

// --- GRAYSCALE IMAGE FILTER ---

// This event listener applies a grayscale filter to image1. It works just like JavaScript's filter method 'grayscale'.
image1.addEventListener("load", function () {
  ctx.drawImage(image1, 0, 0, canvas.width, canvas.height); // If the image is the same size as the canvas, the drawImage function only needs the first two arguments.
  const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  console.log("scannedImage", scannedImage); // Here we find the array data containing the rgba color of each pixel, defined as a number between 0 and 255, even the alpha value that usually has a value between 0 and 1, not 0 and 255. The first value defines the r(red), the second the g(green), the third the b(blue), and the forth the a(alpha).
  const scannedData = scannedImage.data;
  for (let i = 0; i < scannedData.length; i += 4) {
    const total = scannedData[i] + scannedData[i + 1] + scannedData[i + 2];
    const averageColorValue = total / 3;
    scannedData[i] = averageColorValue; //add i.e. + 154 to averageColorValue to change the color it will have to bright red.
    scannedData[i + 1] = averageColorValue;
    scannedData[i + 2] = averageColorValue;
  }
  scannedImage.data = scannedData;
  ctx.putImageData(scannedImage, 0, 0);
});
