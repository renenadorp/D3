import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {log, drawLogo, drawCharacteristics} from "./functions.js" ;

//MARGIN CONVENTION
var MARGIN = {  LEFT  : 100, RIGHT: 100, TOP: 10, BOTTOM: 100 }
var CANVAS = {  WIDTH : 1300  - MARGIN.LEFT - MARGIN.RIGHT,
                HEIGHT: 1200  - MARGIN.TOP  - MARGIN.BOTTOM}

const svg      = d3.select("#viz").append("svg")
  					.attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
  					.attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
                    .attr("version", "1.1")

var TYPE = {WIDTH: 500, HEIGHT:300}

const svgCanvas = svg.append("g")
  					.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

var gTypes = svgCanvas.append('g').attr('id', 'gTypes');            

//DATA
const myRequest = new Request('data/data.json');

fetch(myRequest, {method: 'GET',  
                  mode: 'no-cors', 
                  headers: {"Content-type": "application/json" } })
  .then((response) => response.json())
  .then((data) => {
    // updateIntroduction(data.introduction);
    updateTypes(data.types);
    //updateTypes(updatedData);
    //pdateTypeList(updatedData);

  })

  function updateTypes(data){
    //console.log('data:', data);

    const t = d3.transition()
    .duration(4000)
    .ease(d3.easeLinear);


    function TypeCharBlock(s,d,i, xpos){
        console.log('tc')
        console.log(s, d, i, xpos)
        d.value.map(
            (v, i) => {
                console.log(v,i)
                s.append('text').text(v).attr('x', xpos).attr('y', 30 + i*15)
            }
        )
        return s.node();
      }

    var Types = gTypes.selectAll('.gTypes').data(data)
    Types
        .join(
            function(enter) {
                var xpos={};
                var gTypeEnter = enter.append('g').attr('class', 'gType');


                gTypeEnter
                    .attr('id', d => { return 'Type-' + d.type})
                    .attr( 'transform', d=>{ //console.log('here'); 
                        return `translate(${d.cx },${d.cy})`})//.transition(t)
                
                //HEADER
                var gTypeEnterHeader = gTypeEnter.append('g');
                var gTypeEnterHeaderRect = 
                    gTypeEnterHeader.append('rect')
                    .attr('class', d => `Type-${d.type}`)
                    .attr('id', d => `Type-${d.type}`)
                    //.attr('width', d=>{console.log(d.name.length); return d.name.length *7 + 40})
                    .attr('height', 30)
                    .attr('x', (d,i) => {xpos[d.type]= -20 + (i*TYPE.WIDTH);return xpos[d.type]})
                    .attr('y', (d,i) => - 20)
                    ;
                var gTypeEnterText = 
                gTypeEnterHeader.append('text')
                    .attr('class', 'Type')
                    .text(d=>{return `${d.name}`})
                    .attr('fill', 'white')
                    .attr('dx',(d,i) => -5 + (i*TYPE.WIDTH))
                    .attr('dy', 5)
                    .attr('text-anchor', 'start');

                gTypeEnterHeaderRect.attr('width', TYPE.WIDTH);
                        
                var gTypeEnterChars = gTypeEnter.append('g').call((d,i)=>{console.log('d:', d); return TypeCharBlock(gTypeEnter, d,i,xpos[d.type])})

                        
                Types = gTypeEnter.merge(Types)


            },
            function(update){
                var gTypeUpdate = update
                 .attr( 'transform', d=>{
                    return `translate(${d.cx },${d.cy})`}).transition(t)
                update.select('text.Type').text(d=>{return `${d.number}.${d.name}`})
                .attr('fill', 'white').attr('dx', -5).attr('dy', 5)
                .attr('text-anchor', 'start')
            },
            function(exit) {
                return exit.remove();
              }
        )


        
}