let amp = 0.1;
let noiseWave;

function setup() {
  noiseWave = new Float32Array(128)
    .map(whiteNoise)
    .map(mult(amp));
}

function loop(input, output) {
  noiseWave = noiseWave.map(delay(1)).map(average);
  output.set(noiseWave);
}
