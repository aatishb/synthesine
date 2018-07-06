let amp = 0.05;
let myWave;

function setup() {

}

function loop() {
  myWave = time
    .map(whiteNoise)
    .map(mult(amp));

  myWave = myWave.sub(myWave.delay(20));

  return myWave;
}
