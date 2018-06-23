let amp = 0.5;
let freq = 440;

function setup() {

}

function loop(input, output) {
  output.set(
    time
      .map(sinDamped(freq, 1))
      .mult(amp)
  );
}