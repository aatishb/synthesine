let amp = 0.05;

function setup() {

}

function loop() {
  return time
    .map(whiteNoise)
    .applyFilter(highPass(0.5, -0.5))
    .mult(amp);
}