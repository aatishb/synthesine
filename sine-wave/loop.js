function getSine(f, t) {
  return Math.sin(2 * Math.PI * f * t);
}

function loop(input, output, numSamples) {

  const freq = 440;
  const amp = 0.1;

  let myWave = time.map(t => getSine(freq, t)).map(e => e * amp);

  for (let i = 0; i < numSamples; i++){
    output[i] = myWave[i];
  }
}
