let freq = 440;
let amp = 0.1;
let myWave, myWave2, myWave3;

function setup() {

}

function sin(f, t) {
  return Math.sin(2 * Math.PI * f * t);
}

function loop(input, output) {
  myWave = time.map(t => sin(freq, t));
  myWave2 = time.map(t => sin(1.5 * freq, t));
  myWave3 = time.map(t => sin(1.25 * freq, t));

  output.set(
    myWave.add(myWave2).add(myWave3).mult(amp)
  );
}
