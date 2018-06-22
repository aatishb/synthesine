let amp = 0.1;
let myWave1;

function setup() {

}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

const delay = m => (e, i, x) => x[(i + m) % numSamples];

function loop(input, output) {
  myWave1 = time.map(t => whiteNoise()).mult(amp);

  output.set(
    myWave1.subtract(myWave1.map(delay(20)))
  );
}
