---
layout: nav
title: Sound Synthesis From Scratch
---

# Sound Synthesis From Scratch

Hi! This is an experimental live coding environment for experimenting with sound synthesis. You can use it to create noise, sine waves, and other kinds of sound waves, starting from scratch. And you can filter and combine sounds to create more complex sounds like bells, whistles, strings, and so on.

My goal is to better understand how to synthesize sounds from the ground up, and to build a tool that makes it easier for others to do the same. I'm using functional programming ideas in Javascript, which allow us to express audio synthesis ideas in a few, concise lines of code.

This project relies on a new browser tool for sound synthesis, awkwardly named [Audio Worklets](https://webaudio.github.io/web-audio-api/#AudioWorklet) (currently only supported in Google Chrome). This is a fairly new way to run audio processing code in your browser in real-time, by running it in a separate audio thread where it isn't slowed down by web browsing.

[/libraries/ds.js](https://github.com/aatishb/synthfromscratch/blob/master/libraries/dsp.js) is a growing library of functions for sound synthesis that I'm adding to as I go along. It also hides all the messy details of how to launch an audio worklet. The idea is to gradually develop a tool that makes it easier to tinker with sound synthesis in your browser.

To get started, pull up an example from the menu.

Happy audio tinkering!

### Credits

Spectrum analyser sourced from [ContemporaryInsanity](https://codepen.io/ContemporaryInsanity/pen/Mwvqpb).
Icons from [Font Awesome](https://fontawesome.com/icons).
Code editor by [Ace](https://ace.c9.io/).