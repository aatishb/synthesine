function setup() {

}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

const delay = m => (e, i, x) => x[(i + m) % numSamples];

function loop(input, output) {

  const amp = 0.1;

  let myWave1 = time.map(t => whiteNoise()).map(e => amp * e);
  let myWave2 = myWave1.map(delay(20));

  let myWave = spread(diff, myWave1, myWave2);

  for (let i = 0; i < numSamples; i++){
    output[i] = myWave[i];
  }
}
