// some custom functions (will add more as needed)

let time;

const zip = (f, a, b) => a.map((e, i) => f(e, b[i]));
const spread = (f, ...args) => args.reduce((sum, e) => zip(f, sum, e));
const sum = (x,y) => x + y;
const diff = (x,y) => x - y;
const mult = (x,y) => x * y;
const div = (x,y) => x / y;

const clip = function(x, min = -1, max = 1) {
  if (max >= min) {
    if (x > max) {
      return max;
    }
    else if (x < min) {
      return min;
    }
    else {
      return x;
    }
  }
  else {
    return 0;
  }
};

const updateTime = numSamples => {
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
    let numSamples = output.length;

    // calls to custom functions (these run on every frame of 128 samples)
    updateTime(numSamples);
    loop(input, output, numSamples);

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
