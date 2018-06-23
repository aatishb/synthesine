let amp = 0.1;
let myWave1;

function setup() {

}

function loop(input, output) {
  myWave1 = time
    .map(whiteNoise)
    .map(mult(amp));

  output.set(
    myWave1.sub(myWave1.delay(20))
  );
}
