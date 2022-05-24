import './style.css';

import picasso from 'picasso.js';

const calculateSizes = (rect, renderer, string, isName) => {
  let desiredRect = { ...rect };
  // add some padding
  desiredRect.width -= 30;
  desiredRect.height -= 30;
  const A = desiredRect.width * desiredRect.height;
  const predicted = Math.sqrt(A / string.length);
  let computed = renderer.measureText({
    fontSize: `${predicted}px`,
    text: string,
  });
  let ratioX = desiredRect.width / computed.width;
  let ratioY = computed.height / desiredRect.height;

  let optimal = Math.min(rect.height, predicted * ratioX);

  // finally, check the text height isn't too big for the container
  if (ratioY >= 0.5) {
    optimal /= 2;
    computed = renderer.measureText({
      fontSize: `${optimal}px`,
      text: string,
    });
    ratioY = computed.height / desiredRect.height;
    ratioX = 1;
  }
  const fontSize = isName ? `${optimal / 2}px` : `${optimal}px`;
  return {
    computed,
    ratioX,
    ratioY,
    fontSize,
  };
};

const customKPI = () => ({
  require: ['chart', 'renderer', 'element'],
  renderer: 'canvas',
  render() {
    const { settings, rect, renderer } = this;
    const { name, value, nameColor, valueColor, showLogs } = settings;

    const nameObj = calculateSizes(rect, renderer, name, true);
    const valueObj = calculateSizes(rect, renderer, value, false);
    return [
      {
        type: 'text',
        text: name,
        fill: nameColor ? nameColor : 'gray',
        fontSize: nameObj.fontSize,
        x: rect.width / 2 - (nameObj.computed.width / 4) * nameObj.ratioX,
        y: rect.height / 2 - nameObj.computed.height * nameObj.ratioY,
      },
      {
        type: 'text',
        text: value,
        fill: valueColor ? valueColor : 'blue',
        fontSize: valueObj.fontSize,
        x: rect.width / 2 - (valueObj.computed.width / 2) * valueObj.ratioX,
        y: rect.height / 2 + valueObj.computed.height * valueObj.ratioY,
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
        name: 'my title super long',
        value: '751.1',
        nameColor: 'red',
        valueColor: 'pink',
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
        name: 'My Title',
        value: '751.1',
      },
    ],
  },
});

picasso.chart({
  element: document.querySelector('#container3'),
  data: [],
  settings: {
    components: [
      {
        type: 'customKPI',
        name: 'My Title',
        value: '751.1',
        showLogs: true,
      },
    ],
  },
});

picasso.chart({
  element: document.querySelector('#container4'),
  data: [],
  settings: {
    components: [
      {
        type: 'customKPI',
        name: 'My Title',
        value: '751.1',
        showLogs: true,
      },
    ],
  },
});
