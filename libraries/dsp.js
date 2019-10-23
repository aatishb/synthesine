const libraryCode = (processorName, sampleRate) => `

// WAVE OPERATIONS

const add = v => (e, i) => e + indexOf(v,i);
const sub = v => (e, i) => e - indexOf(v,i);
const mult = v => (e, i) => e * indexOf(v,i);
const div = v => (e, i) => e / indexOf(v,i);
const modulate = v => (e, i) => e * (1 + v[i])
const fade = decayTime => time.map(t => Math.exp(- t / Math.abs(decayTime) ));

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

// HELPER FUNCTIONS

function indexOf(x, i) {
  if (!isNaN(x[i])) {
    return x[i];
  } else if (!isNaN(x) && isNaN(x.length)) {
    return x;
  } else {
    return 0;
  }
}

const range = n => [...Array(n).keys()];
const repeat = (n, wave, func) => range(n).reduce(func, wave);


// WAVE OBJECT

class Wave extends Float32Array {

  constructor(n = numSamples) {
      super(n);
  }

  add(v) { return this.map(add(v)); }
  sub(v) { return this.map(sub(v)); }
  mult(s) { return this.map(mult(s)); }
  div(s) { return this.map(div(s)); }
  clip(g) { return this.map(clip(g)); }
  modulate(v) { return this.map(modulate(v)); }
  fade(t) { return this.mult(fade(t)); }
  apply(filter) {return this.map(filter.apply);}

}

// OSCILLATORS

const whiteNoise = () => 2 * Math.random() - 1;
const phasor = f => t => (f * t) % 1;
const sin = (f, phase = 0) => (t, i) => Math.sin(2 * Math.PI * f * t + indexOf(phase, i));
const square = (f, phase = 0) => (t, i) => clip(1)(sin(f, phase)(t, i) * 1000);
const saw = (f, phase = 0) => (t, i) => 2 * ( (f * t + indexOf(phase, i)/(2 * Math.PI)) - Math.floor(0.5 + (f * t + indexOf(phase, i)/(2 * Math.PI))));
const triangle = (f, phase = 0) => (t, i) => 2 * Math.abs(saw(f, indexOf(phase, i))(t)) - 1;

// deprecate sinDamped in favor of .fade
const sinDamped = (f, tau, phase = 0) => t => Math.exp(- t / Math.max(0.00001, tau)) * sin(f, phase)(t);

const glottalPulse = (f, phase = 0) => (t, i) => {
  let t0 = (f * t + indexOf(phase, i)/(2 * Math.PI)) % 1;
  // time from onset of pulse to peak = 0.3 cycles
  // pulse duration (time from onset to zero) = 0.6 cycles

  if (t0 < 0.3) {
    return(1 - Math.cos(Math.PI * t0 / 0.3))/2;
  } else if (t0 < 0.6) {
    return Math.cos((Math.PI/2) * (t0 - 0.3) / (0.6 - 0.3) );
  } else {
    return 0;
  }
};

// PRE-BUILT WAVES

const sinWave = (f, phase = 0) => time.map(sin(f,phase));
const sqrWave = (f, phase = 0) => time.map(square(f,phase));
const sawWave = (f, phase = 0) => time.map(saw(f,phase));
const triWave = (f, phase = 0) => time.map(triangle(f,phase));
const noiseWave = () => time.map(whiteNoise);
const glottalWave = (freq, phase = 0) => time.map(glottalPulse(freq, phase));

// PRE-DEFINED VARIABLES

const PI = Math.PI;

// FILTERS

function delay(m) {

  let y = 0;
  let x_arr = Array(m).fill(0);

  function equation(x) {
   y = x_arr.shift();
   x_arr.push(x);
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

function comb(g1, m1, g2, m2) {

  let y = 0;
  let x_arr = Array(m1).fill(0);
  let y_arr = Array(m2).fill(0);

  function equation(x) {
   y = x + g1 * (x_arr.shift() || 0) - g2 * (y_arr.shift() || 0);
   x_arr.push(x);
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

function lowPass(alpha) {
  let y = 0;
  let y1 = 0;

  function equation(x) {
    y = alpha * x +  (1 - alpha) * y1;
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

function highPass(alpha) {
  let y = 0;
  let y1 = 0;

  function equation(x) {
    y = x - alpha * y1;
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

function twoPointAverage() {
  let y = 0;
  let x1 = 0;

  function equation(x) {
    y = 0.5 * (x + x1);
    x1 = x;
    return y;
  };

  return {
    apply: equation
  };
};

function dcBlocker(alpha) {
  let y = 0;
  let y1 = 0;
  let x1 = 0;

  function equation(x) {
    y = x - x1 +  (1 - alpha) * y1;
    x1 = x;
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

function allPass(c) {
  let y, x1 = 0, y1 = 0;

  function equation(x) {
    y = c*x + x1 - c*y1;

    x1 = x; // update previous input to current input
    y1 = y; // update previous output to current output
    return y;
  };

  function set(newC) {
    c = newC;
  };

  return {
    apply: equation,
    set: set
  };
};


function bandPass(freq, bandwidth) {

  let r, gain, cosPoleAngle;
  set(freq, bandwidth);

  let y = 0;
  let y1 = 0;
  let y2 = 0;
  let x1 = 0;
  let x2 = 0;

  function equation(x) {
    y = gain * (x - r * x2) + 2 * r * cosPoleAngle * y1 - r * r * y2;
    y2 = y1;
    y1 = y;
    x2 = x1;
    x1 = x;
    return y;
  };

  function set(newFreq, newBandwidth) {
    freq = newFreq;
    bandwidth = newBandwidth;
    r = Math.exp(- Math.PI * bandwidth / sampleRate);
    gain = 1 - r;
    cosPoleAngle = Math.cos(2 * Math.PI * freq / sampleRate);
  };

  return {
    apply: equation,
    set: set
  };

};


function resonator(freq, bandwidth) {

  let q, gain, cosPoleAngle;
  set(freq, bandwidth);

  let y = 0;
  let y1 = 0;
  let y2 = 0;
  let x1 = 0;
  let x2 = 0;

  function equation(x) {
    y = gain * (x - x2) + 2 * q * cosPoleAngle * y1 - q * q * y2;
    y2 = y1;
    y1 = y;
    x2 = x1;
    x1 = x;
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

};

function vocalTract(a) {

  let rl = -0.99, rg = 0.75;
  let delta;
  let r, numSegments, f, b;

  set(a);

  function equation(x) {
    f[0] = x + rg * b[0];

    for (let j = 1; j >= 0; j--){
      for (let i = j; i < numSegments - 1; i+=2) {
        delta = r[i] * (f[i] - b[i+1]);
        f[i+1] = f[i] + delta;
        b[i] = b[i+1] + delta;
      }
    }

    b[numSegments - 1] = rl * f[numSegments - 1];

    return f[numSegments - 1];
  };

  function set(newA) {
    a = newA;

    numSegments = a.length;
    f = new Wave(numSegments);
    b = new Wave(numSegments);
    r = [];

    for (let i = 0; i < numSegments - 1; i++){
      r.push( (a[i] - a[i+1])/(a[i] + a[i+1]) );
    }
  };

  return {
    apply: equation,
    set: set
  };
};


// TIME FUNCTIONS

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


// WAVEGUIDE

class WaveGuide extends Float32Array {

  constructor(n = numSamples) {
    super(numSamples);

    this.waveGuideSize = n;
    this.waveGuideBuffer = new Wave(this.waveGuideSize);

    this.pointer = 0;
  }

  initialize(f) {

    if (typeof f == 'number') {
      this.waveGuideBuffer = this.waveGuideBuffer.fill(f);
    }
    else if (f instanceof Function) {
      this.waveGuideBuffer = this.waveGuideBuffer.map(f);
    }

    return this.loadBufferToWave();
  }

  loadBufferToWave() {

    let i;

    for(i = 0; i < numSamples; i++) {
      this[i] = this.waveGuideBuffer[(this.pointer + i) % this.waveGuideSize];
    }

    return this;
  }

  update(array) {
    let i;

    for(i = 0; i < numSamples; i++) {
      this.waveGuideBuffer[(this.pointer + i) % this.waveGuideSize] = array[i];
    }

    return this.loadBufferToWave();
  }

  set(array) {

    let i;

    for(i = 0; i < numSamples; i++) {
      this[i] = array[i];
    }

    return this;

  }


  delay(n = numSamples) {
    this.pointer = (this.pointer + n) % this.waveGuideSize;

    return this.loadBufferToWave();
  }

  add(s) {
    return this.set(this.map(add(s)));
  }

  mult(s) {
    return this.set(this.map(mult(s)));
  }

  clip(g) {
    return this.set(this.map(clip(g)));
  }

  apply(filter) {
    return this.set(this.map(filter.apply));
  }





}


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

function askToRecord(filename) {
  this.port.postMessage(
    {
      'type': 'record',
      'filename': filename
    }
  );
};


// ERROR HANDLING

function getLineNo(error) {
  let errorStack = error.stack.split('at');
  errorStack = errorStack[errorStack.length - 2];
  let blobStart = errorStack.indexOf('(');
  let blobEnd = errorStack.indexOf(')');
  let blob = errorStack.substring(blobStart+1, blobEnd).split(":");
  let lineNo = blob[blob.length - 2];

  return lineNo;
}


// clock function to update time on every loop

const getTime = () => {

  let internalTime;

  function init() {
    internalTime = new Wave(numSamples).map((e,i) => e + i / sampleRate);
    return internalTime;
  }

  function tick() {
    internalTime = internalTime.map(t => t + numSamples / sampleRate);
    return internalTime;
  };

  return {
    init: init,
    tick: tick
  };
};

const clock = getTime();

// WORKLET SETUP

let numSamples;
const sampleRate = ${sampleRate};
let slider;
let record;
let time;
let initialized = false;

class AudioProcessor extends AudioWorkletProcessor {

  constructor(options) {
    super(options);

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

  // runs on every sound frame
  process(inputs, outputs, parameters) {
    try {
      let input = inputs[0][0];
      let output = outputs[0][0];

      if (!initialized) {
        numSamples = output.length;

        time = clock.init(); // initialize time

        slider = askToCreateSlider.bind(this);
        record = askToRecord.bind(this);

        // setup runs once
        // pass 'this' along so we can send messages
        // using the worklet messageport
        setup.call(this);

        initialized = true;
      }

      output.set(loop().clip(0.5));
      time = clock.tick();

    } catch (error) {

      this.port.postMessage(
        {
          type: 'error',
          error: error.message
          // lineNo: getLineNo(error)
        }
      );

      throw error;
    }

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
  let rec;
  let editor;
  let processorCount = 0;

  document.querySelector('#editor').innerHTML = defaultCode;
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/clouds");
  editor.setAutoScrollEditorIntoView(true);
  editor.session.setMode("ace/mode/javascript");
  editor.session.setOptions({ tabSize: 2, useSoftTabs: true });
  editor.setFontSize(16);

  // resize ace editor when live editor container height changes
  let resizeObserver = new MutationObserver( function(){ editor.resize(); } );
  resizeObserver.observe(document.getElementById("container"),{attributes:true});

  // this code will be loaded into the worklet
  function getCode(userCode, processorName, sampleRate){
    return URL.createObjectURL(
      new Blob([userCode + '\n' + libraryCode(processorName, sampleRate)],
        { type: 'application/javascript' })
    );
  }

  function resumeContextOnInteraction(audioContext) {
    // from https://audio-dsp-playground-polyfilled.surge.sh/livecode.js
    // from https://github.com/captbaritone/winamp2-js/blob/a5a76f554c369637431fe809d16f3f7e06a21969/js/media/index.js#L8-L27
    if (audioContext.state === "suspended") {
      const resume = async () => {
        await audioContext.resume();

        if (audioContext.state === "running") {
          document.body.removeEventListener("touchend", resume, false);
          document.body.removeEventListener("click", resume, false);
          document.body.removeEventListener("keydown", resume, false);
        }
      };

      document.body.addEventListener("touchend", resume, false);
      document.body.addEventListener("click", resume, false);
      document.body.addEventListener("keydown", resume, false);
    }
  }


  function startWorklet(userCode) {
    let processorName = 'audio-processor' + processorCount;
    processorCount++;

    if (!audioCtx) {
      audioCtx = new AudioContext();
      resumeContextOnInteraction(audioCtx);
    }

    let moduleDataUrl = getCode(userCode, processorName, audioCtx.sampleRate);

    // Loads module script via AudioWorklet.
    audioCtx.audioWorklet.addModule(moduleDataUrl).then(() => {
      node = new AudioWorkletNode(audioCtx, processorName);
      analyser = audioCtx.createAnalyser();
      rec = false; // reset recorded variable to false
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

          else if (msg["type"] == "record") {
            // setting up recorder following https://blog.addpipe.com/using-recorder-js-to-capture-wav-audio-in-your-html5-web-site/
            //let input = audioCtx.destination;
            rec = new Recorder(node, {
              numChannels: 1
            });
            rec.filename = msg["filename"];
            rec.record(); // start recording
          }

          else if (msg["type"] == "error") {
            let errorMsg = ' Error';
            if(msg.lineNo) {
              errorMsg += ' (line ';
              errorMsg += msg.lineNo;
              errorMsg += ')';
            }
            errorMsg += ': ';
            if(msg.error.includes('Cannot read property') &&
              msg.error.includes('of undefined'))
            {
              errorMsg += 'A function is expecting input that it isn\'t receiving';
            }
            else if (msg.error.includes('undefined is not a function')){
              errorMsg += 'A function is expecting input that it isn\'t receiving';
            }
            else {
              errorMsg += msg.error;
            }
            document.getElementById("log").innerHTML = errorMsg;
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
    document.getElementById("log").innerHTML = "";
    var updatedCode = editor.getSession().getValue();
    if(node) {node.disconnect();}
    $( "#dom" ).empty();
    editor.resize();
    startWorklet(updatedCode);
  };

  document.getElementById("stop").onclick = function(){
    if (node) {
      node.disconnect();
    }

    // check if recorded has started
    if (rec) {
      rec.stop(); // stop recording
      rec.exportWAV(blob => createDownloadLink(blob, rec.filename));
    }
    $( "#dom" ).empty();
    editor.resize();
  };

  // from https://stackoverflow.com/a/33542499
  function createDownloadLink(blob, filename = 'output.wav') {

    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
  }


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
