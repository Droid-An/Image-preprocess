"use strict";

import { adaptiveThresholdView } from "./views/adaptiveThresholding.mjs";
import { simpleThreshold } from "./views/simpleThreshold.mjs";
import { infoTexts } from "./texts.mjs";
const upload = document.getElementById("upload");
const canvasOriginal = document.getElementById("canvasOriginal");
const canvasProcessed = document.getElementById("canvasProcessed");
const ctxOriginal = canvasOriginal.getContext("2d", {
  willReadFrequently: true,
});
const controlsContainer = document.querySelector(".controls");
const tabButtons = document.querySelectorAll(".tabs button");
const box = document.querySelector(".info-box");

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

  if (activeTab === "simpleThresholdControlsTemplate") {
    dst = simpleThreshold(src, dst, Get);
  } else if (activeTab === "adaptiveThresholdControlsTemplate") {
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

function updateSliderValue(slider) {
  const valueEl = controlsContainer.querySelector(`#${slider.id}Value`);
  if (valueEl) valueEl.textContent = slider.value;
}

function loadTemplate(templateId) {
  const tpl = document.getElementById(templateId).content.cloneNode(true);
  controlsContainer.replaceChildren(tpl);

  addDownloadButton();
  // Add listeners dynamically
  controlsContainer
    .querySelectorAll("input[type='range']")
    .forEach((slider) => {
      // set initial label text
      updateSliderValue(slider);
      slider.oninput = () => {
        // updateControlValues();
        updateSliderValue(slider);
        processImage();
      };
    });
}

function addDownloadButton() {
  const downloadBtn = document
    .getElementById("downloadButtonTemplate")
    .content.cloneNode(true);
  downloadBtn.querySelector("#download").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "processed_image.png";
    link.href = canvasProcessed.toDataURL();
    link.click();
  });
  controlsContainer.appendChild(downloadBtn);
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const template = btn.dataset.template;
    updateInfoBox(template);
    loadTemplate(template);
    processImage();
  });
});

function updateInfoBox(templateId) {
  box.innerHTML = infoTexts[templateId] || "<p>No info available</p>";
}

function setUp() {
  const templateId = "simpleThresholdControlsTemplate";
  img.src = "demoPhoto/manja-vitolic-gKXKBY-C-Dk-unsplash.jpg";
  loadTemplate(templateId);
  updateInfoBox(templateId);
  img.onload = () => {
    processImage();
  };

  img.onerror = (err) => {
    console.error("Failed to load image:", err);
  };
}

window.onload = setUp;
