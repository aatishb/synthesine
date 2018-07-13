---
layout: nav
title: Sound Synthesis From Scratch
---

# Sound Synthesis From Scratch

Hi! This is an experimental live coding environment for experimenting with sound synthesis. You can use it to create noise, sine waves, and other kinds of sound waves, starting from scratch. And you can filter and combine sounds to create more complex sounds like bells, whistles, strings, ocean sounds, and so on.

My goal is to better understand how to synthesize sounds from the ground up, and to build a tool that makes it easier for others to do the same. We'll use functional programming ideas in Javascript, which allow us to manipulate audio waves with just a few, concise lines of code. If you aren't familiar with how the [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function or [arrow notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) works in Javascript, it's worth reading [a tutorial](https://www.discovermeteor.com/blog/understanding-javascript-map/) or two before diving in here. Here are [two](https://www.youtube.com/watch?v=H4awPsyugS0&list=PLRqwX-V7Uu6aAEUqu96Newc-7qpuh-cxc&index=1) [more](https://www.youtube.com/watch?v=e-5obm1G_FY) good resources to dig deeper.

This project relies on a new browser tool for sound synthesis, awkwardly named [Audio Worklets](https://developers.google.com/web/updates/2017/12/audio-worklet) (currently only supported in Google Chrome). This allows us to run audio processing code in the browser in real-time, by running it in a separate audio thread where it isn't slowed down by web browsing.

[/libraries/ds.js](https://github.com/aatishb/synthfromscratch/blob/master/libraries/dsp.js) is a growing library of functions for sound synthesis. It hides the messy details of working with audio worklets, so you can focus on the logic without the overhead. The idea is to gradually develop a tool that makes it easier to explore sound synthesis with code.

To get started, pull up an example from the menu.

Happy audio tinkering!

### Credits

Spectrum analyser sourced from [ContemporaryInsanity](https://codepen.io/ContemporaryInsanity/pen/Mwvqpb).
Icons from [Font Awesome](https://fontawesome.com/icons).
Code editor by [Ace](https://ace.c9.io/).