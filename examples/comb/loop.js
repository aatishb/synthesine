let amp = 0.1;

function setup() {

}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

const comb = (g1, g2, m1, m2) => (input, output, i) => {
  let x_m1 = 0;
  let y_m2 = 0;

  if (i - m1 >= 0) {
    x_m1 = input[i - m1];
  }
  if (i - m2 >= 0) {
    y_m2 = output[i - m2];
  }

  return input[i] + g1 * x_m1 - g2 * y_m2;
};

function loop(input, output) {
  output.set(
    time
      .map(t => whiteNoise())
      .applyFilter(comb(0, -0.9, 0, 20))
      .mult(amp)
  );
}