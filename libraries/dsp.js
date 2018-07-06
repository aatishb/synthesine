const add = v => (e, i) => e + v[i];

Float32Array.prototype.add = function(v) {
  return this.map(add(v));
};

const sub = v => (e, i) => e - v[i];

Float32Array.prototype.sub = function(v) {
  return this.map(sub(v));
};

const mult = s => e => e * s;

Float32Array.prototype.mult = function(s) {
  return this.map(mult(s));
};

const div = s => e => e / s;

Float32Array.prototype.div = function(s) {
  return this.map(div(s));
};

const delay = m => (e, i, x) => x[(i + m) % numSamples];

Float32Array.prototype.delay = function(m) {
  return this.map(delay(m));
};

const clip = (g = 0.3) => e => {
  let max = Math.abs(g);
  let min = -max;
  if (e > max) {
    return max;
  }
  else if (e < min) {
    return min;
  }
  else {
    return e;
  }
};

Float32Array.prototype.clip = function(g) {
  return this.map(clip(g));
};

Float32Array.prototype.modulate = function(carrier) {
  return this.map((e,i) => e * (1 + carrier[i]));
};

Float32Array.prototype.applyFilter = function(clause) {
  let output = this.slice();
  let filterOutput = i => clause(this, output, i);

  for (let i = 0; i < numSamples; i++) {
    output[i] = filterOutput(i);
  }

  return output;
};

const average = (e, i, x) => {
  if (i >= 1) {
    return 0.5 * (x[i] + x[i - 1]);
  } else {
    return e;
  }
};

const index = (varOrArray, i) => {
  if (!varOrArray.length) {
    return varOrArray;
  } else {
    return varOrArray[i];
  }
};

const whiteNoise = () => 2 * Math.random() - 1;
const sin = (f, phase = 0) => (t, i) => Math.sin(2 * Math.PI * f * t + index(phase, i));
const saw = f => t => 2 * (f * t - Math.floor(0.5 + f * t));
const square = (f, phase = 0) => (t, i) => clip(1)(sin(f, phase)(t, i) * 1000);
const phasor = f => t => (f * t) % 1;
const triangle = f => t => 2 * Math.abs(saw(f)(t)) - 1;
const sinDamped = (f, tau, phase = 0) => t => Math.exp(- t / tau) * sin(f, phase)(t);
const pow = Math.pow;

const comb = (g1, g2, m1, m2) => (input, output, i) => {
  let x_m1 = 0;
  let y_m2 = 0;

  if (i - m1 >= 0) {
    x_m1 = input[i - m1];
  }
  if (i - m2 >= 0) {
    y_m2 = output[i - m2];
  }

  return input[i] + g1 * x_m1 - g2 * y_m2;
};

/*
const biQuad = (g, b1, b2, a1, a2) => (input, output, i) => {
  if (i >= 2){
    return g * (input[x] + b1 *
  }
};
*/

const highPass = (b1, b2) => (input, output, i) => {
  if (i >= 1){
    return b1 * input[i] + b2 * input[i - 1];
  } else {
    return b1 * input[i];
  }
};

const lowpass = alpha => (input, output, i) => {
  if (i >= 1) {
    return alpha * input[i] +  (1 - alpha) * output[i - 1];
  } else {
    return alpha * input[i];
  }
};

let time, numSamples;

const updateTime = () => {
  if(!time){
    time = new Float32Array(numSamples).fill(0);
    time = time.map((e,i) => e + i / sampleRate);
  }
  else{
    time = time.map(t => t + numSamples / sampleRate);
  }
};
