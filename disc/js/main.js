import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {log, drawLogo, drawCharacteristics} from "./functions.js" ;

//MARGIN CONVENTION
var MARGIN = {  LEFT  : 50, RIGHT: 100, TOP: 0, BOTTOM: 100 }
var CANVAS = {  WIDTH : 1300  - MARGIN.LEFT - MARGIN.RIGHT,
                HEIGHT: 1200  - MARGIN.TOP  - MARGIN.BOTTOM}

const svg      = d3.select("#viz").append("svg")
  					.attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
  					.attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
                    .attr("version", "1.1")

var TYPE = {WIDTH: 300, HEIGHT:300}
var CHARBLOCK = {LINEHIGHT: 15,TEXTOFFSET: {TOP:30, LEFT: 10}}

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


    var Types = gTypes.selectAll('.gTypes').data(data)
    Types
        .join(
            function(enter) {
                var xpos={};
                var CharBlockLineCount =  {} //{"I": [3,2], "D": [4,5]}

                var gTypeEnter = enter.append('g').attr('class', 'gType');


                gTypeEnter
                    .attr('id', d => { return 'Type-' + d.type})
                    .attr( 'transform', (d,i)=>{ //console.log('here'); 
                        return `translate(${ i*TYPE.WIDTH},${0})`})//.transition(t)
                
                var gTypeEnterDummy = gTypeEnter.append('g').attr('class', d=>{
                   var linecounts=[]
                    d.characteristics.forEach((c,i) => 
                        {
                            linecounts.push(c.value.length);
                            linecounts[i]=  i==0 ? c.value.length : linecounts[i-1]+ c.value.length
                            CharBlockLineCount[d.type]=linecounts
                        }
                        )
                        return 'dummy';
                    })                        
                //TYPE HEADER
                var gTypeEnterHeader = gTypeEnter.append('g');
                var gTypeEnterHeaderRect = 
                    gTypeEnterHeader.append('rect')
                    .attr('class', d => `Type-${d.type}`)
                    .attr('id', d => `Type-${d.type}`)
                    //.attr('width', d=>{console.log(d.name.length); return d.name.length *7 + 40})
                    .attr('height', 30)
                    .attr('x', 0)
                    .attr('y', 0)
                    ;
                var gTypeEnterText = 
                    gTypeEnterHeader.append('text')
                    .attr('class', 'Type')
                    .text(d=>{return `${d.name}`})
                    .attr('fill', 'white')
                    .attr('dx',10)
                    .attr('dy', 20)
                    .attr('text-anchor', 'start');
                gTypeEnterHeaderRect.attr('width', TYPE.WIDTH);
                gTypeEnter.each(t => {
                    console.log('t', t,gTypeEnter);
                    t.characteristics.forEach( c => {
                        gTypeEnter.append()
                        console.log('c:', c);
                    }
                    )
                })
                
                var TypeCharBlocks= gTypeEnter.selectAll('.gTypeCharBlock').data((d,i)=> {
                    return d.characteristics
                });

                    TypeCharBlocks.join(
                        function (enter)    {
                            
                            var gTypeCharBlock = enter.append('g').attr('class','gTypeCharBlock')  ;
                            var parentType= enter.node()._parent.__data__.type
                            
                           
                            gTypeCharBlock.attr( 'transform', (d,i)=>{

                                var ypos = i==0 ?   CHARBLOCK.TEXTOFFSET.TOP 
                                                :  ( CharBlockLineCount[parentType][i-1] * CHARBLOCK.LINEHIGHT) + CHARBLOCK.TEXTOFFSET.TOP + CHARBLOCK.LINEHIGHT
                                console.log('i,cb, ypos', i, CharBlockLineCount, ypos, parentType)

                                return `translate(${ CHARBLOCK.TEXTOFFSET.LEFT},${ypos })`
                            });

                            var gTypeCharBlockLine = gTypeCharBlock.selectAll('.gTypeCharBlockLine').data(d=>{
                                var title = d.key;
                                title= title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()

                                var l=[{"value": title, "type": "title"}]//lines to show, including header (e.g "Kenmerken")

                                d.value.forEach(v=>l.push({"value": v, "type":"line"}))
                                console.log(l)
                                return l
                            });
                            gTypeCharBlockLine.join(
                                function (enter) {
                               
                                    enter.append('text').text((d,i)=> d.value)
                                        .attr('y',(d,i)=>{ return (i+1)*CHARBLOCK.LINEHIGHT})
                                        .attr('class', d=> 'gTypeCharBlockLine'+ ' ' + d.type)
                                },
                        function(exit) { exit.remove()}
                        )
                        
                        //.append('text').text(d=>d.value).attr('x', 20).attr('y', (d,i)=>i*10)

                    },
                    function (update)   {},
                    function (exit)     {exit.remove();}


                )
                        

                        
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