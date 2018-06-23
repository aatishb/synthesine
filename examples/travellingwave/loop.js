let noiseWave, travellingWave;

function setup() {
  let amp = 0.05;

  noiseWave = new Float32Array(128)
    .map(whiteNoise)
    .mult(amp);

  travellingWave = noiseWave.slice();
}

function loop(input, output) {
  travellingWave = travellingWave.delay(1);
  output.set(travellingWave.add(noiseWave));
}