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
      .map(t => saw(freq, t))
      .map(e => e * amp)
  );
}
