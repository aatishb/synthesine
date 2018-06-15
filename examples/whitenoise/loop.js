function setup() {

}

function loop(input, output) {
  for (let i = 0; i < numSamples; i++) {
    output[i] = (2 * Math.random() - 1) * 0.1;
  }
}