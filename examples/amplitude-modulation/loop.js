let carrier, signal;

function setup() {

}

function loop(input, output) {

  carrier = time.map(sin(1)).mult(0.5);
  signal = time.map(sin(440)).mult(0.1);

  signal = signal.map((e,i) => e * (1 + carrier[i]));

  output.set(signal);
}
