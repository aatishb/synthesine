let noiseWave, travellingWave;

function setup() {
  let amp = 0.05;

  noiseWave = new Float32Array(128)
    .map(e => whiteNoise())
    .map(e => amp * e);

  travellingWave = noiseWave.slice();
}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

const delay = m => (e, i, x) => x[(i + m) % numSamples];

function loop(input, output) {

  travellingWave = travellingWave.map(delay(1));

  output.set(
    spread(sum, travellingWave, noiseWave)
  );
}