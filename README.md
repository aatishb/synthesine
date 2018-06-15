# synthfromscratch

Hi! This is an experimental library using [audio worklets](https://webaudio.github.io/web-audio-api/#AudioWorklet) and functional programming ideas in JavaScript to implement sound synthesis from scratch. Audio worklets are a new tool that allow you to do real-time sound synthesis in the browser by executing code in a separate audio thread.

[/libraries/ds.js](https://github.com/aatishb/synthfromscratch/blob/master/libraries/dsp.js) is a growing library of functions for sound synthesis

[/examples](https://github.com/aatishb/synthfromscratch/blob/master/examples) contains examples

Each example contains an `index.html` page that sets up the audio worklet, and a `loop.js` sketch that is loaded into the audio worklet. The structure of `loop.js` has a `setup()` function that runs only once, and a `loop()` function that is looped on every frame (of 128 samples). The output of `loop()` is piped to audio.

/libraries/analyser.js is a spectrum analyser sourced from [here](https://codepen.io/ContemporaryInsanity/pen/Mwvqpb)
