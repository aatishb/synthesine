let freq = 440;
let amp = 0.05;

function setup() {

}

function loop() {
  return time
    .map(square(freq))
    .mult(amp);
}
