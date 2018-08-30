const libraryCode = processorName => `

// WAVE OPERATIONS

const indexOf = (x, i) => {
  if (!isNaN(x[i])) {
    return x[i];
  } else if (!isNaN(x) && isNaN(x.length)) {
    return x;
  } else {
    return 0;
  }
}

const add = v => (e, i) => e + indexOf(v,i);
const sub = v => (e, i) => e - indexOf(v,i);
const mult = v => (e, i) => e * indexOf(v,i);
const div = v => (e, i) => e / indexOf(v,i);
const modulate = v => (e, i) => e * (1 + v[i])

const clip = (g = 0.5) => e => {
  let max = Math.abs(g);
  let min = -max;
  if (e > max) {
    return max;
  }
  else if (e < min) {
    return min;
  }
  else {
    return e;
  }
};

class Wave extends Float32Array {

  constructor(n = numSamples) {
      super(n);
  }

  add(v) { return this.map(add(v)); }
  sub(v) { return this.map(sub(v)); }
  mult(s) { return this.map(mult(s)); }
  div(s) { return this.map(div(s)); }
  modulate(v) { return this.map(modulate(v)); }
  clip(g) { return this.map(clip(g)); }

}


// OSCILLATORS

const whiteNoise = () => 2 * Math.random() - 1;
const phasor = f => t => (f * t) % 1;
const sin = (f, phase = 0) => (t, i) => Math.sin(2 * Math.PI * f * t + indexOf(phase, i));
const square = (f, phase = 0) => (t, i) => clip(1)(sin(f, phase)(t, i) * 1000);
const saw = f => t => 2 * (f * t - Math.floor(0.5 + f * t));
const triangle = f => t => 2 * Math.abs(saw(f)(t)) - 1;
const sinDamped = (f, tau, phase = 0) => t => Math.exp(- t / Math.max(0.00001, tau)) * sin(f, phase)(t);


// FILTERS

const delay = (m) => {

  let y = 0;
  let x_arr = Array(m).fill(0);

  const equation = (e, i, x) => {
   y = x_arr.shift();
   x_arr.push(x[i]);
   return y;
  };

  function set(newM) {
    x_arr = Array(newM).fill(0);
  };

  return {
    apply: equation,
    set: set
  };

};

const comb = (g1, m1, g2, m2) => {

  let y = 0;
  let x_arr = Array(m1).fill(0);
  let y_arr = Array(m2).fill(0);

  const equation = (e, i, x) => {
   y = x[i] + g1 * (x_arr.shift() || 0) - g2 * (y_arr.shift() || 0);
   x_arr.push(x[i]);
   y_arr.push(y);
   return y;
  };

  function set(newG1, newM1, newG2, newM2) {
    g1 = newG1;
    g2 = newG2;
    x_arr = Array(newM1).fill(0);
    y_arr = Array(newM2).fill(0);
  };


  return {
    apply: equation,
    set: set
  };

};

const lowPass = alpha =>
{
  let y = 0;
  let y1 = 0;

  const equation = (e, i, x) => {
    y = alpha * x[i] +  (1 - alpha) * y1;
    y1 = y;
    return y;
  };

  function set(newAlpha) {
    alpha = newAlpha;
  };

  return {
    apply: equation,
    set: set
  };

};

const highPass = alpha =>
{
  let y = 0;
  let y1 = 0;

  const equation = (e, i, x) => {
    y = x[i] - alpha * y1;
    y1 = y;
    return y;
  };

  function set(newAlpha) {
    alpha = newAlpha;
  };

  return {
    apply: equation,
    set: set
  };

};

const twoPointAverage = () =>
{
  let y = 0;
  let x1 = 0;

  const equation = (e, i, x) => {
    y = 0.5 * (x[i] + x1);
    x1 = x[i];
    return y;
  };

  return {
    apply: equation
  };

}

const dcBlocker = alpha =>
{
  let y = 0;
  let y1 = 0;
  let x1 = 0;

  const equation = (e, i, x) => {
    y = x[i] - x1 +  (1 - alpha) * y1;
    x1 = x[i];
    y1 = y;
    return y;
  };

  function set(newAlpha) {
    alpha = newAlpha;
  };

  return {
    apply: equation,
    set: set
  };

}

const resonator = (freq, bandwidth) => {

  let q = Math.exp(- Math.PI * bandwidth / sampleRate);
  let gain = Math.sqrt((1 - q * q) / 2);
  let cosPoleAngle = ((1 + q * q) / 2 * q) * Math.cos(2 * Math.PI * freq / sampleRate);

  let y = 0;
  let y1 = 0;
  let y2 = 0;
  let x1 = 0;
  let x2 = 0;

  const equation = (e, i, x) => {
    y = gain * (x[i] - x2) + 2 * q * cosPoleAngle * y1 - q * q * y2;
    y2 = y1;
    y1 = y;
    x2 = x1;
    x1 = x[i];
    return y;
  };

  function set(newFreq, newBandwidth) {
    freq = newFreq;
    bandwidth = newBandwidth;
    q = Math.exp(- Math.PI * bandwidth / sampleRate);
    gain = Math.sqrt((1 - q * q) / 2);
    cosPoleAngle = ((1 + q * q) / 2 * q) * Math.cos(2 * Math.PI * freq / sampleRate);
  };

  return {
    apply: equation,
    set: set
  };

}

const adsr = (startTime, attackTime, delayTime, sustainTime, releaseTime) => t => {
  if (t < startTime) {
    return 0;
  }
  if (t < startTime + attackTime) {
    let deltaT = t - startTime;
    let slope = (1 - 0) / attackTime;
    return slope * deltaT;
  }
  else if (t < startTime + attackTime + delayTime) {
    let deltaT = t - startTime - attackTime;
    let slope = (0.5 - 1) / delayTime;
    return slope * deltaT + 1;
  }
  else if (t < startTime + attackTime + delayTime + sustainTime) {
    return 0.5;
  }
  else if (t < startTime + attackTime + delayTime + sustainTime + releaseTime) {
    let deltaT = t - startTime - attackTime - delayTime - sustainTime;
    let slope = (0 - 0.5) / releaseTime;
    return slope * deltaT + 0.5;
  }
  else {
    return 0;
  }
};

/*
function biquad(...args) {

  this.filterOutput = 0;
  this.y1 = 0;
  this.y2 = 0;
  this.x1 = 0;
  this.x2 = 0;

  this.set = function(...args){
    this.b0 = args[0];
    this.b1 = args[1];
    this.b2 = args[2];
    this.a0 = args[3];
    this.a1 = args[4];
    this.a2 = args[5];
  };

  if(args.length){
    this.set(...args);
  }

  this.equation =  (x, y, i) => {
    this.filterOutput = (this.b0/this.a0) * x[i] + (this.b1/this.a0) * this.x1
    + (this.b2/this.a0) * this.x2
    - (this.a1/this.a0) * this.y1 - (this.a2/this.a0) * this.y2;

    this.y2 = this.y1;
    this.y1 = this.filterOutput;

    this.x2 = this.x1;
    this.x1 = x[i];

    return this.filterOutput;
  };
}

const biQuad = (gain, freqZero, resZero, freqPole, resPole) =>
  {
    return (input, output, i) => {
      return gain
      * (input[i]
          - 2 * resZero * Math.cos(2 * Math.PI * freqZero / sampleRate) * input[i-1]
          + resZero * resZero * input[i-2]
      )
        + 2 * resPole * Math.cos(2 * Math.PI * freqPole / sampleRate) * output[i-1]
        - resPole * resPole * output[i-2]
      || gain * input[i];
    };
  };

*/


// WAVE TABLE

function WaveTable(waveTableSize) {

  this.data = new Wave(waveTableSize);
  this.buffer = new Wave(numSamples);
  this.pointer = 0;

  this.map = function(f) {
    this.data = this.data.map(f);
    return this;
  }

  this.delay = function(samples) {
    this.pointer = (this.pointer + samples) % waveTableSize;
    return this;
  }

  this.get = function() {
    let i;
    for(i = 0; i < numSamples; i++) {
      this.buffer[i] = this.data[(this.pointer + i) % waveTableSize];
    }
    return this.buffer;
  };

  this.update = function(arr) {
    if(arr) {
      let i;
      for(i = 0; i < numSamples; i++){
        this.data[(this.pointer + i) % waveTableSize] = arr[i];
      }
    }
    //this.pointer = (this.pointer + numSamples) % waveTableSize;
  };

}

// DEFAULT VARIABLES

let time, numSamples;

const updateTime = () => {
  if(!time){
    time = new Wave(numSamples).fill(0);
    time = time.map((e,i) => e + i / sampleRate);
  }
  else{
    time = time.map(t => t + numSamples / sampleRate);
  }
};

// INTERACT

function askToCreateSlider(label, min, max, step) {
  this.port.postMessage(
    {
      'type': 'slider',
      'label': label,
      'val': eval(label),
      'min': min,
      'max': max,
      'step': step
    }
  );
};

let slider;

// stuff below is the standard way to start an audioProcessor
class AudioProcessor extends AudioWorkletProcessor {

  constructor(options) {
    super(options);

    slider = askToCreateSlider.bind(this);

    // listens for messages from the node, which is in the global scope
    this.port.onmessage = (event) => {
      let msg = event.data;

      // if receives a variable pair, it updates the variable
      if(typeof msg === 'object') {
        if(msg['type'] === 'update') {
          eval(msg['var'] + ' = ' + msg['val'])
        }
      }
    };

  }

  process(inputs, outputs, parameters) {
    let input = inputs[0][0];
    let output = outputs[0][0];

    if(!numSamples){
      numSamples = output.length;
      updateTime();
      setup.call(this); // setup runs once
                        // pass 'this' along so we can send messages
                        // using this page's messageport
    }

    // calls to custom functions (these run on every frame of 128 samples)
    output.set(loop().clip(0.5));
    updateTime();

    return true;
  }
}

registerProcessor('${processorName}', AudioProcessor);


`;

const defaultCode = `function setup() {
}

function loop() {
  return time
    .map(sin(440))
    .mult(0.1);
}
`;


var synth = (function () {
  let analyser;
  let node, audioCtx;
  let editor;
  let processorCount = 0;

  document.querySelector('#editor').innerHTML = defaultCode;
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/clouds");
  editor.setAutoScrollEditorIntoView(true);
  editor.session.setMode("ace/mode/javascript");
  editor.session.setOptions({ tabSize: 2, useSoftTabs: true });
  editor.setFontSize(16);

  // this code will be loaded into the worklet
  function getCode(userCode, processorName){
    return URL.createObjectURL(new Blob([userCode + '\n' + libraryCode(processorName)], { type: 'application/javascript' }));
  }

  function startWorklet(userCode){
    let processorName = 'audio-processor' + processorCount;
    processorCount++;

    let moduleDataUrl = getCode(userCode, processorName);

    if (!audioCtx) {
      audioCtx = new AudioContext();
    }

    // Loads module script via AudioWorklet.
    audioCtx.audioWorklet.addModule(moduleDataUrl).then(() => {
      node = new AudioWorkletNode(audioCtx, processorName);
      analyser = audioCtx.createAnalyser();
      node.connect(audioCtx.destination);
      node.connect(analyser);

      draw();

      // listens for messages from worklet

      node.port.onmessage = (event) => {

        let msg = event.data;

        if (typeof msg === 'object') {
          if (msg["type"] == "slider") {
            makeSlider(msg["label"], msg["val"], msg["min"], msg["max"], msg["step"]);
          }
        }

      };

      // sends messages to the worklet
      //node.port.postMessage('Hello!');

    });
  }

  function load(userCode) {
    editor.session.setValue(userCode);
  }

  function makeSlider(label, val, min, max, step) {

    let innerHTML =
    `
    <div class="slidercontainer">
      <h5><span class="data-label">${label}:</span> <output id="parameter_${label}">${val}</output></h5>
      <input type="range" min="${min}" max="${max}" value="${val}" step = "${step}"
      class="slider" id="slider${label}" oninput="parameter_${label}.value=value">
    </div>
    `;
    $('#dom').append(innerHTML);
    var domSlider = document.getElementById('slider' + label);
    editor.resize();

    updateVar(label, val);

    domSlider.addEventListener('input', function() {
      updateVar(label, this.value);
    });

  }

  function updateVar(myVar, myVal) {
    sendMessage({
      type: 'update',
      var: myVar,
      val: myVal
    });
  }

  function sendMessage(msg) {
    if(node) {node.port.postMessage(msg);}
  }

  document.getElementById("play").onclick = function(){
    var updatedCode = editor.getSession().getValue();
    if(node) {node.disconnect();}
    $( "#dom" ).empty();
    editor.resize();
    startWorklet(updatedCode);
  };

  document.getElementById("stop").onclick = function(){
    if (node) {node.disconnect();}
    $( "#dom" ).empty();
    editor.resize();
  };

  // Spectrum Analyser from https://codepen.io/ContemporaryInsanity/pen/Mwvqpb

  var scopeCtx = document.getElementById('scope').getContext('2d');
  var spectCtx = document.getElementById('spectrum').getContext('2d');

  function draw() {
    drawSpectrum(analyser, spectCtx);
    drawScope(analyser, scopeCtx);

    requestAnimationFrame(draw);
  }

  function drawSpectrum(analyser, ctx) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    var freqData = new Uint8Array(analyser.frequencyBinCount);
    var scaling = height / 256;
    let xScale = 1024 / width;

    analyser.getByteFrequencyData(freqData);

    ctx.fillStyle = '#eef5db';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1C2541';
    ctx.beginPath();


    for (var x = 0; x < width; x++)
      ctx.lineTo(x, height - freqData[Math.round(x * xScale)] * scaling - 1);

    ctx.stroke();
  }

  function drawScope(analyser, ctx) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    var timeData = new Uint8Array(analyser.frequencyBinCount);
    var scaling = 2 * height / 256;
    var offset = 2 * height - height/2;
    var risingEdge = 0;
    var edgeThreshold = 5;

    analyser.getByteTimeDomainData(timeData);
    var xRange = timeData.length;

    ctx.fillStyle = '#eef5db';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1C2541';
    ctx.beginPath();

    // No buffer overrun protection
    while (timeData[risingEdge++] - 128 > 0 && risingEdge <= width);
    if (risingEdge >= width) risingEdge = 0;

    while (timeData[risingEdge++] - 128 < edgeThreshold && risingEdge <= width);
    if (risingEdge >= width) risingEdge = 0;

    for (var x = risingEdge; x < xRange && x - risingEdge < width; x++)
      ctx.lineTo(x - risingEdge, offset - timeData[x] * scaling);

    ctx.stroke();
  }

  return {
    load: load
  };

})();
