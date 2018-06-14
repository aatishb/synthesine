let filterAccumulator = 0;

function setup() {
}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

function lowPass(inputWave, alpha) {
  let filteredWave = inputWave;

  for (let i = 0; i < numSamples; i++) {
    if (i == 0) {
      filteredWave[i] = alpha * inputWave[i] + (1 - alpha) * filterAccumulator;
    } else {
      filteredWave[i] = alpha * inputWave[i] + (1 - alpha) * inputWave[i - 1];
    }
  }

  filterAccumulator = inputWave[numSamples - 1];

  return filteredWave;
}

function loop(input, output, numSamples) {

  let amp = 0.5;
  let myWave = time.map(t => whiteNoise()).map(e => amp * e);
  myWave = lowPass(myWave, 0.1);

  for (let i = 0; i < numSamples; i++) {
    output[i] = myWave[i];
  }

}