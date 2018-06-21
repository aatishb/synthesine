let freq = 440;
let amp = 0.1;

function setup() {

}

function saw(f, t) {
  return 2 * (f * t - Math.floor(0.5 + f * t));
}

function loop(input, output) {
  output.set(
    time
      .map(t => wrap(freq * t))
      .map(e => 5 * Math.pow(e, 2))
      .map(e => e * amp)
  );
}
