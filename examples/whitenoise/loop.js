let amp = 0.1;

function setup() {

}

function loop(input, output) {
  output.set(
    time
      .map(whiteNoise)
      .map(mult(amp))
  );
}