// based on example by Jean Claude Risset
// "Computer Music: Why?" WERGO 2033-2, 1985
// https://www.kadenze.com/courses/physics-based-sound-synthesis-for-games-and-interactive-systems-iv/sessions/physics-oscillators-sines-spectra-spectral-additive-synthesis
let maxIndex = 10;
let mySum;
let zeroWave, myWave;
let freq;

function setup() {
  zeroWave = new Float32Array(128);
  freq = new Float32Array(maxIndex);

  let baseFreq = 150; // play with changing this
  freq = freq.map((e,i) => baseFreq + 0.2 * i);

  // change a few of the frequencies in the array to get interesting beats
  freq[1] = 105.2;
  freq[2] = 105;
  freq[5] = 205;
  freq[6] = 207;
}

function loop(input, output) {
  myWave = zeroWave;

  for (let i = 0; i < maxIndex; i++){
    myWave = myWave.add(
      time.map(t => sawB(freq[i], t))
      //time.map(saw(100 + 0.1*i)) // it sounds AWFUL without bandlimiting
    );
  }

  output.set(myWave.mult(0.1));
}

function sawB(f, t) {
  mySum = 0;
  //let maxIndex = sampleRate / (2 * f);

  for (let k = 1; k < maxIndex; k++){
    mySum += sin(f * k)(t) / k;
  }
  mySum *= 1 / Math.PI;

  return (0.5 - mySum) * 2 - 1;
}