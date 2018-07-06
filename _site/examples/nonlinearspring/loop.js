// not sure why this is off by a factor of 16 from the exact version
// it happens to be sqrt( 2 * 128) ?
let amp = 0.5 * 1/16;
let zeroes;

let y_m2 = 1;
let y_m1 = 0;

let t = 1 / sampleRate;
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

function loop() {
  return zeroes
    .map(nonlinearSpring)
    .mult(amp);
}

const nonlinearSpring = () => {
  let y = b1 * y_m1 + b2 * y_m2 + b3 * Math.pow(y_m1,3);
  y_m2 = y_m1;
  y_m1 = y;
  return y;
};