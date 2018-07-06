let carrier, signal, mySine;

function setup() {

}

function loop() {

  mySine = time.map(triangle(0.5)).mult(5);

  carrier = time.map(sin(273)).modulate(mySine);
  signal = time.map(sin(500, carrier));

  return signal.mult(0.1);
}


