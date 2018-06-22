let amp = 0.1;

function setup() {

}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

const highPass = (b1, b2) => (input, output, i) => {
  if (i >= 1){
    return b1 * input[i] + b2 * input[i - 1];
  } else {
    return b1 * input[i];
  }
};

function loop(input, output) {
  output.set(
    time
      .map(t => whiteNoise())
      .applyFilter(highPass(0.5, -0.5))
      .mult(amp)
  );
}