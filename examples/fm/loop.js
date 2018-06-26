let carrier, signal;

function setup() {

}

function loop(input, output) {

  carrier = time.map(sin(220)).mult(4);
  signal = time.map(sin(220, carrier));

  output.set(signal.mult(0.1));
}


