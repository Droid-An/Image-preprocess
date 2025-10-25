"use strict";

import { adaptiveThreshold } from "./methods/adaptiveThresholding.mjs";
import { simpleThreshold } from "./methods/simpleThreshold.mjs";
import { infoTexts } from "./texts/texts.mjs";
import { optionsTexts } from "./texts/optionsTexts.mjs";

const loadingMsg = document.getElementById("loadingMsg");
const upload = document.getElementById("upload");
const tabButtons = document.querySelectorAll(".tabs button");
const canvasOriginal = document.getElementById("canvasOriginal");
const canvasProcessed = document.getElementById("canvasProcessed");
const ctxOriginal = canvasOriginal.getContext("2d", {
  willReadFrequently: true,
});
const controlsContainer = document.querySelector(".controls");
const methodInfoBox = document.querySelector(".method_info_box");
const optionInfoBox = document.querySelector(".additional_options_info_box");

const Get = (id) => controlsContainer.querySelector(`#${id}`);

let img = new Image();

function drawOriginal() {
  canvasOriginal.width = img.width;
  canvasOriginal.height = img.height;
  ctxOriginal.drawImage(img, 0, 0);
}

function processImage(option) {
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
    if (option == "otsu") {
      const result = simpleThreshold(src, dst, Get, "otsu");
      dst = result.dst;
      // update slider value so user can see which value method applied
      if (result.otsuThreshold > 0) {
        const thresholdSlider = Get("threshold");
        thresholdSlider.value = Math.round(result.otsuThreshold);
        updateSliderValue(thresholdSlider);
      }
    } else {
      simpleThreshold(src, dst, Get);
    }
  } else if (activeTab === "adaptiveThresholdControlsTemplate") {
    dst = adaptiveThreshold(src, dst, Get);
  }
  loadingMsg.classList.add("hidden");

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
        updateSliderValue(slider);
        processImage();
      };
    });
  if (templateId == "simpleThresholdControlsTemplate") {
    addOtsuOption();
  }
}

function addOtsuOption() {
  const otsuButton = controlsContainer.querySelector("#OtsuBinarization");
  otsuButton.addEventListener("click", () => {
    processImage("otsu");
    updateSliderValue("threshold");
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
    console.log("process");
    processImage();
  });
});

function updateInfoBox(templateId) {
  methodInfoBox.innerHTML = infoTexts[templateId] || "<p>No info available</p>";
  if (typeof optionsTexts[templateId] === "undefined") {
    optionInfoBox.style.display = "none";
  } else {
    optionInfoBox.style.display = "block";
    optionInfoBox.innerHTML =
      optionsTexts[templateId] || "<p>No info available</p>";
  }
}

function setUp() {
  const templateId = "simpleThresholdControlsTemplate";
  img.src = "demoPhoto/manja-vitolic-gKXKBY-C-Dk-unsplash.jpg";
  loadTemplate(templateId);
  updateInfoBox(templateId);
  //initial preprocess
  img.onload = () => {
    processImage();
  };

  img.onerror = (err) => {
    console.error("Failed to load image:", err);
  };
}

window.onload = setUp;
