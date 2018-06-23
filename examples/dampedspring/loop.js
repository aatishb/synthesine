let amp = 0.5;
let freq = 440;

function setup() {

}

const dampedSine = f => t => Math.exp(- t) * sin(f)(t);

function loop(input, output) {
  output.set(
    time
      .map(dampedSine(freq))
      .map(mult(amp))
  );
}