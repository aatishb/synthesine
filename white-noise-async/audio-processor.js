class AudioProcessor extends AudioWorkletProcessor {

  constructor(options) {
    super(options);
  }

  process(inputs, outputs, parameters) {
    let input = inputs[0][0];
    let output = outputs[0][0];
    let numSamples = output.length;

    loop(input, output, numSamples);

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
