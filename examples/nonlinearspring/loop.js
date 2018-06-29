// not sure why this is off by a factor of 16 from the exact version
// it happens to be sqrt( 2 * 128) ?
let amp = 0.5 * 1/16;
let zeroes;

let y_m2 = 1;
let y_m1 = 0;

let t = 1 / sampleRate;

// using eqn 33 & 42 from https://arxiv.org/pdf/physics/0507182.pdf

/*
let gamma = 1;
let w = 2 * Math.PI * 440;
let b1 = 2 * Math.exp(- gamma * t) * Math.cos(w * t);
let b2 = -1 * Math.exp(- 2 * gamma * t);
let b3 = b2 * 0.001;
*/

let k = 500000;
let q = 1000  * 100;
let r = 2;

let b1 = 2 + t * r;
let b2 = -1;
let b3 = - t * t * q;

let denominator = 1 + (t * r) + (t * t * k);
b1 /= denominator;
b2 /= denominator;
b3 /= denominator;

function setup() {
  zeroes = new Float32Array(128);
}

function loop(input, output) {

  output.set(
    zeroes
      .map(nonlinearSpring)
      .mult(amp)
  );
}

const nonlinearSpring = () => {
  let y = b1 * y_m1 + b2 * y_m2 + b3 * Math.pow(y_m1,3);
  y_m2 = y_m1;
  y_m1 = y;
  return y;
};