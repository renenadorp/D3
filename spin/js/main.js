import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {log, drawLogo, drawSpin} from "./functions.js" ;


//VIZ 
//########################
const WIDTH  				  = 500;
const HEIGHT  				= 500;
const BOX             = { WIDTH: WIDTH, HEIGHT: 110}

const MARGIN          = { LEFT  : 10, RIGHT: 1, TOP: 10, BOTTOM: 1 }
const CANVAS          = { WIDTH : WIDTH  - MARGIN.LEFT - MARGIN.RIGHT,
                          HEIGHT: HEIGHT - MARGIN.TOP  - MARGIN.BOTTOM}

const viz     = d3.select("#viz-meds");

const svg = viz.append("svg")
  					.attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
  					.attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
            .attr("id", "vizBsc")
            .attr("viewBox", [-CANVAS.WIDTH / 2, -CANVAS.HEIGHT / 2, CANVAS.WIDTH, CANVAS.HEIGHT])
            .attr("style", "max-width: 100%; height: auto;");
            ;
const gSpin = svg.append('g').attr('id', 'gSpin')
drawSpin(gSpin, {
  width   : 200,
  height  : 400,
  scale   : 1,
  mod     : 3,
  radius  : 200,
  fontsize : 20

});

drawLogo(gSpin, {

  width: 40,
  height: 40, 
  scale: 1
})