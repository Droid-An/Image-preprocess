function simpleThreshold(src, dst, get_helper) {
  // Simple threshold + blur
  let ksize = parseInt(get_helper("blur")?.value ?? 1);
  if (ksize % 2 === 0) ksize += 1;
  const blurred = new cv.Mat();
  cv.GaussianBlur(src, blurred, new cv.Size(ksize, ksize), 0);
  cv.threshold(
    blurred,
    dst,
    +get_helper("threshold")?.value ?? 128,
    255,
    cv.THRESH_BINARY + cv.THRESH_OTSU
  );
  blurred.delete();

  return dst;
}
export { simpleThreshold };
