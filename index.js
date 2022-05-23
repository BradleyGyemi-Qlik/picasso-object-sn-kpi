import './style.css';

import picasso from 'picasso.js';

const calculateSizes = (rect, desiredRect, renderer, string) => {
  const A = desiredRect.width * desiredRect.height;
  const predicted = Math.sqrt(A / string.length);
  const computed = renderer.measureText({
    fontSize: `${predicted}px`,
    text: string,
  });
  const ratioX = desiredRect.width / computed.width;
  const ratioY = computed.height / desiredRect.height;
  const optimal = Math.min(rect.height, predicted * ratioX);
  return {
    computed,
    ratioX,
    ratioY,
    optimal,
  };
};

const customKPI = () => ({
  require: ['chart', 'renderer', 'element'],
  renderer: 'canvas',
  render() {
    const { settings, rect, renderer } = this;
    const { name, value, nameColor, valueColor } = settings;
    let desiredRect = { ...rect };
    // add some padding
    desiredRect.width -= 30;
    desiredRect.height -= 30;
    const nameObj = calculateSizes(rect, desiredRect, renderer, name);
    const valueObj = calculateSizes(rect, desiredRect, renderer, value);
    return [
      {
        type: 'text',
        text: name,
        fill: nameColor ? nameColor : 'gray',
        fontSize: `${nameObj.optimal / 2}px`,
        x: rect.width / 2 - (nameObj.computed.width / 4) * nameObj.ratioX,
        y: rect.height / 2 - nameObj.computed.height * nameObj.ratioY,
      },
      {
        type: 'text',
        text: value,
        fill: valueColor ? valueColor : 'blue',
        fontSize: `${valueObj.optimal}px`,
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
        valueColor: '',
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
