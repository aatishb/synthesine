---
layout: nav
title: Sound Synthesis From Scratch
---

# Sound Synthesis From Scratch

Hi! This is an experimental library and live coding environment for experimenting with sound synthesis. My goal is to better understand how to synthesize sounds from the ground up, and to build a tool that makes it easier for others to do the same.

We'll create sine waves, white noise, and other kinds of oscillators, starting from scratch, and then do stuff like filter sounds, combine oscillators, and so on, to create more complex sounds like bells, whistles, gongs, strings, and so on.

All of this relies on a new browser tool for sound synthesis, awkwardly called '[Audio Worklets](https://webaudio.github.io/web-audio-api/#AudioWorklet)'. This is a fairly new way to run audio processing code in your browser in real-time, by running audio code in a separate thread where it isn't slowed down by web browsing. That's key, because audio synthesis happens 44,100 times a second, so even a tiny slowdown can result in very glitchy sounds. For the moment, Audio Worklets are only implemented in Google Chrome.

I'm also using functional programming ideas in Javascript, which allow us to express audio synthesis ideas in a few concise lines of code.

[/libraries/ds.js](https://github.com/aatishb/synthfromscratch/blob/master/libraries/dsp.js) is a growing library of functions for sound synthesis that I'm adding to as I go along. It also hides all the messy details of how to launch an audio worklet. The idea is to gradually develop a tool that makes it easier to tinker with sound synthesis in your browser.

To get started, pull up an example from the menu.

Happy audio tinkering!

### Credits

Spectrum analyser sourced from [ContemporaryInsanity](https://codepen.io/ContemporaryInsanity/pen/Mwvqpb).
Icons sources from [Font Awesome](https://fontawesome.com/icons).
Code editor by [Ace](https://ace.c9.io/)