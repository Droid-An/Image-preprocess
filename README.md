# Image Preprocessing Tool
Image Preprocessing Tool is an interactive web tool for experimenting with different image preprocess techniques used in Optical Character Recognition (OCR) systems.

# Try it online
https://image-preprocessing-tool.netlify.app/

# Fucntionality
You can apply Simple Thresholding or Adaptive Thresholding.
For Simple Thresholding, you can also use Otsu’s Binarization to automatically find the optimal threshold value.
More techniques will be added in the future.

# How to use
- Upload an image of your choice and play with the taskbars
- To download the result, click **Download processed image**.
- Each method is placed in its own tab. Clicking a tab switches the preprocessing method and displays its related controls.
- Every tab includes a short description of the method, its parameters, and available options.

# How it works

The app uses [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html) for image processesing directly in the browser

# Project structure

```
project/
│
├── index.html                  # Main web page
├── style.css                   # Styles and layout
├── script.mjs                  # Core logic and UI interaction
│
├── methods/
│   ├── simpleThreshold.mjs
│   └── adaptiveThresholding.mjs
│
├── texts/                      # Information panels content
│   ├── optionsTexts.mjs
│   └── texts.mjs
│
├── demoPhoto/
│   └── sample-image.jpg        # Default demo image
│
└── README.md   
```

# Contributions
Feel free to open issues or submit pull requests to improve the project. All feedback is welcome!
