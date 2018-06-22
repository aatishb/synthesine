let noiseWave, travellingWave;

function setup() {
  let amp = 0.05;

  noiseWave = new Float32Array(128)
    .map(whiteNoise)
    .map(mult(amp));

  travellingWave = noiseWave.slice();
}

function loop(input, output) {

  travellingWave = travellingWave.map(delay(1));

  output.set(
    travellingWave.map(add(noiseWave))
  );
}