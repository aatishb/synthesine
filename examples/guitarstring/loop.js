let noiseWave, movingWave;

function setup() {
  noiseWave = new Float32Array(128)
    .map(e => whiteNoise())
    .map(e => 0.1 * e);

  movingWave = noiseWave.slice();
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

const delay = m => (e, i, x) => x[(i + m) % numSamples];

function loop(input, output) {

  const amp = 0.1;
  movingWave = movingWave.map(delay(1)).applyFilter(oneZero, 0.5, 0.5);

  for (let i = 0; i < numSamples; i++){
    output[i] = movingWave[i];
  }
}
