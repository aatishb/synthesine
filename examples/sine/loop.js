let freq = 440;
let amp = 0.1;

function setup() {

}

function sin(f, t) {
  return Math.sin(2 * Math.PI * f * t);
}

function loop(input, output) {
  output.set(
    time
      .map(t => sin(freq, t))
      .mult(amp)
  );
}
