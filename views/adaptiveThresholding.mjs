function adaptiveThresholdView(src, dst, get_helper) {
  // Adaptive threshold
  let blockSize = parseInt(get_helper("blockSize")?.value ?? 11);
  if (blockSize % 2 === 0) blockSize += 1;
  let c = parseInt(get_helper("c")?.value ?? 2);
  cv.adaptiveThreshold(
    src,
    dst,
    255,
    cv.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv.THRESH_BINARY,
    blockSize,
    c
  );
  return dst;
}

export { adaptiveThresholdView };
