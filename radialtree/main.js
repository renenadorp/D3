// Tree 
// var sourceFile=`ldm.json`;
var sourceFile=`ldm.xlsx`;
const sourceFolder = 'datasets';
const SCHEMA  = {
	'childId': {
	  prop: 'childId',
	  type: Number
	},
	'parentId': {
		prop: 'parentId',
		type: Number,
		required: true
	},
	'childLabel': {
	prop: 'childLabel',
	type: String,
	required: true
	},
	'parentLabel': {
	prop: 'parentLabel',
	type: String,
	required: true
	},
	'childIdCopy': {
	prop: 'childIdCopy',
	type: Number
	},
	'leaf': {
	prop: 'leaf',
	type: Number
	},
	'childCount': {
	prop: 'childCount',
	type: Number
	},
	'parentChildCount': {
	prop: 'parentChildCount',
	type: Number
	},
	'grade': {
	prop: 'grade',
	type: Number
	},
	'relevance': {
	prop: 'relevance',
	type: Number
	},
	'value': {
	prop: 'value',
	type: Number
	},
	'intermediateValue': {
	prop: 'intermediateValue',
	type: Number
	},
	'sort': {
	prop: 'sort',
	type: Number
	},
	'level': {
	prop: 'level',
	type: Number
	},	  
	'type': {
	prop: 'type',
	type: String
	},
	'prio': {
	prop: 'prio',
	type: Number
	},	  
	'description': {
	prop: 'description',
	type: String
	},	  	  
	'gradeInergy': {
	prop: 'gradeInergy',
	type: Number
	},			
	'gradeIlionx': {
	prop: 'gradeIlionx',
	type: Number
	},			
	'gradeWortell': {
	prop: 'gradeWortell',
	type: Number
	},
	'gradeMotion10': {
	prop: 'gradeMotion10',
	type: Number
	},
	'gradeMotion10': {
	prop: 'gradeMotion10',
	type: Number
	},
	'gradeInspark': {
	prop: 'gradeInspark',
	type: Number
	},				
}

const RADIUS = 50;


const SCALE  				  = 1;
const WIDTH  				  = 1000;
const HEIGHT  				= 1000;
const MARGIN          = { LEFT  : 50, RIGHT: 1, TOP: 0, BOTTOM: 1 }
const CANVAS          = { WIDTH : WIDTH  - MARGIN.LEFT - MARGIN.RIGHT,
                          HEIGHT: HEIGHT - MARGIN.TOP  - MARGIN.BOTTOM}

colorScale = d3.scaleOrdinal(d3.schemeObservable10);//schemeAccent schemeCategory10  schemePastel1 schemeObservable10 schemeTableau10

d3.select('body').append('div').attr('id', 'ToolTip')
      .attr('style', 'position: absolute; opacity: 0;');     

var viz     = d3.select("#viz");
var svg = viz.append("svg")
                      .attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
                      .attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
                      .attr("id", "viz")
                      .style("overflow", "visible")
        
                      // .attr("transform", `scale(${SCALE})`)
                      .attr("viewBox", `-${WIDTH/2}  -${HEIGHT/3}  ${WIDTH} ${HEIGHT}`)
                        ;
let gChart;
        
function updateChart() {
    
  d3.select("#gChart").remove();
  gChart = svg.append('g').attr('id','gChart')
           .attr("transform", () => `translate(${width / 2}, ${width / 2})`); // !important


  chart()
  return
}
// var width = +svg.node().getBoundingClientRect().width,
//     height = +svg.node().getBoundingClientRect().height;

var width = WIDTH;
var height = HEIGHT;
var radius = RADIUS;
var link, node, svg, svgMain, viz, svgLegend, svgLegendMain, vizLegend;
var data;
var dataUnfiltered;

var radius = width / 2;

tree = d3
  .tree()
  .size([2 * Math.PI, radius / 1.2])
  .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
  
  
radial = d3.linkRadial()
  .angle(d => d.x)
  .radius(d => d.y)

// -- Snap Slider
layout = ({
  width: 400,
  height: 300,
  margin: {
    top: 130,
    bottom: 135,
    left: 40,
    right: 40
  }
});
slider_snap = function(min, max, starting_min=min, starting_max=max) {

    var range = [min, max + 1]
    var starting_range = [starting_min, starting_max + 1]
  
    // set width and height of svg
    var w = layout.width
    var h = layout.height
    var margin = layout.margin
  
    // dimensions of slider bar
    var width = w - margin.left - margin.right;
    var height = h - margin.top - margin.bottom;
  
    // create x scale
    var x = d3.scaleLinear()
      .domain(range)  // data space
      .range([0, width]);  // display space
    
    // create svg and translated g
    // var svg = d3.select(DOM.svg(w,h))
    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
    
    // draw background lines
    g.append('g').selectAll('line')
      .data(d3.range(range[0], range[1]+1))
      .enter()
      .append('line')
      .attr('x1', d => x(d)).attr('x2', d => x(d))
      .attr('y1', 0).attr('y2', height)
      .style('stroke', '#ccc')
    
    // labels
    var labelL = g.append('text')
      .attr('id', 'labelleft')
      .attr('x', 0)
      .attr('y', height + 5)
      .text(range[0])
  
    var labelR = g.append('text')
      .attr('id', 'labelright')
      .attr('x', 0)
      .attr('y', height + 5)
      .text(range[1])
  
    // define brush
    var brush = d3.brushX()
      .extent([[0,0], [width, height]])
      .on('brush', function() {
        var s = d3.event.selection;
        // update and move labels
        labelL.attr('x', s[0])
          .text(Math.round(x.invert(s[0])))
        labelR.attr('x', s[1])
          .text(Math.round(x.invert(s[1])) - 1)
        // move brush handles      
        handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [ s[i], - height / 4] + ")"; });
        // update view
        // if the view should only be updated after brushing is over, 
        // move these two lines into the on('end') part below
        svg.node().value = s.map(d => Math.round(x.invert(d)));
        svg.node().dispatchEvent(new CustomEvent("input"));
      })
      .on('end', function() {
        if (!d3.event.sourceEvent) return;
        var d0 = d3.event.selection.map(x.invert);
        var d1 = d0.map(Math.round)
        d3.select(this).transition().call(d3.event.target.move, d1.map(x))
      })
  
    // append brush to g
    var gBrush = g.append("g")
        .attr("class", "brush")
        .call(brush)
  
    // add brush handles (from https://bl.ocks.org/Fil/2d43867ba1f36a05459c7113c7f6f98a)
    var brushResizePath = function(d) {
        var e = +(d.type == "e"),
            x = e ? 1 : -1,
            y = height / 2;
        return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) +
          "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) +
          "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
    }
  
    var handle = gBrush.selectAll(".handle--custom")
      .data([{type: "w"}, {type: "e"}])
      .enter().append("path")
      .attr("class", "handle--custom")
      .attr("stroke", "#000")
      .attr("fill", '#eee')
      .attr("cursor", "ew-resize")
      .attr("d", brushResizePath);
      
    // override default behaviour - clicking outside of the selected area 
    // will select a small piece there rather than deselecting everything
    // https://bl.ocks.org/mbostock/6498000
    gBrush.selectAll(".overlay")
      .each(function(d) { d.type = "selection"; })
      .on("mousedown touchstart", brushcentered)
    
    function brushcentered() {
      var dx = x(1) - x(0), // Use a fixed width when recentering.
      cx = d3.mouse(this)[0],
      x0 = cx - dx / 2,
      x1 = cx + dx / 2;
      d3.select(this.parentNode).call(brush.move, x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]);
    }
    
    // select entire starting range
    gBrush.call(brush.move, starting_range.map(x))
    
    var getRange = function() { var range = d3.brushSelection(gBrush.node()).map(d => Math.round(x.invert(d))); return range }



    return svg.node()
  }  

let event = new Event("change"); 

d3.select('#eventhandler').on('change', function() { console.log('event')})

// mysnapslider3 = slider_snap(1990, 2015, undefined, 1997)

function chart () {              
    const root = d3.hierarchy(data);
  
    root.x0 = 0;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
    });
  
    const g = gChart;
      
    const gLink = g
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);
  
    const gNode = g
      .append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");
  
    function update(event, source) {
      const duration = event && event.altKey ? 2500 : 1000;
      const nodes = root.descendants().reverse();
      const links = root.links();
  
      // Compute the new tree layout.
      tree(root);
      // console.log('tree(root):', tree(root))
      const transition = svg
        .transition()
        .duration(duration)
        .attr("viewBox", [0, 0, width, width]);
      //.tween(
      //  "resize",
      //  window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
      //);
  
      // Update the nodes…
      const node = gNode.selectAll("g").data(nodes, (d) => d.id);
  
      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node
        .enter()
        .append("g")
        .attr(
          "transform",
          (d) => `
              rotate(${(source.x0 * 180) / Math.PI - 90})
              translate(${source.y0}, 0)
        `
        )
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        });
  
      nodeEnter
        .append("circle")
        .attr("r", d => (d.depth == 0 ? 5 : 5))
        .attr("fill", (d) => colorScale(d.depth))
        // .attr("fill", (d) => (d._children ? "red" : "#999"))
        .attr("stroke-width", 10);
  
      nodeEnter
        .append("text")
        .attr(
          "transform",
          (d) => `
            rotate(${d.x >= Math.PI ? 180 : 0})
        `
        )
        .attr("dy", "0.31em")
        .attr("x", (d) => (d.x < Math.PI === !d.children ? 6 : -6))
        .attr("text-anchor", (d) =>
          d.x < Math.PI === !d.children ? "start" : "end"
        )
        .text((d) => d.data.data.childLabel).attr("class","nodetext")
        .clone(true)
        .lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white");
  
      // Transition nodes to their new position.
      const nodeUpdate = node
        .merge(nodeEnter)
        .transition(transition)
        .attr(
          "transform",
          (d) => `
            rotate(${(d.x * 180) / Math.PI - 90}) 
            translate(${d.y}, 0)`
        )
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);
  
      // Transition exiting nodes to the parent's new position.
      const nodeExit = node
        .exit()
        .transition(transition)
        .remove()
        .attr(
          "transform",
          (d) => `
            rotate(${(source.x * 180) / Math.PI - 90}) 
            translate(${source.y}, 0)`
        )
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);
  
      // Update the links…
      const link = gLink.selectAll("path").data(links, (d) => d.target.id);
  
      // Enter any new links at the parent's previous position.
      const linkEnter = link
        .enter()
        .append("path")
        .attr("d", (d) => {
          const o = { x: source.x0, y: source.y0 };
          return radial({ source: o, target: o });
        });
  
      // Transition links to their new position.
      link.merge(linkEnter).transition(transition).attr("d", radial);
  
      // Transition exiting nodes to the parent's new position.
      link
        .exit()
        .transition(transition)
        .remove()
        .attr("d", (d) => {
          const o = { x: source.x, y: source.y };
          return radial({ source: o, target: o });
        });
  
      // Stash the old positions for transition.
      root.eachBefore((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }
    update(event, root);
  

  
    return svg.node();

}

//////////// MAIN //////////// 


main();


const stratify = d3.stratify(data)
    .id((d) => d.childId)
    .parentId((d) => d.parentId)
  ;    

function main() {
  var SOURCE_FILE = `${sourceFolder}/${sourceFile}`;

  fetch(SOURCE_FILE)
  .then(response => response.blob())
  .then(blob => readXlsxFile(blob, {sheet:1, schema: SCHEMA })
  .then(({rows,errors} ) => {
    // console.log('rows',rows,errors)
    
    data 	= stratify(rows)
    // console.log('data', data)
    updateChart();
    

  }))
}


function mainJSON () {
  var SOURCE_FILE = `${sourceFolder}/${sourceFile}`;


  // fetch(SOURCE_FILE)
  d3.json(SOURCE_FILE)
        
          .then((rows ) => {
            data=rows;
            console.log('from json',rows)

            updateChart();
            mainXlsx();
  })
} 