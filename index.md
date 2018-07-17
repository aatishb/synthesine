---
layout: nav
title: Synth From Scratch
---

# Synth From Scratch

Hi! This is an experimental live coding environment to experiment with synthesizing sounds. You can use it to create noise, sine waves, and other kinds of audio waves, starting from scratch. You can filter or combine these to create more complex sounds like bells, whistles, strings, ocean sounds, and so on.

To get started, pull up an example from the menu. Happy audio tinkering!

<hr>

My goal is to better understand how to synthesize sounds from the ground up, and to build a tool that makes it easier for other folks to do the same. We'll use functional programming ideas in Javascript, which allow us to manipulate audio waves with just a few, concise lines of code. If you aren't familiar with how the [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function or [arrow notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) works in Javascript, it might be a good idea to read [a tutorial](https://www.discovermeteor.com/blog/understanding-javascript-map/) before diving in here. Here are two more [good](https://www.youtube.com/watch?v=H4awPsyugS0&list=PLRqwX-V7Uu6aAEUqu96Newc-7qpuh-cxc&index=1) [resources](https://www.youtube.com/watch?v=e-5obm1G_FY) to dig deeper.

This project relies on a new browser tool for sound synthesis, awkwardly named [Audio Worklets](https://developers.google.com/web/updates/2017/12/audio-worklet) (currently only supported in Google Chrome). This allows us to run audio processing code in a separate audio thread where it isn't slowed down by web browsing.

[/libraries/ds.js](https://github.com/aatishb/synthfromscratch/blob/master/libraries/dsp.js) is a growing library of functions for sound synthesis. It hides all the messy details of working with audio worklets, so you can focus on the logic without the overhead. The idea is to gradually develop a tool that makes it easier to explore sound synthesis with code.

### Credits

Developed by Aatish Bhatia with UI contributions by Shefali Nayak. Spectrum analyser sourced from [ContemporaryInsanity](https://codepen.io/ContemporaryInsanity/pen/Mwvqpb).
Icons from [Font Awesome](https://fontawesome.com/icons).
Code editor by [Ace](https://ace.c9.io/).
