let noiseWave;

function setup() {
  noiseWave = new Float32Array(128)
    .map(e => whiteNoise())
    .map(e => 0.1 * e);
}

function loop(input, output) {

  const amp = 0.1;
  noiseWave = noiseWave.map(delay(1)).map(average);

  for (let i = 0; i < numSamples; i++){
    output[i] = noiseWave[i];
  }
}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

const delay = m => (e, i, x) => x[(i + m) % numSamples];

const average = (e, i, x) => {
  if (i > 0) {
    return 0.5 * (x[i] + x[i - 1]);
  } else {
    return e;
  }
};