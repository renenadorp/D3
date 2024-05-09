
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
          return d._children ? "lightsteelblue" : "#fff";
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
      .text(function(d) { return d.data.data.cName; });

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
        return d._children ? "lightsteelblue" : "#fff";
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

  
function createBaseData(data){  
    // Input    : baseData
    // Purpose  : Transform data into desired structure
	// Returns  :

	let pc_root=[];
	let pc_tab=[];
	let pc_group=[];
	let pc_link=[];
	data.map((row, i)=>{
	//Clear arrays
	if (i==0) {
	  pc_root.length=0;
	  pc_tab.length=0;
	  pc_group.length=0;
	  pc_link.length=0;
	}
	const r ={Level: "Root", pId: undefined, cId: "Root", pName: undefined, cName: "Root", name: "Root", title:"Root", Active: "1"} //root
	const t ={Level: "Tab", pId: "Root", cId: row.TabKey, pName: "Root", cName: row.Tab, name: row.Tab, title: row.Tab, Active: row.Active}; //tab
	const g ={Level: "Group", pId: row.TabKey, cId: row.GroupKey, pName: row.Tab, cName: row.Group, name: row.Group, title: row.Group, Active: row.Active}; //group
	const l ={Level: "Link", pId: row.GroupKey, cId: row.LinkKey, pName: row.Group, cName: row.Link, name: row.Link, title: row.Link, cUrl: row.Url, Active: row.Active}; //link
  
	//Root
	const r_found = pc_root.find(el => { if (el.cId == r.cId) return true; return false;})
	if (!r_found) {
	  pc_root.push(r);
	  //console.log('found');
	}
	//console.log(s.cId);
	//Tab
	const t_found = pc_tab.find(el => { if (el.cId == t.cId )  return true; return false;})
	if (!t_found) {
	  pc_tab.push(t);
	//   console.log('found:', t);
	}
  
	//Group
	const g_found = pc_group.find(el => { if (el.cId == g.cId ) return true; return false;})
	if (!g_found) {
	  pc_group.push(g);
	  //console.log('found');
	}
	//Link
	const l_found = pc_link.find(el => { if (el.cId == l.cId )  return true; return false;})
	if (!l_found) {
	  pc_link.push(l);
	  //console.log('found');
	}
  
  });
  let resultData = null;
  let flatData =  [...pc_root, ...pc_tab, ...pc_group, ...pc_link];
  if (activeOnly)
    resultData = flatData.filter(f => f.Active=='1' );
  else resultData = flatData;
    let TabSearchResult = {Level: "Tab", pId: "Root", cId: "SearchResult", pName: "Root", cName: "SearchResult", name: "SearchResult", title: "SearchResult", Active: "1"}
    resultData.push(TabSearchResult); 
  return resultData;
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
        const data = baseData;

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

const childColumn = "cId"
const parentColumn = "pId";

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
SOURCE_FILE ="https://docs.google.com/spreadsheets/d/e/2PACX-1vS-WMdDjr9hcAJrhiiJlpCybwNUKqWwbWVd125xH6z-Eamzp_DuQllP9dtKcbhXR2SD3rElX3dSoNdm/pub?gid=0&single=true&output=csv";

function main(){
    d3.csv(SOURCE_FILE)
    .then((rawData ) => {
        
        baseData = createBaseData(rawData);
        baseData.filter(r => {if (r.Level=="Tab") return r} ); //Not sure why this filtering is needed....

        updateChart()

    }
    );
}

main()