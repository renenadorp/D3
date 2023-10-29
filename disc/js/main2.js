import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {log, drawLogo, drawCharacteristics} from "./functions.js" ;

//MARGIN CONVENTION
var MARGIN = {  LEFT  : 50, RIGHT: 100, TOP: 0, BOTTOM: 100 }
var CANVAS = {  WIDTH : 1500  - MARGIN.LEFT - MARGIN.RIGHT,
                HEIGHT: 1200  - MARGIN.TOP  - MARGIN.BOTTOM}

const svg      = d3.select("#viz").append("svg")
  					.attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
  					.attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
                    .attr("version", "1.1")

var TYPE = {WIDTH: 330, HEIGHT:25}
var CHARBLOCK = {LINEHIGHT: 15,TEXTOFFSET: {TOP:15, LEFT: 10}}

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
    data=prepareData(data)
    updateTypes(data.types);
    //updateTypes(updatedData);
    //pdateTypeList(updatedData);

  })

    function prepareData(data){
        data.types.map((t,i)=>{
            data.types[i].numLines = 0
            t.characteristics.map((c,j) => {
                data.types[i].characteristics[j].numLines=0
                data.types[i].characteristics[j].parentType = t.type;
                var charBlockLines = data.types[i].characteristics[j].value.length;            
                if (j==0){
                    data.types[i].characteristics[j].cumLinesBefore=0
                    data.types[i].characteristics[j].cumLinesAfter=charBlockLines
                } 
                else {
                    data.types[i].characteristics[j].cumLinesBefore=data.types[i].characteristics[j-1].cumLinesAfter


                    data.types[i].characteristics[j].cumLinesAfter = data.types[i].characteristics[j-1].cumLinesAfter + charBlockLines
                } 
                data.types[i].characteristics[j].numLines += charBlockLines
                data.types[i].numLines+=charBlockLines;
            })
        })
        // console.log('prepData',data)
        return data;
    }
    function updateTypes(data){
        //console.log('data:', data);

    const t = d3.transition()
    .duration(4000)
    .ease(d3.easeLinear);


    var Types = gTypes.selectAll('.gTypes').data(data)
    Types
        .join(
            function(enter) {
                var xpos={};
                var CharBlockLineCount =  {} //{"I": [3,2], "D": [4,5]}

                var gTypeEnter = enter.append('g').attr('class', 'gType');


                gTypeEnter
                    .attr('id', d => { return 'Type-' + d.type})
                    .attr( 'transform', (d,i)=>{ 
                        return `translate(${ i*TYPE.WIDTH},${0})`})//.transition(t)
                    
                //TYPE HEADER
                var gTypeEnterHeader = gTypeEnter.append('g');
                var gTypeEnterHeaderRect = 
                    gTypeEnterHeader.append('rect')
                    .attr('class', d => `Type-${d.type}`)
                    .attr('id', d => `Type-${d.type}`)
                    .attr('height', TYPE.HEIGHT)
                    .attr('x', 0)
                    .attr('y', 0)
                    ;
                var gTypeEnterText = 
                    gTypeEnterHeader.append('text')
                    .attr('class', 'Type')
                    .text(d=>{return `${d.name}`})
                    .attr('fill', 'white')
                    .attr('dx',10)
                    .attr('dy', TYPE.HEIGHT*0.7)
                    .attr('text-anchor', 'start');
                gTypeEnterHeaderRect.attr('width', TYPE.WIDTH);

            
                var gTypeCharBlocks = gTypeEnter.append('g').attr('class', d=>`CB-${d.type}`);    
                var gTypeCharBlock = gTypeCharBlocks.selectAll('.gTypeCharBlock').data(d=>d.characteristics);

                gTypeCharBlock.join(
                    function(enter){
                        var gTypeCharBlockEnter = enter.append('g').attr('class', 'gTypeCharBlock');
                        gTypeCharBlockEnter
                            .attr('transform', (d,i) => {
                            // console.log('d', d, enter)
                            var ypos =  ( (d.cumLinesBefore+1) * CHARBLOCK.LINEHIGHT) +
                                                 CHARBLOCK.TEXTOFFSET.TOP*i +
                                                 TYPE.HEIGHT

                                return `translate(${ CHARBLOCK.TEXTOFFSET.LEFT},${ypos })`
                                })
                            .append('text').text(d=>{
                                var title = d.key;
                                title= title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
                                return title;
                                })
                            .attr('dy', CHARBLOCK.TEXTOFFSET.TOP-(CHARBLOCK.LINEHIGHT / 2)).attr('class', 'title')
                        gTypeCharBlockEnter.append('line')
                        .attr('x1', 0)
                        .attr('class', 'title-divider')
                        .attr('y1', CHARBLOCK.TEXTOFFSET.TOP)
                        .attr('x2', TYPE.WIDTH-CHARBLOCK.TEXTOFFSET.LEFT*2)
                        .attr('y2', CHARBLOCK.TEXTOFFSET.TOP)
                   
                        var gTypeCharBlockLines = gTypeCharBlockEnter.selectAll('line').data(d=>d.value);

                        gTypeCharBlockLines.join(
                            function (enter){
                                  enter.append('text').text(d=> d).attr('y', (d,i) => CHARBLOCK.TEXTOFFSET.TOP + i*CHARBLOCK.LINEHIGHT)
                                        .attr('class','line')
                            }

                        )
                    }
                )

            })

        
}