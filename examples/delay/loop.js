let amp = 0.1;
let myWave1, myWave2;

function setup() {

}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

const delay = m => (e, i, x) => x[(i + m) % numSamples];

function loop(input, output) {
  myWave1 = time.map(t => whiteNoise()).map(e => amp * e);
  myWave2 = myWave1.map(delay(20));

  output.set(
    spread(diff, myWave1, myWave2)
  );
}
