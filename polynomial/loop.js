function setup() {
}

function phasor(e) {
  return e % 1;
}

const pow = Math.pow;

function loop(input, output, numSamples) {

  const amp = 0.2;
  const freq = 440;

  let myWave = time
    .map(t => phasor(freq * t))
    .map(e => -1 * pow(e,3) + 1.2 * pow(e,2) - 0.2 * e);

  for (let i = 0; i < numSamples; i++){
    output[i] = myWave[i];
  }
}
