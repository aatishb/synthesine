let amp = 0.1;

function setup() {

}

function loop(input, output) {
  output.set(
    time
      .map(whiteNoise)
      .applyFilter(lowpass(0.1))
      .map(mult(amp))
  );
}