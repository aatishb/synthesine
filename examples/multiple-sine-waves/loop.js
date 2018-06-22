let freq = 440;
let amp = 0.1;
let myWave, myWave2, myWave3;

function setup() {

}

function loop(input, output) {
  myWave = time.map(sin(freq));
  myWave2 = time.map(sin(1.5 * freq));
  myWave3 = time.map(sin(1.25 * freq));

  output.set(
    myWave
      .map(add(myWave2))
      .map(add(myWave3))
      .map(mult(amp))
  );
}
