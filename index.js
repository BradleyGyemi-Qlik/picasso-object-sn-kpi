import './style.css';

import picasso from 'picasso.js';

const customKPI = () => ({
  require: ['chart', 'renderer', 'element'],
  renderer: 'canvas',
  render() {
    const { settings, rect, renderer } = this;
    const { text } = settings;
    let desiredRect = { ...rect };
    // add some padding
    desiredRect.width -= 20;
    desiredRect.height -= 20;
    let A = desiredRect.width * desiredRect.height;
    let predicted = Math.sqrt(A / text.length);
    let computed = renderer.measureText({ fontSize: `${predicted}px`, text });
    let ratio = desiredRect.width / computed.width;
    let optimal = Math.min(rect.height, predicted * ratio);
    let fontSize = `${optimal}px`;
    return [
      {
        type: 'text',
        text,
        fill: 'black',
        fontSize,
        x: 10,
        y: rect.height / 2,
      },
    ];
  },
});

picasso.renderer.default('canvas');
picasso.component('customKPI', customKPI());

picasso.chart({
  element: document.querySelector('#container'),
  data: [],
  settings: {
    components: [
      {
        type: 'customKPI',
        text: 'my title super long',
      },
    ],
  },
});

picasso.chart({
  element: document.querySelector('#container2'),
  data: [],
  settings: {
    components: [
      {
        type: 'customKPI',
        text: 'My Title',
      },
    ],
  },
});
