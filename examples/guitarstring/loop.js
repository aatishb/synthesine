let amp = 0.1;
let noiseWave;

function setup() {
  noiseWave = new Float32Array(128)
    .map(e => whiteNoise())
    .mult(0.1);
}

function loop(input, output) {
  noiseWave = noiseWave.map(delay(1)).map(average);
  output.set(noiseWave);
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