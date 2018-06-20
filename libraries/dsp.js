// some custom functions (will add more as needed)

Float32Array.prototype.applyFilter = function(myFilter, ...args) {
  return myFilter(this, ...args);
};

let time;
let numSamples;

const zip = (f, a, b) => a.map((e, i) => f(e, b[i]));
const spread = (f, ...args) => args.reduce((sum, e) => zip(f, sum, e));
const sum = (x,y) => x + y;
const diff = (x,y) => x - y;
const mult = (x,y) => x * y;
const div = (x,y) => x / y;

const clip = (val = 0.1) => e => {
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
