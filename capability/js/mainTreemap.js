/*
  Adapted from https://codepen.io/stopyransky/pen/EXdrOo
*/
/*
var data = {
    "name": "A1",
    "children": [
      {
        "name": "B1",
        "children": [
          {
            "name": "C1",
            "value": 100
          },
          {
            "name": "C2",
            "value": 300
          },
          {
            "name": "C3",
            "value": 200
          }
        ]
      },
      {
        "name": "B2",
        "value": 200
      }
    ]
  };
*/
//const LINK = 'data/capabilities.json'
//const LINK = 'data/flare.json'
//d3.json(LINK)
//const LINK  = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRsPYbjoqHYm3bFzi6wCVO0ucGbyIcXG6z6ylGpuINMY5IFoZxMcslDowOavp1A4g/pub?gid=294767777&single=true&output=csv'
const LINK  = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQEY6n5tJtxi-d8T4W1Ytg-y1XC7rqSH7u2cA_8vsuOy0SCOwYzpO3mDrRrr71Lsw/pub?gid=294767777&single=true&output=csv'
const showCapabilityIndicator = true;

d3.csv(LINK)
.then(data => {
      //console.log('data:', data)
      if (LINK != 'data/flare.json') {
        prepData = prepareData(data)
        //console.log('prepData:', prepData)

        stratData = stratify(prepData)
        //console.log('stratify:', stratData)
      }
      else stratData = data;
          
      globalThis.root = d3.hierarchy(stratData);

      updateTreeMapLayout();
      updateTreeLayout();
      updatePackLayout();
      updatePartitionLayout();
      updateSunburstLayout();
    }
    );

  const child  = 'ChildId';
  const parent = 'ParentId';
  
  var prepareData = function(data) {
    data.map(r => {r.Value=  +r.Value; r.value=+r.Value; r.Score = +r.Score;r.Gap = +r.Gap; r.Ambition = +r.Ambition})
    return data

  }
  var stratify = d3.stratify()
    .id(d => d[child])
    .parentId(d => d[parent]);

  var handleEvents = function( selection ) {
    selection.on('mouseover', function() {
      let g = d3.select(this);
      let n = g.select('.the-node');
  
      if(n.classed('solid')) {
        n.transition().duration(400)
        //.style('fill', "rgba(211,0,0,0.8)" )
        .style('-webkit-filter', 'drop-shadow( 4px 4px 3px rgba(0, 0, 0, .7))')
        .style('filter', 'drop-shadow( 4px 4px 3px rgba(0, 0, 0, .7))')
        .attr('r', 18);
      } else {
        n.transition().duration(400)
        //.style('fill', "rgba(211,0,0,0.8)" );
        .style('-webkit-filter', 'drop-shadow( 4px 4px 3px rgba(0, 0, 0, .7))')
        .style('filter', 'drop-shadow( 4px 4px 3px rgba(0, 0, 0, .7))')
      }
      
      g.select('.label')
        .transition().duration(700)
        .style('fill', 'white')
      
    })
    .on('mouseout', function() {
      let g = d3.select(this);
      let n = g.select('.the-node');
   
      if(n.classed('solid')) {
        n.transition().duration(400)
        .style('-webkit-filter', 'none')
        .style('filter', 'none')
        .attr('r',14);
      }  else {
       n.transition().duration(400)
       .style('-webkit-filter', 'none')
       .style('filter', 'none')
      }
      g.select('.label')
        .transition().duration(700)
        .style('fill', "black")
    });
  } 
	//colorScore = d3.scaleSequential([0, 10], d3.interpolateReds) //)interpolateBlues)//interpolateViridis)
  //const colorIndicator        = d3.scaleOrdinal().domain ( [0,10])   .range ( ["lightgreen","yellow","red"])
  //const colorIndicatorReverse = d3.scaleOrdinal().domain ( [-10,10]) .range ( ["lightgreen","yellow","red"])
  // const colorIndicator        = d3.scaleLinear([0  , 10], ["red","yellow","lightgreen"]);
  // const colorIndicatorReverse = d3.scaleLinear([-10, 10], ["lightgreen","yellow","red"]);

  // var colorIndicator = d3.scaleSequential(["lightgreen","yellow","red"]).domain([10, 0]);
  // var colorIndicatorReverse = d3.scaleSequential(["lightgreen","yellow","red"]).domain([-10, 10]);

  // Explanation of invertExtent: https://www.appsloveworld.com/d3js/100/6/understanding-invertextent-in-a-threshold-scale

  var colorIndicator = d3.scaleThreshold().domain([5, 7, 10]).range([ "red","yellow","lightgreen"]);
  colorIndicator.range().map(function(d) {
    d = colorIndicator.invertExtent(d);
    if (d[0] == null) d[0] = 0;
    if (d[1] == null) d[1] = 10;
    // console.log(d)
    return d
  })

  var colorIndicatorReverse = d3.scaleThreshold().domain([5, 7, 10]).range([ "lightgreen","yellow","red"]);
  colorIndicatorReverse.range().map(function(d) {
    d = colorIndicatorReverse.invertExtent(d);
    if (d[0] == null) d[0] = 0;
    if (d[1] == null) d[1] = 10;
    // console.log(d)
    return d
  })

  /* TREE LAYOUT */
  function updateTreeLayout(){
    var treeLayout = d3.tree()
    treeLayout.size([400,200]);
    treeLayout(root);
    
    var tree = d3.select('#tree g.nodes')
    
    var treeNodes = tree.selectAll('g.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .classed('node', true)
      .call(handleEvents)
      
    
    treeNodes.append('circle')
      .classed('the-node solid', true)
      .attr('cx', d=> d.x)
      .attr('cy', d=> d.y)
      .attr('r', d => 14)
      .style("fill", "#696969");
    
    
    treeNodes.append('text')
      .attr('class', 'label')
      .attr('dx', d => d.x)
      .attr('dy', d => d.y+4)
      .text(d => d.data.name)
    
    var treeLinks = d3.select('#tree g.links')
      .selectAll('line.link')
      .data(root.links())
      .enter()
      .append('line')
      .classed('link', true)
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .style("stroke", "#5f5f5f")
    return ;
  }

  /* CLUSTER LAYOUT */
  function updateClusterLayout(){
  var clusterLayout = d3.cluster()
      .size([400,200])
      (root);
  
  var cluster = d3.select('#cluster g.nodes')
  
  var clusterNodes = cluster.selectAll('g.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .classed('node', true)
    .call(handleEvents)
  
  clusterNodes.append('circle')
    .classed('the-node solid', true)
    .attr('cx', d=> d.x)
    .attr('cy', d=> d.y)
    .attr('r', 14)
    .style("fill", "#696969");
  
  clusterNodes.append('text')
    .attr('class', 'label')
    .attr('dx', d=> d.x)
    .attr('dy', d=> d.y+4)
    .text( d => d.data.name)
  
  var clusterLinks = d3.select('#cluster g.links')
    .selectAll('line.link')
    .data(root.links())
    .enter()
    .append('line')
    .classed('link', true)
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
    .style("stroke", "#5f5f5f");
    return ;
  }
  
  /* TREEMAP LAYOUT  */
  function updateTreeMapLayout(){
    var treemapLayout = d3.treemap(); 
    treemapLayout.size([1100,600]);
    treemapLayout.paddingOuter(16);
    treemapLayout.paddingInner(2);
    /* paddingTop, paddingRight, Left and Bottom available */
    treemapLayout.tile(d3.treemapSquarify.ratio(4))
    // treemapLayout.tile(d3.treemapSliceDice)
    //treemapLayout.tile(d3.treemapSquarify.ratio(2))
    /* .tile allows different tiling strategies:
      - treemapSquarify.ratio(n) (default) - using rect aspect ratio 
      - treemapSlice - tile horizontally
      - treemapDice - tile vertically
      - treemapSliceDice - alter each layer horizontal/vertical
    */
    root.eachAfter(d => 
        {
          if (d.children) {
            d.SumScore = d3.sum(d.children.map(r => r.SumScore))
            d.Count = d3.sum(d.children.map(r => r.Count))
            d.SumAmbition = d3.sum(d.children.map(r => r.SumAmbition))
            d.SumGap = d3.sum(d.children.map(r => r.SumGap))
          }
          else {
            d.SumScore    = d.data.data.Score;
            d.SumGap = d.data.data.Gap;
            d.SumAmbition = d.data.data.Ambition;
            d.Count = 1;
          }
      }
      )

    root.sum(d => d.data.Value);
    //root.sum(d => d.data.Score);
    //console.log('root:', root)
    // root=root.copy().sum(d => d.data.Score);
    // console.log('rootScore:', root)
    treemapLayout(root);

    updateCapabilities('SumGap');
    
    return ;
  }

function updateCapabilities(indicator){
  //console.log('updateCapabilityIndicators', 'indicator:', indicator)
  var treemapNodes = d3.select("#treemap g")
  .selectAll("g .node")
  .data(root.descendants());
  
  
  treemapNodes.join(
  enter =>
  {
    enterNode=
    enter
     .append('g').attr('class', 'node')
    .attr('transform', d => 'translate('+[d.x0, d.y0]+')')
    .call(handleEvents);

    enterNode
    .append('rect')
    .attr('class', 'the-node')
    .attr("width", d => { //console.log(d.x1-d.x0); 
      return d.x1 - d.x0})
    .attr("height", d => d.y1 - d.y0)
    .style('fill', d => {//console.log('depth:', d.depth); 
      return d3.schemeBlues[6][d.depth];});

    enterNode
    .append('text')
    .attr('class', 'label')
    .attr('dx', d => 4)
    .attr('dy', d => 12)
    .text( d => d.data.data.ChildName)
    .attr('text-anchor', 'start');

    enterNode
    .append('circle')
    .attr('r', d=> { if (d.depth<2 || !showCapabilityIndicator) return 0; else return 4;})
    .attr('class', d=> getIndicatorClass(d, indicator) )
    .attr('fill', d=> getIndicatorColor(d,indicator))
    .attr('cx', d => d.x1 - d.x0 -7)
    .attr('cy', d=> 7)
    
  }
    ,
  update =>
      update.select('circle, .indicator')
        .transition()
        .duration(750)
        .attr('fill', d=> getIndicatorColor(d,indicator))//.attr('r', 10)
        .attr('class', d=> getIndicatorClass(d, indicator) )
        // .attr('cx', d => d.x1 - d.x0 -5)
      // .attr('cy', d=> 5)
  )};

function getIndicatorClass(d, indicator){
  const pulse = (
                  (indicator != 'SumAmbition' && (getIndicatorColor(d,indicator) == colorIndicatorReverse.range()[colorIndicatorReverse.range().length -1]))
                  ||
                  (indicator == 'SumAmbition' && (getIndicatorColor(d, indicator) == colorIndicator.range()[colorIndicator.range().length-1]))
                ) 
                ? ' pulse'
                :'';
                //console.log(indicator, colorIndicatorReverse.range()[0], getIndicatorColor(d,indicator))
  return `indicator${pulse}`
}
function getIndicatorColor(d, indicator){
  //console.log('d:', d)

  IndicatorValue = Math.round(d[indicator]/d.Count); 
        //console.log('name:', d.data.data.ChildName, 'iv:',IndicatorValue, 'ind:',indicator, d); 
                          if (indicator == 'SumGap')
                          {
                            return colorIndicatorReverse(IndicatorValue) //.attr('r', 10)
                          }
                          else
                          return colorIndicator(IndicatorValue) 
}


  /* PACK LAYOUT */
  function updatePackLayout(){
    var packLayout = d3.pack();
    packLayout.size([800,600]);
    packLayout.padding(10);
    
    root.sum(d => d.data.value);
    packLayout(root);
    
    var packNodes = d3.select('#pack g')
    .selectAll('g')
    .data(root.descendants())
    .enter()
    .append('g').attr('class', 'node')
    .attr('transform', d => 'translate('+[d.x, d.y]+')')
    .call(handleEvents)
    packNodes
    .append('circle')
    .classed('the-node', true)
    .attr('r', d => d.r)
    .style('fill', "rgba(255,255,255,0.2)")
    .style('stroke', '#2f2f2f')
    
    packNodes
      .append('text')
      .attr('class', 'label')
      .attr('dy', 4 )
      .attr('dx', 0 )
      .text( d => d.children === undefined ? d.data.name : '');
    return ;
  }
  
  /* PARTITION LAYOUT */
  function updatePartitionLayout(){

    var partitionLayout = d3.partition();
    partitionLayout.size([400,200]);
    partitionLayout.padding(2);
    root.sum(d  => d.data.value);
    partitionLayout(root);
    
    var partitionNodes = d3.select('#partition g') 
    .selectAll("g")
    .data(root.descendants())
    .enter()
    .append('g').attr('class', 'node')
    .attr('transform', d => 'translate('+[d.x0, d.y0]+')')
    .call(handleEvents);
    
    partitionNodes
    .append('rect')
    .classed('the-node', true)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .style('fill', 'rgba(255,255,255,0.2)')
    .style('stroke', '#2f2f2f')
    
    partitionNodes
    .append('text')
      .attr('class', 'label')
      .attr('dx', 12)
      .attr('dy', 8)
      .text( d =>  d.data.name )
    return ;
  }
  
  /* SUNBURST LAYOUT */
  function updateSunburstLayout(){
    var sunburstLayout = d3.partition();
    
    var radius = 100;
    sunburstLayout.size([2*Math.PI, radius]);
    // sunburstLayout.padding(2);
    
    var arc= d3.arc()
    .startAngle( function(d) { return d.x0 })
    .endAngle(   function(d) { return d.x1 })
    .innerRadius(function(d) { return d.y0 })
    .outerRadius(function(d) { return d.y1 })
    
    root.sum(d  => d.data.value);
    
    sunburstLayout(root);
    
    var main = d3.select('#partition-sunburst g')
    
    var sunburstNodes = main.selectAll('g')
        .data(root.descendants())
        .enter()
        .append('g').attr("class", "node")
        .call(handleEvents)
    var paths = sunburstNodes.append('path')
        .attr('d', arc)
        .classed('the-node', true)
        .style('fill', 'rgba(255,255,255,0.2)')
        .style('stroke', '#2f2f2f')
    
    var labels = sunburstNodes.append("text") 
        .attr('class', 'label')
        .attr("transform", function(d) {
              return "translate(" + arc.centroid(d) 
              /*+ ") rotate(" + computeTextRotation(d) */+ ")"; }) 
        .attr("dx", "-4")  
        .attr("dy", ".5em") 
        .text(function(d) { return d.parent ? d.data.name : "" }); 
    return ;
  }
  // https://bl.ocks.org/denjn5/f059c1f78f9c39d922b1c208815d18af
  function computeTextRotation(d) {
      var angle = (d.x0 + d.x1) / Math.PI * 90; 
      return (angle < 180) ? angle - 90 : angle + 90;  
  }