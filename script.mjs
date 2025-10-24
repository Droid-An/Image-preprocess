"use strict";

import { adaptiveThresholdView } from "./views/adaptiveThresholding.mjs";
import { simpleThreshold } from "./views/simpleThreshold.mjs";

const upload = document.getElementById("upload");
const canvasOriginal = document.getElementById("canvasOriginal");
const canvasProcessed = document.getElementById("canvasProcessed");
const ctxOriginal = canvasOriginal.getContext("2d", {
  willReadFrequently: true,
});
const controlsContainer = document.querySelector(".controls");
const tabButtons = document.querySelectorAll(".tabs button");

const cValue = document.getElementById("cValue");

const showButton = document.getElementById("showButton");

const Get = (id) => controlsContainer.querySelector(`#${id}`);

let img = new Image();

function drawOriginal() {
  canvasOriginal.width = img.width;
  canvasOriginal.height = img.height;
  ctxOriginal.drawImage(img, 0, 0);
}

function processImage() {
  if (!cv || !img.complete) return;

  drawOriginal();
  canvasProcessed.width = img.width;
  canvasProcessed.height = img.height;

  const src = cv.imread(canvasOriginal);
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);

  const activeTab = document.querySelector(".tabs button.active")?.dataset
    .template;

  let dst = new cv.Mat();

  if (activeTab === "simpleThresholdcontrolsTemplate") {
    dst = simpleThreshold(src, dst, Get);
  } else if (activeTab === "adaptiveThresholdcontrolsTemplate") {
    // Adaptive threshold
    dst = adaptiveThresholdView(src, dst, Get);
  }
  cv.imshow(canvasProcessed, dst);
  src.delete();
  dst.delete();
}
upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  img.src = URL.createObjectURL(file);

  img.onload = processImage;
});

function loadTemplate(templateId) {
  const tpl = document.getElementById(templateId).content.cloneNode(true);
  controlsContainer.replaceChildren(tpl);

  // Add listeners dynamically
  controlsContainer
    .querySelectorAll("input[type='range']")
    .forEach((slider) => {
      slider.oninput = processImage;
    });
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    loadTemplate(btn.dataset.template);
    processImage();
  });
});

function setUp() {
  loadTemplate("simpleThresholdcontrolsTemplate");
  img.src = "demoPhoto/manja-vitolic-gKXKBY-C-Dk-unsplash.jpg";

  img.onload = () => {
    processImage();
  };

  img.onerror = (err) => {
    console.error("Failed to load image:", err);
  };
}

window.onload = setUp;
