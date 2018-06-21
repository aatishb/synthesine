let amp = 0.2;
let freq = 440;

function setup() {

}

function phasor(e) {
  return e % 1;
}

const pow = Math.pow;

function loop(input, output) {
  output.set(
    time
      .map(t => phasor(freq * t))
      .map(e => -1 * pow(e,3) + 1.2 * pow(e,2) - 0.2 * e)
  );
}
