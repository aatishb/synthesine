function setup() {

}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

function loop(input, output) {
  let amp = 0.1;

  let myWave = time
    .map(t => whiteNoise())
    .map(e => amp * e);

  for (let i = 0; i < numSamples; i++) {
    output[i] = myWave[i];
  }
}