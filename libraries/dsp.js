let time;

const updateTime = numSamples => {
  if(!time){
    time = new Array(numSamples).fill(0);
    time = time.map((e,i) => e + i / sampleRate);
  }
  else{
    time = time.map(t => t + numSamples / sampleRate);
  }
};

setup(); // this runs onces

class AudioProcessor extends AudioWorkletProcessor {

  constructor(options) {
    super(options);
  }

  process(inputs, outputs, parameters) {
    let input = inputs[0][0];
    let output = outputs[0][0];
    let numSamples = output.length;

    updateTime(numSamples);
    loop(input, output, numSamples); // this runs many times

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
