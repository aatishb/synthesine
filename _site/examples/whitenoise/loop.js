let amp = 0.05;

function setup() {

}

function loop() {
  return time
    .map(whiteNoise)
    .mult(amp);
}