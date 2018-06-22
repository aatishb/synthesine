let freq = 440;
let amp = 0.1;

function setup() {

}

function loop(input, output) {
  output.set(
    time
      .map(sin(freq))
      .map(mult(amp))
  );
}
