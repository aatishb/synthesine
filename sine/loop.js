function setup() {

}

function sin(f, t) {
  return Math.sin(2 * Math.PI * f * t);
}

function loop(input, output, numSamples) {

  const freq = 440;
  const amp = 0.1;

  let myWave = time
    .map(t => sin(freq, t))
    .map(e => e * amp);

  for (let i = 0; i < numSamples; i++){
    output[i] = myWave[i];
  }
}
