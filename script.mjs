"use strict";

state = {
  view: "simpleThreshold",
};

// import { adaptiveThresholdView } from "./views/adaptiveThresholding.mjs";
const upload = document.getElementById("upload");

const canvasOriginal = document.getElementById("canvasOriginal");
const canvasProcessed = document.getElementById("canvasProcessed");
const ctxOriginal = canvasOriginal.getContext("2d", {
  willReadFrequently: true,
});

const getThresholdSlider = () => document.getElementById("threshold");
const getBlurSlider = () => document.getElementById("blur");
const getBlockSizeSlider = () => document.getElementById("blockSize");
const getCSlider = () => document.getElementById("c");

const downloadBtn = document.getElementById("download");
const thresholdValue = document.getElementById("thresholdValue");
const adaptiveThresholdValue = document.getElementById(
  "adaptiveThresholdValue"
);

const cValue = document.getElementById("cValue");

const showButton = document.getElementById("showButton");
// showButton.addEventListener("click", adaptiveThresholdView());

let img = new Image();

function drawOriginal() {
  canvasOriginal.width = img.width;
  canvasOriginal.height = img.height;
  ctxOriginal.drawImage(img, 0, 0);
}

function processImage() {
  // return if cv or img is't downloaded
  if (!cv || !img.complete) return;

  drawOriginal();
  // fit canvas to keep the actual size of an image to avoid scaling
  canvasProcessed.width = img.width;
  canvasProcessed.height = img.height;

  let src = cv.imread(canvasOriginal);
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);

  // Apply Gaussian blur
  let ksize = parseInt(getBlurSlider().value);
  if (ksize % 2 === 0) ksize += 1; // must be odd
  let blurred = new cv.Mat();
  cv.GaussianBlur(src, blurred, new cv.Size(ksize, ksize), 0);

  // // Apply threshold
  let dst = new cv.Mat();
  cv.threshold(
    blurred,
    dst,
    +getThresholdSlider().value,
    255,
    cv.THRESH_BINARY
  );

  // Apply adaptive threshold
  // let blockSize = parseInt(blockSizeSlider.value);

  // if (blockSize % 2 === 0) blockSize += 1;
  // let c = parseInt(cSlider.value);
  // console.log(blockSize, c);
  // let dst = new cv.Mat();
  // cv.adaptiveThreshold(
  //   blurred,
  //   dst,
  //   255,
  //   cv.ADAPTIVE_THRESH_GAUSSIAN_C,
  //   cv.THRESH_BINARY,
  //   blockSize,
  //   c
  // );

  cv.imshow(canvasProcessed, dst);
  src.delete();
  dst.delete();
  blurred.delete();
  console.log(thresholdValue);
  // blurValue.textContent = parseInt(blurSlider.value);
  thresholdValue.textContent = parseInt(thresholdSlider.value);
  // blockSizeValue.textContent = parseInt(blockSizeSlider.value);
  // cValue.textContent = parseInt(cSlider.value);
}

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  img.src = URL.createObjectURL(file);

  img.onload = processImage;
});

// blockSizeSlider.oninput = processImage;
// cSlider.oninput = processImage;

// downloadBtn.addEventListener("click", () => {
//   const link = document.createElement("a");
//   link.download = "processed_image.png";
//   link.href = canvasProcessed.toDataURL();
//   link.click();
// });

function renderSimpleThresholdView() {
  let simpleTemplate = document
    .getElementById("simpleThresholdcontrolsTemplate")
    .content.cloneNode(true);
  const container = document.querySelector(".controls");
  container.replaceChildren(simpleTemplate);
  getThresholdSlider().oninput = processImage;
  getBlurSlider().oninput = processImage;
}
function setUp() {
  renderSimpleThresholdView();
  img = new Image();
  img.src = "demoPhoto/manja-vitolic-gKXKBY-C-Dk-unsplash.jpg";

  img.onload = () => {
    processImage();
  };

  img.onerror = (err) => {
    console.error("Failed to load image:", err);
  };
}

window.onload = setUp;
