function setup() {

}

function saw(f, t) {
  let sum = 0;

  for (let k = 1; f * k < sampleRate / 2; k ++){
    sum += Math.sin(2 * Math.PI * f * k * t) / k;
  }

  sum *= 1 / Math.PI;

  return 0.5 - sum;
}

function loop(input, output, numSamples) {

  const freq = 440;
  const amp = 0.1;

  let myWave = time.map(t => saw(freq, t)).map(e => e * amp);

  for (let i = 0; i < numSamples; i++){
    output[i] = myWave[i];
  }
}
