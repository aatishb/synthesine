function setup() {
}

function saw(f, t) {
  return 2 * (f * t - Math.floor(0.5 + f * t));
}

function loop(input, output, numSamples) {

  const freq = 440;
  const amp = 0.1;

  let myWave = time
    .map(t => wrap(freq * t))
    .map(e => 5 * Math.pow(e, 2))
    .map(e => e * amp);

  for (let i = 0; i < numSamples; i++){
    output[i] = myWave[i];
  }
}
