const libraryCode = `

const add = v => (e, i) => e + (v[i] || v);

Float32Array.prototype.add = function(v) {
  return this.map(add(v));
};

const sub = v => (e, i) => e - (v[i] || v);

Float32Array.prototype.sub = function(v) {
  return this.map(sub(v));
};

const mult = s => e => e * s;

Float32Array.prototype.mult = function(s) {
  return this.map(mult(s));
};

const div = s => e => e / s;

Float32Array.prototype.div = function(s) {
  return this.map(div(s));
};

const delay = m => (e, i, x) => x[(i + m) % numSamples];

Float32Array.prototype.delay = function(m) {
  return this.map(delay(m));
};

const clip = (g = 0.3) => e => {
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

Float32Array.prototype.clip = function(g) {
  return this.map(clip(g));
};

Float32Array.prototype.convolve = function(carrier) {
  return this.map((e,i) => e * carrier[i]);
};

Float32Array.prototype.modulate = function(carrier) {
  return this.map((e,i) => e * (1 + carrier[i]));
};

Float32Array.prototype.applyFilter = function(clause) {
  let output = this.slice();
  let filterOutput = i => clause(this, output, i);

  for (let i = 0; i < numSamples; i++) {
    output[i] = filterOutput(i);
  }

  return output;
};

const whiteNoise = () => 2 * Math.random() - 1;
const phasor = f => t => (f * t) % 1;
const sin = (f, phase = 0) => (t, i) => Math.sin(2 * Math.PI * f * t + (phase[i] || 0));
const square = (f, phase = 0) => (t, i) => clip(1)(sin(f, phase)(t, i) * 1000);
const saw = f => t => 2 * (f * t - Math.floor(0.5 + f * t));
const triangle = f => t => 2 * Math.abs(saw(f)(t)) - 1;
const sinDamped = (f, tau, phase = 0) => t => Math.exp(- t / tau) * sin(f, phase)(t);

const average = (e, i, x) => 0.5 * (x[i] + x[i - 1]) || x[i];

const comb = (g1, g2, m1, m2) => (input, output, i) => {
   return input[i] + g1 * (input[i - m1] || 0) - g2 * (output[i - m2] || 0);
};

const highPass = (b1, b2) => (input, output, i) => {
  return (b1 * input[i] + b2 * input[i - 1])
    || input[i];
};

const lowPass = alpha => (input, output, i) => {
  return ( alpha * input[i] +  (1 - alpha) * output[i - 1] )
    || input[i];
};

const biQuad = (gain, freqZero, resZero, freqPole, resPole) =>
  (input, output, i) => {
    return gain
    * (input[i]
        - 2 * resZero * Math.cos(2 * Math.PI * freqZero / sampleRate) * input[i-1]
        + resZero * resZero * input[i-2]
    )
      + 2 * resPole * Math.cos(2 * Math.PI * freqPole / sampleRate) * output[i-1]
      - resPole * resPole * output[i-2]
    || gain * input[i];
  };

const resonator = (freq, q) => {
  let gain = Math.sqrt((1 - q * q)/2);
  return (input, output, i) => {
    return gain * (input[i] - input[i-2])
      + 2 * q * Math.cos(2 * Math.PI * (freq[i] || freq) / sampleRate) * output[i-1]
      - q * q * output[i-2]
      || gain * input[i];
  };
};

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

let time, numSamples;

const updateTime = () => {
  if(!time){
    time = new Float32Array(numSamples).fill(0);
    time = time.map((e,i) => e + i / sampleRate);
  }
  else{
    time = time.map(t => t + numSamples / sampleRate);
  }
};

function askToCreateSlider(label, val, min, max, step) {
  this.port.postMessage(
    {
      'type': 'slider',
      'label': label,
      'val': val,
      'min': min,
      'max': max,
      'step': step
    }
  );
};

let createSlider;

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
  editor.session.setMode("ace/mode/javascript");
  editor.session.setOptions({ tabSize: 2, useSoftTabs: true });
  editor.setFontSize(16);

  // this code will be loaded into the worklet
  function getCode(userCode, processorName){
    return `data:text/javascript;utf8,
  ${libraryCode}
  ${userCode}

  // stuff below is the standard way to start an audioProcessor
  class AudioProcessor extends AudioWorkletProcessor {

    constructor(options) {
      super(options);

      createSlider = askToCreateSlider.bind(this);

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

    let innerHTML = `<div class="slidecontainer"><input type="range" min="${min}" max="${max}" value="${val}" step="${step}" class="slider" id="slider${label}"></div>`;
    $('#dom').append(innerHTML);
    var slider = document.getElementById('slider' + label);

    updateVar(label, val);

    slider.oninput = function() {
      updateVar(label, this.value);
    };
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
    startWorklet(updatedCode);
  };

  document.getElementById("stop").onclick = function(){
    if (node) {node.disconnect();}
    $( "#dom" ).empty();
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
    ctx.strokeStyle = 'dodgerblue';
    ctx.beginPath();


    for (var x = 0; x < width; x++)
      ctx.lineTo(x, height - freqData[Math.round(x * xScale)] * scaling - 1);

    ctx.stroke();
  }

  function drawScope(analyser, ctx) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    var timeData = new Uint8Array(analyser.frequencyBinCount);
    var scaling = height / 256;
    var risingEdge = 0;
    var edgeThreshold = 5;

    analyser.getByteTimeDomainData(timeData);
    var xRange = timeData.length;

    ctx.fillStyle = '#eef5db';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'dodgerblue';
    ctx.beginPath();

    // No buffer overrun protection
    while (timeData[risingEdge++] - 128 > 0 && risingEdge <= width);
    if (risingEdge >= width) risingEdge = 0;

    while (timeData[risingEdge++] - 128 < edgeThreshold && risingEdge <= width);
    if (risingEdge >= width) risingEdge = 0;

    for (var x = risingEdge; x < xRange && x - risingEdge < width; x++)
      ctx.lineTo(x - risingEdge, height - timeData[x] * scaling);

    ctx.stroke();
  }

  return {
    load: load
  };

})();