"use strict";
function simpleThresholdAndBlur(src, dst, get_helper, option) {
  // Simple threshold + blur
  let ksize = parseInt(get_helper("blur").value);
  if (ksize % 2 === 0) ksize += 1;
  const blurred = new cv.Mat();
  cv.GaussianBlur(src, blurred, new cv.Size(ksize, ksize), 0);

  const thresholdValue = parseInt(get_helper("threshold").value);
  let otsuThreshold = 0;

  if (option === "otsu") {
    otsuThreshold = cv.threshold(
      blurred,
      dst,
      thresholdValue,
      255,
      cv.THRESH_BINARY + cv.THRESH_OTSU
    );
  } else {
    cv.threshold(blurred, dst, thresholdValue, 255, cv.THRESH_BINARY);
  }

  blurred.delete();

  return { dst, otsuThreshold };
}
export { simpleThresholdAndBlur };
