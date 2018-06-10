function setup() {

}

function sin(f, t) {
  return Math.sin(2 * Math.PI * f * t);
}

const zip = (f, a, b) => a.map((e, i) => f(e, b[i]));
const spread = (f, ...args) => args.reduce((sum,current) => zip(f, sum, current));
const sum = (x,y) => x + y;

function loop(input, output, numSamples) {

  const freq = 440;
  const amp = 0.1;

  let myWave = time.map(t => sin(freq, t));
  let myWave2 = time.map(t => sin(1.5 * freq, t));
  let myWave3 = time.map(t => sin(1.25 * freq, t));
  myWave = spread(sum, myWave, myWave2, myWave3);

  myWave = myWave.map(e => e*amp);

  for (let i = 0; i < numSamples; i++){
    output[i] = myWave[i];
  }
}
