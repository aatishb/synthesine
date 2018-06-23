// not sure why this is off by a factor of 16 from the exact version
// it happens to be sqrt( 2 * 128) ?
let amp = 0.5 * 1/16;
let zeroes;

let y_m2 = 1;
let y_m1 = 0;

let t = 1 / sampleRate;
let gamma = 1;
let w = 2 * Math.PI * 440;

// using eqn 33 & 42 from https://arxiv.org/pdf/physics/0507182.pdf
let b1 = 2 * Math.exp(- gamma * t) * Math.cos(w * t);
let b2 = -1 * Math.exp(- 2 * gamma * t);

function setup() {
  zeroes = new Float32Array(128);
}

function loop(input, output) {

  output.set(
    zeroes
      .map(dampedSpring)
      .map(mult(amp))
  );
}

const dampedSpring = () => {
  let y = b1 * y_m1 + b2 * y_m2;
  y_m2 = y_m1;
  y_m1 = y;
  return y;
};