
// Tree

var sourceFile=`ldm.xlsx`;
const sourceFolder = 'datasets';
const NODECOLOR = {CHILDREN: "#ffb700", NOCHILDREN: "white"}
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
// Set the dimensions and margins of the diagram
var margin = {top: 0, right: 0, bottom: 0, left: 80},
    width = 1500 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#viz").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root,
    searchText;
;
const activeOnly = 0;
// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);


// Collapse the node and all it's children
function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update(source) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);

  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(function(d){ d.y = d.depth * 180});

  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = svg.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', click);

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function(d) {
          return d._children ? NODECOLOR.CHILDREN : NODECOLOR.NOCHILDREN;
      });

  // Add labels for the nodes
  nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", function(d) {
          return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { return d.data.data.childLabel; });

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", function(d) {
        return d._children ? NODECOLOR.CHILDREN : NODECOLOR.NOCHILDREN;
    })
    .attr('cursor', 'pointer');


  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = svg.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {

    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  // Toggle children on click.
  function click(event, d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    update(d);
    handleNodeClick( d);
  }
  function handleNodeClick(d){
    // console.log('handleNodeClick d:', d)

  if (d.data.data.Level === "Link" && d.data.data.cUrl.length > 0){
    window.open(
      d.data.data.cUrl,
      '_blank' 
    );
}
return;
}

}


function searchData (data)  {
    // If there is no search text, then return original data;
    if (!(typeof searchText === "string"    && searchText.length > 0  )) return data;
    console.log('searchText', searchText)
    //find data 
    var foundData = [];
    function addFound(foundData, row) {
       let addRow = false;
       if (!foundData.find(r => (r.cId == row.cId && row.Level !== 'Root' )))
              addRow = true;
        //console.log( 'addRow: ', addRow); 
        return addRow;
    }
    data.map(row => {
      if  (    typeof searchText == "string" 
            && searchText.length > 0 
            && row.Level == 'Link'
            && row.name.toUpperCase().includes(searchText.toUpperCase())
          )
          {          
            if (addFound(foundData, row))
              
                foundData.push(row);
            //console.log('addedFound row: ',foundData);
          }
    });
    //console.log('foundData: ',foundData);
    // Add parent data
    var parentData = [];
  
    if (1==2){
    foundData.forEach(child => {
      let cId = child.cId;
      let pId = child.pId;
      let searchObject = data.find(parent => (parent.cId == pId && parent.Level !== 'Root'))
      while (searchObject !== undefined){
          if (parentData.find(r => (r.cId == searchObject.cId)) == undefined)
            parentData.push(searchObject);
          pId = searchObject.pId;
          searchObject = data.find(parent => parent.cId == pId && parent.Level !== 'Root')
            //console.log(searchObject);
  
    }});
    }
    if (1==1){
  
      foundData.forEach(d=>{d.pId="SearchResult"});
    }
    // Add Search Result Node
        let TabSearchResult = {Level: "Tab", pId: "Root", cId: "SearchResult", pName: "Root", cName: "SearchResult", name: "SearchResult", title: "SearchResult", Active: "1"}
      foundData.push(TabSearchResult); 
    //Add Root to result
    parentData.push(data.find(root => ( root.Level == 'Root')));
    return foundData.concat(parentData);                 
  };
  
function updateChart () {
        // console.log('searchText', searchText)

        var filterData = searchData(data);
       var stratData  = stratifyData(filterData)


        // Assigns parent, children, height, depth
        root = d3.hierarchy(stratData, function(d) { return d.children; });
        
        
        root.x0 = height / 2;
        root.y0 = 0;

        // Collapse after the second level
        root.children.forEach(collapse);

        update(root);

    return;    
}

const childColumn = "childId"
const parentColumn = "parentId";

stratify = d3
  .stratify()
  .id(d => d[childColumn])
  .parentId(d => d[parentColumn])


function stratifyData (data) {
    return stratify(data).each((d) => {
      d.name = d.id;
      d.size = 1;
      });
    
  }
// MAIN

function main() {
  var SOURCE_FILE = `${sourceFolder}/${sourceFile}`;

  fetch(SOURCE_FILE)
  .then(response => response.blob())
  .then(blob => readXlsxFile(blob, {sheet:1, schema: SCHEMA })
  .then(({rows,errors} ) => {
    // console.log('rows',rows,errors)
    
    // console.log('data', rows)
    data = rows;
    updateChart();
    

  }))
}


main()