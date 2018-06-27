let carrier, signal;

function setup() {

}

function loop(input, output) {

  carrier = time.map(sin(1)).mult(200);
  signal = time.map(sin(300, carrier));

  output.set(signal.mult(0.1));
}


