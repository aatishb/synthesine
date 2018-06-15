function setup() {
}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

function delay (input, m) {
  let output = input.slice();

  for (var i = 0; i < numSamples; i++) {
    output[i] = input[(i + m) % numSamples];
  }

  return output;
}

function loop(input, output) {

  const amp = 0.1;

  let myWave1 = time.map(t => whiteNoise()).map(e => amp * e);

  let myWave2 = myWave1.applyFilter(delay, 20);

  let myWave = spread(diff, myWave1, myWave2);

  for (let i = 0; i < numSamples; i++){
    output[i] = myWave[i];
  }
}
