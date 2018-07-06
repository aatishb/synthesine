let amp = 0.05;

function setup() {

}

function loop() {
  return time
    .map(whiteNoise)
    .applyFilter(comb(0, -0.9, 0, 20))
    .mult(amp);
}