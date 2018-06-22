let amp = 0.1;

function setup() {

}

function loop(input, output) {
  output.set(
    time
      .map(whiteNoise)
      .applyFilter(comb(0, -0.9, 0, 20))
      .map(mult(amp))
  );
}