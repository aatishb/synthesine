function setup() {

}

function sin(f, t) {
  return Math.sin(2 * Math.PI * f * t);
}

function square(f, t) {
  /*
  if(sin(f,t) >= 0){ return 1;}
  else {return -1;}
  */

  return clip(sin(f,t) * 100000);
}

function loop(input, output, numSamples) {
  const freq = 440;
  const amp = 0.1;

  let myWave = time
    .map(t => square(freq, t))
    .map(e => e * amp);

  for (let i = 0; i < numSamples; i++){
    output[i] = myWave[i];
  }
}
