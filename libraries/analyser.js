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

  analyser.getByteFrequencyData(freqData);

  ctx.fillStyle = 'rgba(0, 20, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgb(0, 200, 0)';
  ctx.beginPath();

  for (var x = 0; x < width; x++)
    ctx.lineTo(x, height - freqData[x] * scaling);

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

  ctx.fillStyle = 'rgba(0, 20, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgb(0, 200, 0)';
  ctx.beginPath();

  // No buffer overrun protection
  while (timeData[risingEdge++] - 128 > 0 && risingEdge <= width);
  if (risingEdge >= width) risingEdge = 0;

  while (timeData[risingEdge++] - 128 < edgeThreshold && risingEdge <= width);
  if (risingEdge >= width) risingEdge = 0;

  for (var x = risingEdge; x < timeData.length && x - risingEdge < width; x++)
    ctx.lineTo(x - risingEdge, height - timeData[x] * scaling);

  ctx.stroke();
}