function setup() {

}

function sin(f, t) {
  return Math.sin(2 * Math.PI * f * t);
}

function squareB(f, t) {
  let sum = 0;

  let maxIndex = sampleRate / (2 * f);

  for (let k = 1; k < maxIndex; k += 2){
    sum += sin(f * k, t) / k;
  }

  sum *= 4 / Math.PI;

  return sum;
}

function loop(input, output, numSamples) {

  const freq = 440;
  const amp = 0.1;

  let myWave = time.map(t => squareB(freq, t)).map(e => e * amp);

  for (let i = 0; i < numSamples; i++){
    output[i] = myWave[i];
  }
}
