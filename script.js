"use strict";
const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const thresholdSlider = document.getElementById("threshold");
const blurSlider = document.getElementById("blur");
const downloadBtn = document.getElementById("download");
const thresholdValue = document.getElementById("thresholdValue");
const blurValue = document.getElementById("blurValue");

let img = new Image();

function processImage() {
  // return if cv or img is't downloaded
  if (!cv || !img.complete) return;
  // fit canvas to keep the actual size of an image to avoid scaling
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
  blurValue.textContent = parseInt(blurSlider.value);
  thresholdValue.textContent = parseInt(thresholdSlider.value);
  // console.log(parseInt(thresholdSlider.value));
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
