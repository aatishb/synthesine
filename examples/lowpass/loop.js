let amp = 0.1;

function setup() {

}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

const lowpass = alpha => (input, output, i) => {
  if (i >= 1) {
    return alpha * input[i] +  (1 - alpha) * output[i - 1];
  } else {
    return alpha * input[i];
  }
};

function loop(input, output) {
  output.set(
    time
      .map(t => whiteNoise())
      .applyFilter(lowpass(0.1))
      .mult(amp)
  );
}