let freq = 440;
let amp = 0.1;

function setup() {

}

function sawB(f, t) {
  let mySum = 0;
  let maxIndex = sampleRate / (2 * f);

  for (let k = 1; k < maxIndex; k++){
    mySum += sin(f * k)(t) / k;
  }
  mySum *= 1 / Math.PI;

  return (0.5 - mySum) * 2 - 1;
}

function loop(input, output) {
  output.set(
    time
      .map(t => sawB(freq, t))
      .map(mult(amp))
  );
}
