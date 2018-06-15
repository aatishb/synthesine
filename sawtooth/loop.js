function setup() {

}

function saw(f, t) {
  return 2 * (f * t - Math.floor(0.5 + f * t));
}

function loop(input, output) {
  const freq = 440;
  const amp = 0.1;

  let myWave = time
    .map(t => saw(freq, t))
    .map(e => e * amp);

  for (let i = 0; i < numSamples; i++){
    output[i] = myWave[i];
  }
}
