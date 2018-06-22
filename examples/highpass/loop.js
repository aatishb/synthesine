let amp = 0.1;

function setup() {

}

function loop(input, output) {
  output.set(
    time
      .map(whiteNoise)
      .applyFilter(highPass(0.5, -0.5))
      .map(mult(amp))
  );
}