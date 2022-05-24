import './style.css';

import picasso from 'picasso.js';

const calculateSizes = (rect, renderer, string, isName) => {
  let desiredRect = { ...rect };
  let fontSize, x, y;

  // add some padding
  desiredRect.width -= 30;
  desiredRect.height -= 30;

  // generated a predicted optimal size based on rect area
  const A = desiredRect.width * desiredRect.height;
  const predicted = Math.sqrt(A / string.length);
  let computed = renderer.measureText({
    fontSize: `${predicted}px`,
    text: string,
    fontFamily: 'Arial',
  });
  let ratioX = computed.width / desiredRect.width;
  let ratioY = computed.height / desiredRect.height;

  let optimal = ratioX < 1
      ? Math.min(rect.height / 4, predicted * ratioX)
      : Math.min(rect.height / 4, predicted / ratioX);

  // assign an actual size based on isName or isValue
  fontSize = `${optimal}px`;

  computed = renderer.measureText({
    fontSize: fontSize,
    text: string,
    fontFamily: 'Arial',
  });
  ratioX = computed.width / desiredRect.width;
  ratioY = computed.height / desiredRect.height;

  x = (rect.width - computed.width) / 2;
  y = isName ? rect.height / 3 : (rect.height * 2 / 3);

  return {
    computed,
    ratioX,
    ratioY,
    fontSize,
    x,
    y,
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
    console.log(nameObj);
    return [
      {
        type: 'text',
        text: name,
        fill: nameColor ? nameColor : 'gray',
        fontSize: nameObj.fontSize,
        x: nameObj.x,
        y: nameObj.y,
      },
      {
        type: 'text',
        text: value,
        fill: valueColor ? valueColor : 'blue',
        fontSize: valueObj.fontSize,
        x: valueObj.x,
        y: valueObj.y,
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
        name: 'my title is slowly getting longer',
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
        name: 'M',
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
        name: 'My Title is getting longer',
        value: '751.1',
        showLogs: true,
      },
    ],
  },
});
