function setup() {

}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

function comb(input, g1 = 0.1, g2 = 0.1, m1, m2) {
  let output = input.slice();
  let x_m1 = 0;
  let y_m2 = 0;

  for (let i = 0; i < numSamples; i++) {
    if (i - m1 >= 0) {
      x_m1 = input[i - m1];
    }
    if (i - m2 >= 0) {
      y_m2 = output[i - m2];
    }
    output[i] = input[i] + g1 * x_m1 - g2 * y_m2;
  }

  return output;
}

function loop(input, output) {
  let amp = 0.1;

  let myWave = time
    .map(t => whiteNoise())
    .map(e => amp * e)
    .applyFilter(comb, -0.5, 0.8, 3, 10);

  for (let i = 0; i < numSamples; i++) {
    output[i] = myWave[i];
  }

}