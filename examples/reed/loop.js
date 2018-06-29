let amp = 0.1;
let breath;

let embochure = 0.1;
let brightness = 3;
let stiffness = 0.5;

let m = stiffness / (embochure + 1);

function setup() {
}

function loop(input, output) {
  breath = time
    .map(sin(440))
    .map(e => e/2)
    .map(e => e * (1 - ramp(e)));

  output.set(breath.mult(amp));
}

const ramp = e => {
  if (e < embochure) {
    return Math.pow(1 - m * (embochure - e), brightness);
  } else {
    return 1;
  }
};