let carrier, signal, mySine;

function setup() {

}

function loop(input, output) {

  mySine = time.map(triangle(0.5)).mult(5);

  carrier = time.map(sin(273)).modulate(mySine);
  signal = time.map(sin(500, carrier));

  output.set(signal.mult(0.1));
}


