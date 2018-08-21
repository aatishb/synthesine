---
layout: nav
title: Synthesine
---

# Synthesine

Hi! This is an experimental live coding environment for synthesizing sounds in your browser in real-time. You can use it to create noise, sine waves, and other kinds of audio waves, starting from scratch. You can filter or combine these to create more complex sounds like bells, whistles, strings, ocean sounds, and so on.

My goal with this project is to learn how to synthesize interesting sounds, and build a tool that makes it easier for other folks to do the same. This project relies on [Audio Worklets](https://developers.google.com/web/updates/2017/12/audio-worklet) (currently only supported in Google Chrome). This is a new browser tool that lets us run audio processing code in a separate thread where it isn't slowed down by web browsing. In practice, it means we can synthesize sounds in the browser that were previously impossible.

We'll also use functional programming ideas in Javascript, which allow us to manipulate audio waves with just a few, concise lines of code. It might be a good idea to familiarize yourself with the [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function and [arrow notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) in Javascript, by checking out [a tutorial](https://www.discovermeteor.com/blog/understanding-javascript-map/) before diving in here. Here are two more [good](https://www.youtube.com/watch?v=H4awPsyugS0&list=PLRqwX-V7Uu6aAEUqu96Newc-7qpuh-cxc&index=1) [resources](https://www.youtube.com/watch?v=e-5obm1G_FY) to dig deeper.


[/libraries/ds.js](https://github.com/aatishb/synthesine/blob/master/libraries/dsp.js) is a growing library of functions for sound synthesis. It hides all the messy details of working with Audio Worklets, so you can focus on the logic without the overhead. The hope is to gradually develop a tool that makes it easier to explore sound synthesis with code.

### Credits

Developed by Aatish Bhatia with UI contributions by Shefali Nayak. Spectrum analyser sourced from [ContemporaryInsanity](https://codepen.io/ContemporaryInsanity/pen/Mwvqpb).
Icons from [Font Awesome](https://fontawesome.com/icons).
Code editor by [Ace](https://ace.c9.io/).
