function setup() {
}

function sin(f, t) {
  return Math.sin(2 * Math.PI * f * t);
}

function square(f, t) {

  return clip(sin(f,t) * 100000);
}


function delay (wave, m) {

  let numSamples = wave.length;
  let shiftedWave = new Float32Array(numSamples);

  for (var i = 0; i < numSamples; i++) {
    if (i - m >= 0) {
      shiftedWave[i] = wave[i - m];
    } else {
      shiftedWave[i] = wave[m - i];
    }
  }

  return shiftedWave;
}

function loop(input, output, numSamples) {

  const freq = 440;
  const amp = 0.1;

  let myWave1 = time.map(t => square(freq, t));

  let myWave2 = delay(myWave1, 1);

  let myWave = spread(diff, myWave1, myWave2).map(e => amp * e);

  for (let i = 0; i < numSamples; i++){
    output[i] = myWave[i];
  }
}
