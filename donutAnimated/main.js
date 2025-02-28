import { DonutChart } from './donut.js';

const INPUT_FILE = 'data/dama.xlsx'
const margin = { top: 0, right: 120, bottom: 10, left: 100 };
const width = 1000;
const height = 1000;
const colorScaleFill = d3.scaleLinear().domain([0, 9]).range(["white", "#E8003D"])
let chartData;
let valueColumn = 'valueDama';
let focusColumn = 'focusDama';

const svg = d3.select('#viz')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${width / 2}, ${height / 2}) scale(0.8)`);
let labelGroup;
const settings = [
  {
    sheet: "Dama",
    colorScaleFont: d3.scaleOrdinal().domain([0, 9]).range(["#E8003D", "white",]),
    colorScaleFill: d3.scaleLinear().domain([0, 9]).range(["white", "#E8003D",]),
    label: { text: "Data\nGovernance", FontColor: "#E8003D" },
    pie: { stroke: "black", strokeWidth: 1 }

  }];

const SCHEMAS =
  [
    {
      'name': {
        prop: 'name',
        type: String
      },

      'valueIlionx': {
        prop: 'valueIlionx',
        type: Number,
      }
      ,
      'focusIlionx': {
        prop: 'focusIlionx',
        type: Number,
      }
      ,
      'valueDama': {
        prop: 'valueDama',
        type: Number,
      }
      ,
      'focusDama': {
        prop: 'focusDama',
        type: Number,
      }


    }

  ]

export const chart = (init) => {
  // const height = Math.min(500, width / 2);
  console.log('chart function called!!!', init)

  const outerRadius = 500;
  const innerRadius = outerRadius * 0.3;
  const labelRadius = (outerRadius + innerRadius) / 2
  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);
  const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);


  const pie = d3.pie().sort(null).value((d) => d[valueColumn]);


  const path = svg.datum(chartData).selectAll("path")
    .data(pie)
    .join("path")
    .attr("fill", (d, i) => {
      // console.log(d.data[focusColumn]); 
      return colorScaleFill(d.data[focusColumn])
    })
    .attr("d", arc)
    .attr("stroke", "black")
    .each(function (d) { this._current = d; }) // store the initial angles
    ;
  if (init) {
    labelGroup =
      svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 28)
        .attr("text-anchor", "middle")
      ;
  }
  labelGroup.selectAll("text")

    .data(pie)
    .join("text")
    .attr('class', 'pieLabel')
    .attr("transform", d => {
      const rotation = d.endAngle < Math.PI ?
        (d.startAngle / 2 + d.endAngle / 2) * 180 / Math.PI :
        (d.startAngle / 2 + d.endAngle / 2 + Math.PI) * 180 / Math.PI;
      return `translate(${arcLabel.centroid(d)}), rotate(${rotation - 90})`
    })
    .attr("fill", d => "black")
    .selectAll("tspan")
    .data(d => {
      const lines = d.data[valueColumn] > 0 ? `${d.data.name}`.split(/\n/) : "";
      // console.log(lines, title);
      return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
    })
    .join("tspan")
    .attr("x", 0)
    .attr("y", (_, i) => `${i * 1.1}em`)
    .attr("font-weight", (_, i) => i ? null : "regular")
    .text(d => {
      // console.log( d);
      return d
    });

  function change(value) {

    valueColumn = 'value' + value;
    focusColumn = 'focus' + value;
    //  console.log('value:', value, valueColumn, focusColumn)


    pie.value((d) => d[valueColumn]); // change the value function
    path.data(pie); // compute the new angles
    path.transition().duration(1750)
      .attrTween("d", arcTween) // redraw the arcs
      .attr("fill", d => colorScaleFill(d.data[focusColumn]))



    labelGroup
      .selectAll("text")
      .data(pie)
      .transition().duration(1750)

      .attr("transform", d => {
        const rotation = d.endAngle < Math.PI ?
          (d.startAngle / 2 + d.endAngle / 2) * 180 / Math.PI :
          (d.startAngle / 2 + d.endAngle / 2 + Math.PI) * 180 / Math.PI;
        return `translate(${arcLabel.centroid(d)}), rotate(${rotation - 90})`
      })


    return
  }

  // Store the displayed angles in _current.
  // Then, interpolate from _current to the new angles.
  // During the transition, _current is updated in-place by d3.interpolate.
  function arcTween(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(0);
    return (t) => arc(i(t));
  }

  // Return the svg node to be displayed.
  return Object.assign(svg.node(), { change });

}


export function main(init) {
  if (init) {
    // svg.select('#chart').remove();
    let dataUnfiltered = {};
    let promiseList = [];

    promiseList.push(fetch(INPUT_FILE).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 1, schema: SCHEMAS[0] }).then((resolve, reject) => {
      dataUnfiltered = resolve.rows;
      // console.log('reject',reject, resolve)
    })))
    Promise.all(promiseList)
      .then((resolve, reject) => {
        // Data Filtering based on UI      
        // dataFiltered = datasUnfiltered.filter(e => (....))

        const dataFiltered = dataUnfiltered
        chartData = dataFiltered;
        console.log('chartData:', chartData);

        chart(init);


      })
  }
}
main(true)