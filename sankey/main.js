
/*
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
*/
const NODESIZE = 5;


const SCALE  				  = 1;
const WIDTH  				  = 1500;
const HEIGHT  				= 2500;
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
var nodeAlign='left';

var sourceFile 	= "x.json";
var SOURCE_FILE ;

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

    if (typeof nodeAlign !== "function") nodeAlign = {
      left: d3.sankeyLeft,
      right: d3.sankeyRight,
      center: d3.sankeyCenter
    }[nodeAlign] ?? d3.sankeyJustify;
    

    // console.log('linkColor', linkColor, selectedLinkColor)
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
    const format = d3.format(",.0f");
  
    // Constructs and configures a Sankey generator.
    const sankey = d3.sankey()
        .nodeId(d => d.name)
        // .nodeAlign(d3[nodeAlign]) // d3.sankeyLeft, etc. //RN
        .nodeAlign(nodeAlign) // d3.sankeyLeft, etc. //RN
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 5], [width - 1, height - 5]]);
    // Applies it to the data. We make a copy of the nodes and links objects
    // so as to avoid mutating the original.
    const {nodes, links} = sankey({
      nodes: data.nodes.map(d => Object.assign({}, d)),
      links: data.links.map(d => Object.assign({}, d))
    });

    // Defines a color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  
    // Creates the rects that represent the nodes.
    const rect = svg.append("g")
        .attr("stroke", "#000")
        .selectAll()
        .data(nodes)
        .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => {if (d.category) return color(d.category); else return color(d.name)})
        .on("mouseover", d => {
          // console.log(d);
          link
            .transition()
            .duration(300)
            .style("stroke-opacity", function(l) {
              // console.log(l)
              return l.source.name === d.target.__data__.name || l.target.name ===  d.target.__data__.name ? 0.8 : 0.1;
            });
        })
        .on("mouseleave", function(d) {
          link
            .transition()
            .duration(300)
            .style("stroke-opacity", 0.5);
        })
        ;
  
    // Adds a title on the nodes.
    rect.append("title")
        .text(d => `${d.name}\n${format(d.value)} TWh`);
  
    // Creates the paths that represent the links.
    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll()
        .data(links)
        .join("g")
        .style("mix-blend-mode", "multiply");
  
    // Creates a gradient, if necessary, for the source-target color option.
    if (linkColor === linkColor) { ///"source-target") {
      const gradient = link.append("linearGradient")
          .attr("id", d => d.id)
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", d => d.source.x1)
          .attr("x2", d => d.target.x0);
      gradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", d => {if (d.source.category) return color(d.source.category); else return color(d.source.name)});
      gradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", d => {if (d.target.category) return color(d.target.category); else return color(d.target.name)});
    }
  
    link.append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", linkColor === "source-target" ? (d) => d.id
            : linkColor === "source" ? (d) => {if (d.source.category) return color(d.source.category); else return color(d.source.name)}
            : linkColor === "target" ? (d) => {if (d.target.category) return color(d.target.category); else return color(d.target.name)}
            : linkColor)
        .attr("stroke-width", d => Math.max(1, d.width));
  
    link.append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)} TWh`);
  
    // Adds labels on the nodes.
    svg.append("g")
        .selectAll()
        .data(nodes)
        .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name);
  
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
      svgMain.select('#svg').remove()
    svg = svgMain.append('g').attr('id', 'svg')

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
  SOURCE_FILE = 'datasets/'+sourceFile;
  d3.json(SOURCE_FILE)
  .then((rows ) => {
    data = rows;
    updateChart();

  }) 

}

main();
