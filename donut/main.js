import {DonutChart} from './donut.js';

const INPUT_FILE = 'data/dama.xlsx'
const margin = { top: 0, right: 120, bottom: 10, left: 100 };
const width = 900;
const height = 900;

const settings = [
  {
    sheet: "DamaWheelIlionx",
    colorScaleFont : d3.scaleOrdinal().domain([0,9]).range([  "white",    "#E8003D",    ]),
    colorScaleFill : d3.scaleLinear().domain([0,9]).range([   "#E8003D",  "white",      ]), 
    label:  { text: "Data\nGovernance", FontColor: "#E8003D"},
    pie:    { stroke:  "black", strokeWidth: 1}

  },
  {
    sheet: "DamaWheel",
    colorScaleFont : d3.scaleOrdinal().domain([0,9]).range([  "#080808",  "#080808",    ]),
    colorScaleFill : d3.scaleLinear().domain([0,9]).range([   "#DBE3F3",  "#DBE3F3",      ]), 
    label:  { text: "Data\nGovernance", FontColor:  "#080808", },
    pie:    { stroke:  "black", strokeWidth: 1}

  }];
  let selectedSettingsNumber = 0;

const SCHEMAS =
  [
    //Sheet 1: Questions
        {
      'name': {
        prop: 'name',
        type: String
      },

      'value': {
        prop: 'value',
        type: Number,
      }
      ,
      'focus': {
        prop: 'focus',
        type: Number,
      }


    }    

  ]

const svg = d3.select('#viz')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
    

export function main(sheet) {
  // console.log('sheet:', sheet)
  let dataUnfiltered = {};
  let promiseList = [];

  promiseList.push(fetch(INPUT_FILE).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: +sheet, schema: SCHEMAS[0] }).then((resolve, reject) => { dataUnfiltered = resolve.rows; 
    // console.log('reject',reject, resolve)
  })))        
  Promise.all(promiseList)
    .then((resolve, reject) => {
      // Data Filtering based on UI      
      // dataFiltered = datasUnfiltered.filter(e => (....))

      const dataFiltered = dataUnfiltered
      // console.log(dataFiltered)

      let chart = DonutChart(dataFiltered, {
        category: d => d.name,
        name    : d => d.name,
        value   : d => d.value,
        focus   : d => d.focus,
        width,
        height: 1000,
        settings: settings[+sheet-1]
        })

      svg.append(() => chart);

})
}


main(1);