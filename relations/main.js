
var sourceFile=`caldic.xlsx`;
const sourceFolder = 'datasets';
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
  ];
var selectedRegion = 'ALL';
var  searchValue;
var  selectedNodeColor = 'NodeType' //Default node coloring by Region

  
const NODESIZE = 5;
const STRENGTHVALUE = 10;

const COLLIDESTRENGTH = 30;
const MINIMUMDEGREE = 10;

const SCALE  				  = 1;
const WIDTH  				  = 800;
const HEIGHT  				= 1200;
const MARGIN          = { LEFT  : 50, RIGHT: 1, TOP: 0, BOTTOM: 1 }
const CANVAS          = { WIDTH : WIDTH  - MARGIN.LEFT - MARGIN.RIGHT,
                          HEIGHT: HEIGHT - MARGIN.TOP  - MARGIN.BOTTOM}

colorScale = d3.scaleOrdinal(d3.schemeObservable10);//schemeAccent schemeCategory10  schemePastel1 schemeObservable10 schemeTableau10

d3.select('body').append('div').attr('id', 'ToolTip')
      .attr('style', 'position: absolute; opacity: 0;');     

var viz     = d3.select("#viz");
var svgMain = viz.append("svg")
                      .attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
                      .attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
                      .attr("id", "viz")
                      .style("overflow", "visible")
        
                      // .attr("transform", `scale(${SCALE})`)
                      .attr("viewBox", `-${WIDTH/2}  -${HEIGHT/3}  ${WIDTH} ${HEIGHT}`)
                        ;
          
        
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

  // Filter nodes by Region
  nodes = graphdata.nodes.filter(r => {return r.Region == selectedRegion || selectedRegion == 'ALL'  || selectedRegion == undefined});

  // Filter nodes by Search Value
  if (searchValue)
    nodes = nodes.filter(r => {return r.id.toUpperCase().includes(searchValue.toUpperCase()) || searchValue    == undefined});

  // Get links to nodes (idea being to include first level linked nodes )
  links = graphdata.links.filter((link) => {
    // console.log('filtered graphdata.link:' , link)
    return nodes.some((node) => {
      return node.id === link.source || node.id === link.target;
    })
  })

  
  //Add nodes from links (the linked nodes need to exist in the node list)
  links.map(link => {
    link_target = graphdata.nodes.find(node => {
      // console.log(node); 
      return node.id === link.target})
    link_source = graphdata.nodes.find(node => node.id === link.source)
    
    // console.log('link_source', link_source)
    // console.log('link_target', link_target)
    

    if (nodes.find(node => {
      // console.log(link_source); 
      return node.id == link_source.id}) === undefined) nodes.push(link_source)
    if (nodes.find(node => {
      // console.log(link_target); 
      return node.id == link_target.id}) === undefined) nodes.push(link_target)

  })
  const return_nodes_links = {'nodes': nodes, 'links': links}
  // console.log('return_nodes_links', return_nodes_links)
  return return_nodes_links
}    

function updateChart() {
  svgMain.select("#svgContainer").remove()
  svg = svgMain.append('g').attr('id', 'svgContainer');
  data = filterGraphData(dataUnfiltered, {selectedRegion: selectedRegion, searchValue: searchValue})

    // svg.selectAll('circle').forEach(n =>  n.remove()); 
    svgMain.select('#svg').remove()
    svg = svgMain.append('g').attr('id', 'svg')
    // initZoom(svgMain);

    svgLegendMain.select('#svgLegend').remove()
    svgLegend = svgLegendMain.append('g').attr('id', 'svgLegend')
    

    chart()
    legend()
  return
}
// var width = +svg.node().getBoundingClientRect().width,
//     height = +svg.node().getBoundingClientRect().height;

var width = WIDTH;
var height = HEIGHT;
var link, node, svg, svgMain, viz, svgLegend, svgLegendMain, vizLegend;
var data;
var dataUnfiltered;

function chart () {              

  const nodes = data.nodes
  const links = data.links;
  var connected = [];

  function setNodeId(node) {
    return node.id;
  }

  const simulation = d3
    .forceSimulation(nodes)

    .force(
      "link",
      d3
        .forceLink(links)
        .id((d,i) => d.id)
        .distance(200)
    )
    .force(
      "collide",
      d3
        .forceCollide()
        .strength(0.5)
        .radius(40)
        .iterations(90)
    )
    .force(
      "center",
      d3
        .forceCenter()
        .x(CANVAS.WIDTH / 3)
        .y(CANVAS.HEIGHT / 5)
    );

  ////////////////////////////////////////////////////////////////////////////////
  // GRAPH
  ////////////////////////////////////////////////////////////////////////////////
  // Rendering functions
  var reset_node_opacity = function(d) {
    return 1;
  };
  var reset_link_opacity = function(d) {
    return 0.4;
  };

  const link = svg
    .append("g")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr('class', 'line')
    .attr("value", d => d.value)
    .attr("target", d => d.target.id)
    .attr("source", d => d.source.id)
    .attr("stroke", '#aaa')//'#000')
    .attr("stroke-width", .5)//d => link_width(d.value))RN
    .attr("stroke-opacity", d => reset_link_opacity(d));

  
  //RN: Comment out old code toi ntroduce data().join(enter =>).. pattern
  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr('class', 'node')
    .style("cursor", "pointer")
    .attr("id", d => d.id)
  //   .attr("r", d => d.radius) RN
    .attr("r", NODESIZE)
    .attr("fill", d =>  colorScale(d[selectedNodeColor]))
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", .6)
    .call(drag(simulation));
  //RN------------------------------------------

  const texts_widgets = svg
    .selectAll(".id")
    .data(nodes)
    .enter()
    .filter(d => d.Organisation == 'Caldic')
    .append("text")
    .attr("class", "labels")
    .attr("font-family", "bebas neue")
    .attr("font-size", 14)
    .attr("dx", NODESIZE)
    .attr("dy", "0.35em")
    .style('fill', '#1f77b4')
    .style("cursor", "pointer")
    .attr("id", d => d.id)
    .text(d => d.id)
    .call(drag(simulation));

  const texts_insights = svg
    .selectAll(".id")
    .data(nodes)
    .enter()
    .filter(d => d.Organisation != 'Caldic')
    .append("text")
    .attr("class", "labels")
    .attr("font-family", "bebas neue")
    .attr("font-size", 14)
    .attr("dx", NODESIZE)
    .attr("dy", "0.35em")
    .style('fill', '#1f77b4')
    .style("cursor", "pointer")
    .attr("id", d => d.id)
    .text(d => d.id)
    .call(drag(simulation));

  /////////////////////////////////////////////////////////////////////////////////////
  ///// UX FUNCTIONS
  /////////////////////////////////////////////////////////////////////////////////////

  const reset_all_opacity = function() {
    d3.selectAll('circle').attr('opacity', d => reset_node_opacity(d));
    d3.selectAll('line').attr('stroke-opacity', d => reset_link_opacity(d));
    d3.selectAll('.labels').style('opacity', 1);

    d3.select('#ToolTip').style('opacity', 0)
    };

  const hide_all_light = function() {
    d3.selectAll('circle').attr('opacity', 0.08);
    d3.selectAll('line').attr('stroke-opacity', 0.03);
    d3.selectAll('.labels').style('opacity', 0.03);
  };

  var restore_default_display = function() {
    d3.selectAll('.legend_session').attr('active', 'no');
    d3.selectAll('.legend_channel').attr('active', 'no');
    reset_all_opacity();
  };

  /////////////////////////////////////////////////////////////////////////////////////
  ///// INTERACTIONS
  /////////////////////////////////////////////////////////////////////////////////////

  var selection = null;
  const selected = d => selection === d;
  var neighbors_nodes_id = [];

  texts_insights.on('click', (e, d) => {
    onClickHandler(e, "#de700d");
  });

  texts_widgets.on('click', (e, d) => {
    onClickHandler(e, "#185e8f");
  });

  node.on('click', (e, d) => {
    var nodecolor;
    if (e.group === "insight") nodecolor = "#de700d";
    else nodecolor = "#185e8f";
    onClickHandler(e, d, nodecolor);
  });

  function onClickHandler(e, d,nodecolor) {
    // console.log('onClickHandler e,d', e,d)
    if (selection == null) {
      selection = e.target.id;
      d3.selectAll('circle[id="' + e.target.id + '"]')
        .attr("stroke", nodecolor)
        .attr("stroke-width", 5);
      onMouseOver(e,d);
    } else if (selection == e.id) {
      d3.selectAll('circle[id="' + selection + '"]').attr("stroke-width", 0);
      selection = null;
      onMouseOut(e,d);
    } else if (neighbors_nodes_id.includes(e.target.id)) {
      d3.selectAll('circle[id="' + selection + '"]').attr("stroke-width", 0);
      selection = e.id;
      d3.selectAll('circle[id="' + e.target.id + '"]')
        .attr("stroke", nodecolor)
        .attr("stroke-width", 5);
      onMouseOver(e,d);
    }
  }

  node.on('mouseover', (e,d) => {
    if (!selection) { 
    // if (!selection == null) {
        onMouseOver(e,d);
    } else if (neighbors_nodes_id.includes(d.id)) {
      onMouseOverNeighbors(d);
    }
  });

  var last_targeted_node;
  function onMouseOver(e,d) {
    // console.log('OnMouseOver d', d)
    last_targeted_node = d;
    neighbors_nodes_id = [];
    // the hover interaction is not active if a node is selected
    hide_all_light();

    // Higlight basic links
    d3.selectAll('circle[id="' + d.id + '"]').attr('opacity', 1);

    var links_src = d3.selectAll('line[source="' + d.id + '"]');
    var links_tar = d3.selectAll('line[target="' + d.id + '"]');
    links_src.attr('stroke-opacity', dd => reset_link_opacity(dd));
    links_tar.attr('stroke-opacity', dd => reset_link_opacity(dd));

    links_src.each(e => {
      neighbors_nodes_id.push(e.target.id);
      d3.selectAll('circle[id="' + e.target.id + '"]').attr(
        'opacity',
        reset_node_opacity(e.target)
      );
    });
    links_tar.each(e => {
      neighbors_nodes_id.push(e.source.id);
      d3.selectAll('circle[id="' + e.source.id + '"]').attr(
        'opacity',
        reset_node_opacity(e.source)
      );
    });

    // Highlight selected node label
    texts_widgets.filter(w => w.id === d.id).style('opacity', 1);
    texts_insights.filter(i => i.id === d.id).style('opacity', 1);

    // Highlight neighbors labels
    neighbors_nodes_id.forEach(e =>
      texts_widgets.filter(w => w.id === e).style('opacity', 1)
    );
    neighbors_nodes_id.forEach(e =>
      texts_insights.filter(w => w.id === e).style('opacity', 1)
    );



//RN
   

    var tooltip = d3.select('#ToolTip');
    var styleCell='xborder: 1px solid white; font-size: 12pt; color: #212529; padding: 1px; vertical-align: top'
    var styleRow='padding-left: 10px; margin-right: 10px'
    tooltip.transition().duration(1000)
      .style('opacity', .7)
      ;
    
    nodeColor = colorScale(d[selectedNodeColor])
    // console.log('nodeColor:', nodeColor, d, selectedNodeColor)
    tooltip
      .html(`
        <div class='hoverbox' style='padding: 5px; xborder: 1px solid grey;max-width: 350px'>
        <span style='font-size: 17pt; color: ${nodeColor}; font-weight: bold;'>${d.id} </span>
        <table>
        <tr style='${styleRow}'><th style='${styleCell}'>Node Type</td><td style='${styleCell}'>${d.NodeType} </td></tr>
        <tr style='${styleRow}'><th style='${styleCell}'>Region</td><td style='${styleCell}'>${d.Region} </td></tr>
        <tr style='${styleRow}'><th style='${styleCell}'>Organisation</td><td style='${styleCell}'>${d.Organisation}</td></tr>
        <tr style='${styleRow}'><th style='${styleCell}'>Role</td><td style='${styleCell}'>${d.Role}</td></tr>
        <tr style='${styleRow}'><th style='${styleCell}'>Description</td><td style='${styleCell}'>${d.Description}</td></tr>
        <tr style='${styleRow}'><th style='${styleCell}'>Department</td><td style='${styleCell}'>${d.Department}</td></tr>
        </table>
        </div>
        `)
      
//RN



  }

  function onMouseOverNeighbors(d) {
    var temp_neighbors = [];
    // the hover interaction is not active if a node is selected
    // Higlight basic links
    d3.selectAll('circle[id="' + d.id + '"]').attr('opacity', 1);

    var links_src = d3.selectAll('line[source="' + d.id + '"]');
    var links_tar = d3.selectAll('line[target="' + d.id + '"]');
    links_src.attr('stroke-opacity', dd => reset_link_opacity(dd));
    links_tar.attr('stroke-opacity', dd => reset_link_opacity(dd));

    links_src.each(e => {
      temp_neighbors.push(e.target.id);
      d3.selectAll('circle[id="' + e.target.id + '"]').attr(
        'opacity',
        reset_node_opacity(e.target)
      );
    });
    links_tar.each(e => {
      temp_neighbors.push(e.source.id);
      d3.selectAll('circle[id="' + e.source.id + '"]').attr(
        'opacity',
        reset_node_opacity(e.source)
      );
    });

    // Highlight selected node label
    texts_widgets.filter(w => w.id === d.id).style('opacity', 1);
    texts_insights.filter(i => i.id === d.id).style('opacity', 1);

    // Highlight neighbors labels
    temp_neighbors.forEach(e =>
      texts_widgets.filter(w => w.id === e).style('opacity', 1)
    );
    temp_neighbors.forEach(e =>
      texts_insights.filter(w => w.id === e).style('opacity', 1)
    );
  }

  node.on('mouseout', (e,d) => {
    onMouseOut(e,d);
  });

  function onMouseOut(e,d) {
    // console.log('onMouseOut', e,d)
    if (!selection) {
      restore_default_display();
    } else if (neighbors_nodes_id.includes(d.id)) {
      hide_all_light();
      onMouseOver(e, last_targeted_node);
    }
  }

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node.attr("cx", d => d.x).attr("cy", d => d.y);

    texts_widgets.attr("x", d => d.x).attr("y", d => d.y);

    texts_insights.attr("x", d => d.x).attr("y", d => d.y);
  });

  // invalidation.then(() => simulation.stop());

  return svg.node();
}

function legend() {
  
  const uniqueLegendValues = [...new Set(data.nodes.filter(item => item != undefined).map(item => item[selectedNodeColor]))]; // [ 'A', 'B']

 
  svgLegend
      .selectAll('.legend')                  
      .data(uniqueLegendValues)                                   

      
      .join (
        enter => {
          var legendRectSize = 18;                                  
          var legendSpacing = 4;                                    

          const legend = enter.append('g')                                            
            .attr('class', 'legend')                                
            .attr('transform', function(d, i) {                     
                var height  = legendRectSize + legendSpacing;          
                var offset  = 0;//height * colorScale.domain().length / 2;     
                var horz    = -3.5 * legendRectSize;                       
                var vert    = i * height - offset;                       
                return 'translate(' + horz + ',' + vert + ')';        
                });                                                     
      
        legend.append('rect')                                     
          .attr('width', legendRectSize)                          
          .attr('height', legendRectSize)                         
          .style('fill', colorScale)                                   
          .style('stroke', colorScale);                                
      
        legend.append('text')                                     
          .attr('x', legendRectSize + legendSpacing)              
          .attr('y', legendRectSize - legendSpacing)              
          .text(function(d) { return d; })
         ;                       
          }
    
      )





  return
}

let zoom = d3.zoom()
  .on('zoom', handleZoom);

function handleZoom(e) {
  d3.select('svg')
    .attr('transform', e.transform);
}
function initZoom(element) {
  element
    .call(zoom);
}

//////////// MAIN //////////// 
function main(readSourceData = true){
  var SOURCE_FILE = `${sourceFolder}/${sourceFile}`;


      fetch(SOURCE_FILE)
        .then(response => response.blob())
        .then(blob => 
          Promise.all ([
            readXlsxFile(blob, {sheet:1, schema: SCHEMAS[0] }),
            readXlsxFile(blob, {sheet:2, schema: SCHEMAS[1] }),
            
          ] )
          .then((rows ) => {
            const dataComposed = composeGraphData(rows);
            console.log(dataComposed)
            dataUnfiltered = dataComposed;
            const dataJSON = JSON.stringify(dataUnfiltered);
            // console.log(dataJSON)

            updateChart();
          }) 
        )
}

main();

