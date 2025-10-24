const infoTexts = {
  simpleThresholdControlsTemplate: `
 <h3>Simple Thresholding</h3>
    <p>
      <strong>Thresholding</strong> converts a grayscale image into a binary image:
      pixels brighter than the chosen value become <strong>white (255)</strong> and the rest <strong>black (0)</strong>.
      It's useful for separating text or objects from a relatively even background.
    </p>

    <h4>Parameters</h4>
    <p>
      <strong>Threshold:</strong> Global cutoff (0–255). Increasing the threshold makes fewer pixels white; 
      decreasing it makes more pixels white.
    </p>
    <p>
      <strong>Blur Radius (Gaussian):</strong> Size of the blur kernel applied <em>before</em> thresholding to reduce noise.
      Larger kernels smooth out noise but can blur small details. <em>Kernel size should be an odd integer</em> (1, 3, 5, ...).
    </p>
    
  `,
  adaptiveThresholdControlsTemplate: `
      <h3>Adaptive Thresholding</h3>
      <p>
        Unlike simple thresholding, adaptive thresholding calculates a threshold for each
        small region of the image, which makes it more effective when lighting varies.
      </p>
      <h4>Parameters</h4>
      <p><strong>Block Size:</strong> Determines the size of the local area used to calculate
      the threshold. Larger values smooth out noise; smaller values capture more detail.</p>
      <p><strong>C (Constant):</strong> Subtracted from the local mean to fine-tune brightness.
      Higher values make the image darker; lower values make it lighter.</p>
  `,
};

export { infoTexts };
