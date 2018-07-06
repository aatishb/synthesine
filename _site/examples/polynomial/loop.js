let amp = 0.2;
let freq = 440;

function setup() {

}

function loop() {
  return time
    .map(phasor(freq))
    .map(e => -1 * pow(e,3) + 1.2 * pow(e,2) - 0.2 * e);
}
