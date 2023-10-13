import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {log, drawLogo, drawMedIndicator} from "./functions.js" ;


//VIZ BSC
//########################
const WIDTH  				  = 400;
const HEIGHT  				= 400;
const BOX             = { WIDTH: WIDTH, HEIGHT: 110}
const ELLIPSE         = { WIDTH: 100, HEIGHT: 25, INITIALFILL: "#707070", INITIALSTROKE: "#999999", INITIALOFFSET: 2.5, SPACE: 2.5}
const GOAL            = { CX: 10, CY: 10, RX: 200, RY: 50}
const MARGIN          = { LEFT  : 550, RIGHT: 1, TOP: 400, BOTTOM: 1 }
const CANVAS          = { WIDTH : WIDTH  - MARGIN.LEFT - MARGIN.RIGHT,
                          HEIGHT: HEIGHT - MARGIN.TOP  - MARGIN.BOTTOM}

const viz     = d3.select("#viz-meds");

const svg = viz.append("svg")
  					.attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
  					.attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
            .attr("id", "vizBsc")
            //.attr("viewBox", `0 -20 ${WIDTH} 33`)
            ;
const gMedIndicator = svg.append('g').attr('id', 'gMedIndicator')
drawMedIndicator(gMedIndicator, {
  width   : 200,
  height  : 200,
  scale   : 1,
  mod     : 3

});