"use strict";
const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const thresholdSlider = document.getElementById("threshold");
const blurSlider = document.getElementById("blur");
const downloadBtn = document.getElementById("download");

let img = new Image();

function processImage() {
  if (!cv || !img.complete) return;
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  let src = cv.imread(canvas);
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);

  // Apply Gaussian blur
  let ksize = parseInt(blurSlider.value);
  if (ksize % 2 === 0) ksize += 1; // must be odd
  let blurred = new cv.Mat();
  cv.GaussianBlur(src, blurred, new cv.Size(ksize, ksize), 0);

  // Apply threshold
  let dst = new cv.Mat();
  cv.threshold(blurred, dst, +thresholdSlider.value, 255, cv.THRESH_BINARY);

  cv.imshow(canvas, dst);
  src.delete();
  dst.delete();
  blurred.delete();
}

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  img.src = URL.createObjectURL(file);
  img.onload = processImage;
});

thresholdSlider.oninput = processImage;
blurSlider.oninput = processImage;

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "processed_image.png";
  link.href = canvas.toDataURL();
  link.click();
});
