let amp = 0.1;

function setup() {

}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

function onePole(input, alpha = 0.1) {
  let output = input.slice();

  for (let i = 0; i < numSamples; i++) {
    if (i == 0) {
      output[i] = alpha * input[i];
    } else {
      output[i] = alpha * input[i] +  (1 - alpha) * output[i - 1];
    }
  }

  return output;
}

function loop(input, output) {
  output.set(
    time
      .map(t => whiteNoise())
      .map(e => amp * e)
      .applyFilter(onePole, 0.1)
  );
}