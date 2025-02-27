import {RadarChart} from './radarChart.js';

const INPUT_FILE = 'data/data.xlsx'

const sheet=1
const SCHEMAS =
  [
    //Sheet 1: Questions
        {
          'brand': {
            prop: 'brand',
            type: String
          },
          'axis': {
            prop: 'axis',
            type: String
          },
        
      'value': {
        prop: 'value',
        type: Number,
      }


    }    

  ]
const margin = { top: 0, right: 120, bottom: 10, left: 100 };
const width = 900;
const height = 900;


const svg = d3.select('#viz')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr("viewBox", [-width /2, -height /2 , width+100, height])
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top}) scale(0.75)`);




export function main(sheet) {
  svg.select('g#chart').remove();
     
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

    let data = []
    let uniqueGroup = [...new Set(dataFiltered.map(item => item.brand))]; // [ 'A', 'B']
    // console.log(uniqueGroup)
    uniqueGroup.map(group => data.push(dataFiltered.filter(row => row.brand==group)))
    // console.log(data)


		var color = d3.scaleOrdinal()
      .range(["#EDC951","#CC333F","#00A0B0"]);
      
    var radarChartOptions = {
      width:  width ,
      height: height ,
      margin: margin,
      maxValue: 0.5,
      levels: 5,
      roundStrokes: true,
      color: color
    };
    let chartElement = svg.append('g').attr('id', 'chart');


    RadarChart(chartElement, data, radarChartOptions);

  }
)


}


main(1);