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
  });
  let ratioX = computed.width / desiredRect.width;
  let ratioY = computed.height / desiredRect.height;

  let optimal =
    ratioX < 1
      ? Math.min(rect.height / 4, predicted * ratioX)
      : Math.min(rect.height / 4, predicted / ratioX);

  // assign an actual size based on isName or isValue
  fontSize = `${optimal}px`;

  computed = renderer.measureText({
    fontSize: fontSize,
    text: string,
  });
  ratioX = computed.width / desiredRect.width;
  ratioY = computed.height / desiredRect.height;

  x = (rect.width - computed.width) / 2;
  y = isName
    ? (rect.height * 1) / 3 + computed.height / 4
    : (rect.height * 2) / 3 + computed.height / 4;

  return {
    computed,
    ratioX,
    ratioY,
    fontSize,
    x,
    y,
  };
};

const calculateTitleDims = (rect, renderer, string) => {
  let fontNum = rect.height / 10;
  let fontSize = `${fontNum}px`;
  let computed = renderer.measureText({
    fontSize,
    text: string,
  });
  if (computed.width / rect.width > 0.45) {
    fontSize = `${fontNum / 2}px`;
  }
  return {
    fontSize: fontSize,
    x: 5,
    y: parseInt(fontSize),
  };
};
const calculateSubtitleDims = (titleObj) => {
  return {
    fontSize: `${parseInt(titleObj.fontSize) * 0.75}px`,
    x: 5,
    y: titleObj.y * 1.8,
  };
};

const customKPI = () => ({
  require: ['chart', 'renderer', 'element'],
  renderer: 'canvas',
  render() {
    const { settings, rect, renderer } = this;
    const { name, value, nameColor, valueColor, title, subtitle } = settings;

    const nameObj = calculateSizes(rect, renderer, name, true);
    const valueObj = calculateSizes(rect, renderer, value, false);
    const titleObj = calculateTitleDims(rect, renderer, title);
    const subtitleObj = calculateSubtitleDims(titleObj);

    console.log(nameObj);
    return [
      {
        type: 'text',
        text: title ? title : '',
        fill: 'black',
        fontSize: titleObj.fontSize,
        x: titleObj.x,
        y: titleObj.y,
      },
      {
        type: 'text',
        text: subtitle ? subtitle : '',
        fill: 'gray',
        fontSize: subtitleObj.fontSize,
        x: subtitleObj.x,
        y: subtitleObj.y,
      },
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
        title: 'First KPI',
        subtitle: 'This is a test',
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
        value: '751.15234634764794746234535',
        title: 'Second KPI',
        subtitle: 'This is a test',
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
        title: 'Third KPI',
        subtitle: 'This is a test',
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
        value: '7',
        title: 'Third KPI',
        subtitle: 'This is a test',
      },
    ],
  },
});
