import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


export const log = ( msg, obj, level) => {
  const DEBUG_LEVEL = 10;

  const log_this = (level != undefined && level < DEBUG_LEVEL) ? 
             true :
             false;
  
  if (log_this) 
    console.log(msg, obj);
};


export function drawLogo(s, props)  {
const {width, height, scale} = props; //Unpack parameters

// Create dummy data
var data = [{value:20},{value:20},{value:20},{ value:20},{value:20}]

const rangeColorsInergyRed = [
  
  '#BD0006', //Medium
  '#D70006', //Light

  '#A12119',  //Dark

  '#BD0006', //Medium
  '#A12119'  //Dark

]

const gLogo = s.append('g').attr('id', 'logo').attr('transform', `scale(${scale})`)

//OUTER
var color = d3.scaleOrdinal()
  .domain(d3.extent(data, (d,i) => i))
   .range(rangeColorsInergyRed);
  
var arcOuter = d3.arc()
   .innerRadius(60)
   .outerRadius(Math.min(width, height) / 2 - 1)
   .cornerRadius(0);

var pie = d3.pie()
   .sort(null)
   .value(d => d.value);
const arcsOuter = pie(data);

gLogo.append("g")
  .attr("stroke", "none")
  .selectAll("path")
  .data(arcsOuter)
  .enter().append("path")
  .attr("fill", (d,i) => color(i))
  .attr("d", arcOuter)
  ;

  // INNER
  const rangeColorsInergyGrey = [
    'grey',
    'lightgrey',
    'lightgrey',
    'grey'  ]
  const dataInner = [0,1,2,3];
  var color = d3.scaleOrdinal()
    .domain(d3.extent(dataInner, (d,i) => i))
     .range(rangeColorsInergyGrey);
    
  var arcInner = d3.arc()
     .innerRadius(30)
     .outerRadius(60)
     .cornerRadius(1);
  
  var pie = d3.pie()
     .sort(null)
     .value(1);
  const arcsInner = pie(dataInner);
  
  gLogo.append("g")
    .attr("stroke", "none")
    .selectAll("path")
    .data(arcsInner)
    .enter().append("path")
    .attr("fill", (d,i) => {log(color(i),i); return color(i)})
    .attr("d", arcInner)
    ;

  gLogo.attr("transform", );

  var i = 0;
  var timeInterval = 10;
  setInterval(function(){
    i += 1;
    update(i % 360) 
  },timeInterval);


  var n;
  // update the element
  function update(n) {
    // rotate the text
    gLogo.attr("transform", `scale(${scale}) rotate(${n}) `).transition().duration(1);
  }
  
  return s.node();
}
