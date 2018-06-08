function loop(input, output, numSamples) {
  for (let i = 0; i < numSamples; i++) {
    output[i] = (2 * Math.random() - 1) * 0.1;
  }
}