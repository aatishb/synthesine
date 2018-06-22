// some custom functions (will add more as needed)
/*
Float32Array.prototype.applyFilter = function(myFilter, ...args) {
  return myFilter(this, ...args);
};
*/

Float32Array.prototype.applyFilter = function(clause) {
  let output = this.slice();
  let filterOutput = i => clause(this, output, i);
  let f;

  for (let i = 0; i < numSamples; i++) {
    f = filterOutput(i);
    output[i] = f ? f : 0;
  }

  return output;
};

Float32Array.prototype.add = function(vector) {
  for (let i = 0; i < numSamples; i++) {
    this[i] += vector[i];
  }
  return this;
};

Float32Array.prototype.subtract = function(vector) {
  for (let i = 0; i < numSamples; i++) {
    this[i] -= vector[i];
  }
  return this;
};

Float32Array.prototype.mult = function(scalar) {
  for (let i = 0; i < numSamples; i++) {
    this[i] *= scalar;
  }
  return this;
};

Float32Array.prototype.div = function(scalar) {
  for (let i = 0; i < numSamples; i++) {
    this[i] /= scalar;
  }
  return this;
};

let time;
let numSamples;

const zip = (f, a, b) => a.map((e, i) => f(e, b[i]));
const spread = (f, ...args) => args.reduce((sum, e) => zip(f, sum, e));
const sum = (x,y) => x + y;
const diff = (x,y) => x - y;
const mult = (x,y) => x * y;
const div = (x,y) => x / y;

const clip = (e, val = 0.1) => {
  let max = Math.abs(val);
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

const updateTime = () => {
  if(!time){
    time = new Float32Array(numSamples).fill(0);
    time = time.map((e,i) => e + i / sampleRate);
  }
  else{
    time = time.map(t => t + numSamples / sampleRate);
  }
};

setup(); // this runs once

// stuff below is the standard way to start an audioProcessor
class AudioProcessor extends AudioWorkletProcessor {

  constructor(options) {
    super(options);
  }

  process(inputs, outputs, parameters) {
    let input = inputs[0][0];
    let output = outputs[0][0];
    if(!numSamples){
      numSamples = output.length;
    }

    // calls to custom functions (these run on every frame of 128 samples)
    updateTime();
    loop(input, output);

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
