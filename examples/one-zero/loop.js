let amp = 0.1;

function setup() {

}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

function oneZero(input, b1 = 0.5, b2 = -0.5) {
  let output = input.slice();

  for (let i = 0; i < numSamples; i++) {
    if (i > 0){
      output[i] = b1 * input[i] + b2 * input[i - 1];
    } else {
      output[i] = b1 * input[i];
    }
  }

  return output;
}

function loop(input, output) {
  output.set(
    time
      .map(t => whiteNoise())
      .map(e => amp * e)
      .applyFilter(oneZero, 0.5, -0.5)
  );
}