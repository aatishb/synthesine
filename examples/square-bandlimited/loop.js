let freq = 440;
let amp = 0.1;

function setup() {

}

const squareB = f => t => {
  let mySum = 0;
  let maxIndex = sampleRate / (2 * f);

  for (let k = 1; k < maxIndex; k += 2){
    mySum += sin(f * k)(t) / k;
  }
  mySum *= 4 / Math.PI;

  return mySum;
};

function loop(input, output) {
  output.set(
    time
      .map(squareB(freq))
      .map(mult(amp))
  );
}
