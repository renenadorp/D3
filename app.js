// Data
const TRANSYEARS     = ["Current", 2022, 2023, 2024]

// Constants
const SVG = {
      "width" : 1000, 
      "height": 800,
      "pad"   : 0
}

const CircleState    = {"radius": 50}
const TransMapBox    = {"x": SVG.pad, "y": SVG.pad, "width": (SVG.width-SVG.pad), "height": SVG.height-SVG.pad}
const YearsBox                = {"x": TransMapBox.x, "y": TransMapBox.y, "width": TransMapBox.width, "height": 30}
const TransMapGraph           = {"x": TransMapBox.x, "y": TransMapBox.y + YearsBox.height,  "width": TransMapBox.width, "height":  (TransMapBox.height-YearsBox.height)}
const CurrentStateCircle      = {"x": TransMapGraph.x, "y": TransMapBox.height  }
const FutureStateCircle       = {"x": TransMapGraph.width, "y": TransMapGraph.y }


const RectTransYears = {"width": (SVG.width-(CircleState.radius*2))/TRANSYEARS.length, "height": 30}

// SVG Container            
var svgContainer = d3.select("body").append("svg")
      .attr("height", SVG.height)
      .attr("width", SVG.width);


// SVG Group Elements 
var gTransMapBox     = svgContainer.append("g").attr("id", "gTransMapBox").attr('transform',`translate(${( TransMapBox.x)}, ${TransMapBox.y}) rotate(0)`) ; 


var gTransMapGraph      = gTransMapBox.append("g").attr("id", "gTransMapGraph").attr('transform',`translate(${( 0)}, 0) rotate(0)`) ;
var gTransYearsBox      = gTransMapBox.append("g").attr("id", "gTransYearsBox").attr('transform',`translate(${( YearsBox.x)}, ${YearsBox.y}) rotate(0)`) ;

var gCurrentStateCircle = gTransMapBox.append("g").attr("id", "gCurrentStateCircle").attr('transform', `translate(${CurrentStateCircle.x}, ${CurrentStateCircle.y }) rotate(0)`);
var gFutureStateCircle  = gTransMapBox.append("g").attr("id", "gFutureStateCircle").attr('transform', `translate(${FutureStateCircle.x}, ${FutureStateCircle.y}) rotate(0)`);



gTransMapGraph.append("rect")
      .attr("x", TransMapGraph.x+0)
      .attr("y", TransMapGraph.y+0)
      .attr("width", TransMapGraph.width)
      .attr("height", TransMapGraph.height)
      .classed("TransMapGraph", true)
      ;


// Transformation Years
gTransYears = gTransYearsBox
    .selectAll('.transyear')
    .data(TRANSYEARS)
    .enter()
    .append('g')
    .classed('transyear', true)
    .attr('transform', (d, i) => `translate(${(i * (RectTransYears.width + 10))}, 0) rotate(0)` ) ; 

    ;

gTransYears.append('rect')    
      .attr("dx", TransMapBox.x)
      .attr("dy", TransMapBox.y)
      .attr("width", RectTransYears.width)
      .attr("height", RectTransYears.height)
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("class", "transyear")
    ;

gTransYears.append('text')    
    .text(d=>d)
    .attr("x", RectTransYears.width / 2)
    .attr("y", (RectTransYears.height / 2) + 0)
    .attr("text-anchor", "middle")
    .attr('class', 'transyear')

    ;

    

// Circle Current State

gCurrentStateCircle.append("circle")
      .attr("r", CircleState.radius)
      .classed("CurrentState", true)
      ;

gCurrentStateCircle.append("text")
      .attr("dx", "0")
      .attr("dy", "0")
      .classed('CurrentState', true)
      .attr("text-anchor", "middle")
      .text("CURRENT")
      ;
      
gCurrentStateCircle.append("text")
      .attr("dx", "0")
      .attr("dy", "15")
      .classed('CurrentState', true)
      .attr("text-anchor", "middle")
      .text("STATE")
      ;
      

// Circle Future State

gFutureStateCircle.append("circle")
.attr("r", CircleState.radius)
.classed("FutureState", true)
;

gFutureStateCircle.append("text")
      .attr("dx", "0")
      .attr("dy", "0")
      .classed('FutureState', true)
      .attr("text-anchor", "middle")
      .text("Future")
      ;

gFutureStateCircle.append("text")
.attr("dx", "0")
.attr("dy", "15")
.classed('FutureState', true)
.attr("text-anchor", "middle")
.text("STATE")
;
