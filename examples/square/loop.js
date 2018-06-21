let freq = 440;
let amp = 0.1;

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

  return clip(sin(f,t) * 100000, 1);
}

function loop(input, output) {
  output.set(
    time
      .map(t => square(freq, t))
      .map(e => e * amp)
  );
}
