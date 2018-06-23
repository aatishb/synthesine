let amp = 0.5;
let freq = 440;
let zeroWave, myWave, sineWave;
let coeffs = [];
let numSines = 10;

function setup() {
  // new array filled with zeros
  zeroWave = new Float32Array(128);

  for (var i = 0; i < numSines; i++) {
    coeffs.push(Math.pow(-1,i ) / Math.pow(2 * i + 1, 2));
  }
}

function loop(input, output) {
  myWave = zeroWave;

  for (var i = 0; i < numSines; i++) {

    sineWave = time
      .map(sinDamped(freq * (i + 1), 1/3 + 0.001 * i ))
      .mult(coeffs[i]);

    myWave = myWave.add(sineWave);
  }

  output.set(myWave.mult(amp));
}