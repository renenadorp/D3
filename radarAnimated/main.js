import {RadarTweenChart} from './radarTweenChart.js';

const INPUT_FILE = 'data/data.xlsx'

const SCHEMAS =
  [
    //Sheet 1: Questions
        {
          'id': {
            prop: 'id',
            type: Number
          },          'domain': {
            prop: 'domain',
            type: String
          }, 
          'layer': {
            prop: 'layer',
            type: String
          },         
          'stage': {
            prop: 'stage',
            type: Number
          },
          'descr': {
            prop: 'descr',
            type: String
          }
          ,
          'dim': {
            prop: 'dim',
            type: String
          },
        
          'value': {
            prop: 'value',
            type: Number,
          }
          ,
        
          'valueNext': {
            prop: 'valueNext',
            type: Number,
          }
        

    }    

  ]
const margin = { top: 0, right: 0, bottom: 0, left: 50 };
const width = 600;
const height = 600;
let currentStage =-1;
let nextStage    =0;
let targetStage  =99;

const svg = d3.select('#viz')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr("viewBox", [-width /2, -height /2 , width+100, height])
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top}) scale(0.9)`);


export function main() {
  svg.select('g#chart').remove();
     
let dataUnfiltered = {};
let promiseList = [];

promiseList.push(fetch(INPUT_FILE).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 1, schema: SCHEMAS[0] }).then((resolve, reject) => { dataUnfiltered = resolve.rows; 
  // console.log('reject',reject, resolve)
})))        
Promise.all(promiseList)
  .then((resolve, reject) => {
    // Data Filtering based on UI      
    // dataFiltered = datasUnfiltered.filter(e => (....))

    
    const dataCurrent = dataUnfiltered.filter(r => r.stage== currentStage)
    const dataNext    = dataUnfiltered.filter(r => r.stage== nextStage)
    const dataTarget  = dataUnfiltered.filter(r => r.stage== targetStage)
    const data=dataUnfiltered

    let uniqueGroup = [...new Set(data.map(item => item.stage))]; // [ 'A', 'B']

    // uniqueGroup.map(stage => data.push(dataFiltered.filter(row => row.stage==stage)))
		// var color = d3.scaleOrdinal()      .range(["#156082","#C2B793","003F1D"]);
      var color = d3.scaleOrdinal()      .range(["#14A44D", "#3B71CA"]);
      
    var radarChartOptions = {
      width:  width ,
      height: height ,
      margin: margin,
      maxValue: 0.5,
      levels: 5,
      roundStrokes: true,
      color: color,

    };
    let chartElement = svg.append('g').attr('id', 'chart');


    RadarTweenChart(chartElement, data, radarChartOptions);

  }
)


}


main();