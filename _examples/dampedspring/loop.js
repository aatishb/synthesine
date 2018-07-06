let amp = 0.5;
let freq = 440;

function setup() {

}

function loop() {
  return time
    .map(sinDamped(freq, 1))
    .mult(amp);
}