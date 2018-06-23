let freq = [754, 1938, 3628, 5642, 7816, 9388];
let amp = [0.7, 0.8, 1.0, 0.5, 0.3, 0.1];

let zeroWave, myWave, sineWave;
let numSines;

function setup() {
  zeroWave = new Float32Array(128);
  numSines = freq.length;
}

function loop(input, output) {
  myWave = zeroWave;

  for (var i = 0; i < numSines; i++) {
    sineWave = time
      .map(sinDamped(freq[i], 0.4 + 0.025 * i))
      .mult(amp[i]);

    myWave = myWave.add(sineWave);
  }

  output.set(myWave.mult(0.1));
}

