let amp = 0.1;

function setup() {

}

function whiteNoise() {
  return (2 * Math.random() - 1);
}

function loop(input, output) {
  output.set(
    time
      .map(t => whiteNoise())
      .map(e => amp * e)
  );
}