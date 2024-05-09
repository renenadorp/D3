
const SOURCE_FILE 	= "datasets/data.json";

const SCHEMAS  = 
[
    //Sheet 1: Nodes
    {
      'id': {
        prop: 'id',
        type: String
      },        
      'NodeType': {
        prop: 'NodeType',
        type: String
      },
        'Organisation': {
          prop: 'Organisation',
          type: String,
      },
      'Region': {
        prop: 'Region',
        type: String,
      },
    'Department': {
        prop: 'Department',
        type: String
        },
      'Role': {
        prop: 'Role',
        type: String
        },
        'Description': {
          prop: 'Description',
          type: String
          }					
    },
    //Sheet 2: Edges - Hierarchy
    {
        'Source': {
          prop: 'source',
          type: String
        },
        'Target': {
            prop: 'target',
            type: String,
        },
        'Descr': {
        prop: 'Descr',
        type: String
        }		
    },
]

const NODESIZE = 5;


const SCALE  				  = 1;
const WIDTH  				  = 1500;
const HEIGHT  				= 1000;
const MARGIN          = { LEFT  : 10, RIGHT: 1, TOP: 0, BOTTOM: 1 }
const CANVAS          = { WIDTH : WIDTH  - MARGIN.LEFT - MARGIN.RIGHT,
                          HEIGHT: HEIGHT - MARGIN.TOP  - MARGIN.BOTTOM}

d3.select('body').append('div').attr('id', 'tooltip').attr('style', 'position: absolute; opacity: 0;');     

drag = simulation => {
  
function dragstarted(e,d) {
      if (!e.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
function dragged(e,d) {
      d.fx = e.x;
      d.fy = e.y;
    }
    
function dragended(e,d) {
      if (!e.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
return d3.drag()
        .on("start", dragstarted)
        .on("drag" , dragged)
        .on("end"  , dragended);
  }

/*  
linkColor = (new Map([
    ["static", "#aaa"],
    ["source-target", "source-target"],
    ["source", "source"],
    ["target", "target"],
  ]), {
    value: "source-target",
    label: "Link color"
  })
*/

var linkColor='source';
var selectedLinkColor='source';

link_width = function(label){
    if(label == 1) return 3;
    else if (label == 2) return 1.5;
    else return 1;
  }

function composeGraphData(sheetData){
    // var result = blobList.filter(obj => {
    //   return obj.b === 6
    //})
    const nodes = sheetData[0].rows;
    const links = sheetData[1].rows;
  
    return {"nodes":nodes, "links": links};
  }

function filterGraphData(graphdata, ...filters){
  var nodes, links;

  // // Reset
  //   nodes = dataUnfiltered.nodes
  //   links = dataUnfiltered.links
  nodes = graphdata.nodes;

  nodes = nodes.filter(r => {return r.Region == selectedRegion || selectedRegion == 'ALL'  || selectedRegion == undefined});
  if (searchValue)
    nodes = nodes.filter(r => {return r.id.toUpperCase().includes(searchValue.toUpperCase()) || searchValue    == undefined});

  links = graphdata.links.filter((link) => {
    return nodes.some((node) => {
      return node.id === link.source.id || node.id === link.target.id;
    })
  })

  //Add nodes from links
  links.map(link => {
    link_target = graphdata.nodes.find(node => node.id === link.target.id)
    link_source = graphdata.nodes.find(node => node.id === link.source.id)

    if (nodes.find(node => node.id == link_source.id) === undefined) nodes.push(link_source)
    if (nodes.find(node => node.id == link_target.id) === undefined) nodes.push(link_target)

  })

  const return_nodes_links = {'nodes': nodes, 'links': links}
  return return_nodes_links
}  

function updateChart() {
    if (selectedLinkColor) linkColor = selectedLinkColor;

    console.log('linkColor', linkColor, selectedLinkColor)

    svgMain.select('#svg').remove()
    svg = svgMain.append('g').attr('id', 'svg')
    // initZoom(svgMain);

    svgLegendMain.select('#svgLegend').remove()
    svgLegend = svgLegendMain.append('g').attr('id', 'svgLegend')
    

    chart()
  return
}
// var width = +svg.node().getBoundingClientRect().width,
//     height = +svg.node().getBoundingClientRect().height;

var width = WIDTH;
var height = HEIGHT;
var link, node, svg, svgMain, viz, svgLegend, svgLegendMain, vizLegend;
var data, dataUnfiltered;

function chart () {              

//Color scale used
var color = d3.scaleOrdinal().range(["#002060ff", "#164490ff", "#4d75bcff", "#98b3e6ff", "#d5e2feff", "#008cb0ff"]);


// Set the sankey diagram properties
var sankey = d3.sankey()
  .nodeWidth(175)
  .nodePadding(10)
  .size([width, height]);

  
    const format = d3.format(",.0f");
  
// Constructs a new Sankey
sankey
.nodes(data.nodes)
.links(data.links)
;

// add in the links
var link = svg.append("g")
.selectAll(".link")
.data(data.links)
.enter()
.append("path")
.attr("class", "link")
.attr("d", d3.sankeyLinkHorizontal())
.style("stroke-opacity", 0.2)
.style("stroke-width", function(d) {
  return Math.max(1, d.dy);
})
.sort(function(a, b) {
  return b.dy - a.dy;
});

// add in the nodes
var node = svg.append("g")
.selectAll(".node")
.data(data.nodes)
.enter().append("g")
.attr("class", "node")
.attr("transform", function(d) {
  return "translate(" + d.x + "," + d.y + ")";
})

// add the rectangles for the nodes
node
.append("rect")
.attr("height", function(d) {
  return d.dy;
})
.attr("width", sankey.nodeWidth())
.attr("rx", 3)
.attr("ry", 3)
.style("fill", function(d) {
  return d.color = color(d.id.replace(/ .*/, ""));
})
.on("mouseover", function(d) {
  link
    .transition()
    .duration(300)
    .style("stroke-opacity", function(l) {
      return l.source === d || l.target === d ? 0.5 : 0.2;
    });
})
.on("mouseleave", function(d) {
  link
    .transition()
    .duration(300)
    .style("stroke-opacity", 0.2);
})
// Add hover text
.append("title")
.text(function(d) {
  return d.name + "\n" + d.value
});

// add in the title for the nodes
node
.append("text")
.attr("x", 87)
.attr("y", function(d) {
  return d.dy / 2;
})
.attr("dy", ".35em")
.attr("text-anchor", "middle")
.text(function(d) {
  return d.name;
})
.style("fill", "white");
    return svg.node();
  
}


//////////// MAIN //////////// 
function main(){
  viz     = d3.select("#viz");
  svgMain = viz.append("svg")
              .attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
              .attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
              .attr("id", "viz")
              .style("overflow", "visible")

              // .attr("transform", `scale(${SCALE})`)
              // .attr("viewBox", `-${WIDTH/2}  -${HEIGHT/3}  ${WIDTH} ${HEIGHT}`)
                ;
  svg = svgMain.append('g').attr('id', 'svg');
  

  vizLegend = d3.select("#vizLegend");
  svgLegendMain = vizLegend.append("svg")
              // .attr("width" , 300)
              // .attr("height", 400)
              .attr("id", "viz")
              .style("overflow", "visible")

              .attr("transform", `scale(${SCALE})`)
              .append('g').attr('transform', `translate (70, 10)`)
              // .attr("viewBox", `-${WIDTH/2}  -${HEIGHT/3}  ${WIDTH} ${HEIGHT}`)
              ;

  svgLegend = svgLegendMain.append('g').attr('id', 'svgLegend')


	//log('LINK:', LINK)
d3.json(SOURCE_FILE)
      .then((rows ) => {
        console.log(rows)
        data = rows;
        // const dataJSON = JSON.stringify(data);
        // console.log(dataJSON)
        // console.log('data',data)
        updateChart();
      }) 
}

main();
