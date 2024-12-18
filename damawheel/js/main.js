var ENVIRONMENT 	= "GEN";
const BASEFILENAME 	= "data/InergyDnAServices";
var LINK =`${BASEFILENAME}${ENVIRONMENT}.xlsx`;
	
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
	
//CONSTANTS

const WIDTH  				= 1250;
const HEIGHT  				= 1000;
const SLICE_RADIUS  		= 900;
const CENTER_CIRCLE_RADIUS 	= 350;
const COLOUR_SLICE_HOVER 	= "red";
const CENTER_CIRCLE_SIZE 	= SLICE_RADIUS;
const CENTER_TITLE 			= ['', ''];  
const ZOOM_ICON_SIZE 		= 30;
const ZOOM_ICON_Y 			= 35;
const ZOOM_ICON_TEXT_Y 		= 70;
const ZOOM_ICON_TEXT_FONT 	= '8px sans-serif';
const CENTER_TITLE_FONT  	= FONTSIZE +"px sans-serif";
const CENTER_TITLE_SHIFT_Y_FACTOR = -20;
const SVGSCALE = 1;

//-- FONT SIZE
var FONTSIZE = 55;


		  
//MARGIN CONVENTION
var MARGIN = {  LEFT  : 550, RIGHT: 1, TOP: 400, BOTTOM: 1 }
var CANVAS = {  WIDTH : WIDTH  - MARGIN.LEFT - MARGIN.RIGHT,
                HEIGHT: HEIGHT - MARGIN.TOP  - MARGIN.BOTTOM}

var viz     = d3.select("#viz-area");

//DATA
var dsOrig; 
function chartData(){
	//console.log('LINK:', LINK)
	fetch(LINK)
		.then(response => response.blob())
		.then(blob => readXlsxFile(blob, {sheet:1, schema: SCHEMA })
		.then(({rows,errors} ) => {
		
		dsOrig = rows;
		//console.log('dsOrig:', dsOrig)
		chart(dsOrig)
	
}))
}

chartData();

// Stratify: create hierarchy from parent child dataset
stratify = d3.stratify()
    .id(d => d["childId"])
    .parentId(d => d["parentId"]);

partition = data => {
	const root = d3.hierarchy(data)
		.sum(function(d) { return d.data.value })
		.sort((a, b) => b.data.value - a.data.value);
	return d3.partition()
		.size([2 * Math.PI, root.height + 1])
		(root);
	}

function chart(ds) {

	// GRADE = 5
	// alert (`Colour Value for ${GRADE}: ${colorScaleNumTraffic(GRADE)}` )



	viz.selectAll("svg").remove();
	svg = viz.append("svg")
  					.attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
  					.attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM);

	dataFiltered 	= ds; //Currently no data filtering.
	dataStratified 	= stratify(dataFiltered)
	data 			= partition(dataStratified)	
	const root 		= data;
	var ROOT  		= false;
	
	root.each(d => d.current = d);
	var svgCanvas = undefined;
	svgCanvas = svg.append("g")
  					.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP}) scale(${SVGSCALE})`)
					.attr("viewBox", [0, 0, CANVAS.WIDTH, CANVAS.HEIGHT])
					.style("font", FONTSIZE + "pt sans-serif")
					.style("fill", "white")
					.style("font-weight", "bold");
	var g = undefined;
	g = svgCanvas.append("g")
		.attr("transform", `translate(${CANVAS.WIDTH/2},${CANVAS.WIDTH/2 })`);
	
	// const icon = g.append("image").attr("xlink:href", await FileAttachment("click.svg").url());
	
	function center_slice(n) { 
	return d3.arc()
		.innerRadius(CENTER_CIRCLE_SIZE)
		.outerRadius(CENTER_CIRCLE_RADIUS)
		.startAngle((n*90-90) * (Math.PI/180)) //convert from degs to radians
		.endAngle(n*90 * (Math.PI/180)) //just radians
	}
	
	for(let i = 0; i <= 3; i++) {  
		g.append("path")
			.attr("d", center_slice(i))
			.attr("transform", "translate(0,0)")
			.attr("fill",  color_grey(i))
			.style("cursor", "none")
			.attr("stroke", "white")
			.attr("stroke-width", 5)
	}
	
	// SLICES *******************************************	
	path = g.append("g")
		.selectAll("path")
		.data(root.descendants().slice()).join("path")
		.attr("fill", d => {
							
							const depth = d.depth;

							
							if (d.depth == 1 ) var c = color_slice(d.data.id,	'inergy');
							if (d.depth  > 1 ) var c = color_slice(cv, 			COLOURCODE);
																
							return c
		}
								)
		.attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 1 : 1) : 0)
	
		.attr("d", d => arc(d.current))
		//.on("mouseover", colourSwitchOver)
		//.on("mouseout",  colourSwitchOut)
		;
	
	path.filter(d => d.children)
		.style("cursor", "pointer")
		.on("click", clicked);
	
	path.append("title").text(d =>  d.data.data.description).attr("class", "hint");//`${d.ancestors().map(d => d.data.data.child).reverse().join("/")}\n${format(d.value)}`);
	
	const label = g.append("g")
		.attr("pointer-events", "none")
		.attr("text-anchor", "middle")
		.style("user-select", "none")
		.selectAll("text")
		.data(root.descendants().slice(1))
		.join("text")
		.attr("dy", "0.35em")
		.attr("fill-opacity", d => +labelVisible(d.current))
		.attr("transform"	, d => labelTransform(d.current))
		.text(d => `${TOGGLEID ? d.data.data.childId + "-" : ""}${d.data.data.childLabel}`).attr("class","labeltext")
	;
	
	// CENTER TITLE ***************************************  
	for(let i = 0; i < 3; i++) {  
		g.append("text")
		.attr("x", 0 )
		.attr("y", CENTER_TITLE_SHIFT_Y_FACTOR+((i*1.4)*FONTSIZE))
		.attr("dy", ".40em")
		.attr("text-anchor", "middle")
		.text(CENTER_TITLE[i])
		.style("font", CENTER_TITLE_FONT)
		.style("font-weight", "bold")
		.style("fill", "#817f84")
		.style("text-align", "center")
		;
	
	}
	   	
	// ZOOM OUT ******************************************************************
	function add_zoom(b) {
		d3.selectAll("#zoom").remove(); //Notice the "#" ch
	
		if(!b){ 
		var zoom = g.append("g").attr("id", "zoom");
		
		zoom.append("image").attr("xlink:href", ZOOM_ICON)
		.attr("x", -ZOOM_ICON_SIZE/2)
		.attr("y", ZOOM_ICON_Y)
		.attr("anchor", "middle")
		.attr("width", ZOOM_ICON_SIZE)
		.attr("height", ZOOM_ICON_SIZE);
	
		zoom.append("text")
			.attr("x", 0 )
			.attr("y", ZOOM_ICON_TEXT_Y)
			.attr("dy", ".35em")
			.attr("text-anchor", "middle")
			.text('Zoom Out')
			.style("font", ZOOM_ICON_TEXT_FONT)
			.style("font-weight", "regular")
			.style("fill", "#817f84")
			.style("text-align", "center")
		}
		else {
		d3.selectAll("#zoom").remove();
		}
	}
	
	const parent = g.append("circle")
		.datum(root)
		.attr("r",CENTER_CIRCLE_RADIUS)
		.attr("fill", "none")
		.attr("pointer-events", "all")
		.style("cursor", "pointer")
		.on("click", clicked);
	
	function clicked(e,p) {
		//console.log('p:', p)
		parent.datum(p.parent || root);
		ROOT = p.parent==null ? true : false;
		//console.log('root:',ROOT);
		//add_zoom(ROOT);
		
		
		root.each(d => d.target = {
		x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
		x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
		y0: Math.max(0, d.y0 - p.depth),
		y1: Math.max(0, d.y1 - p.depth)
		})
		
		;
	
		const t = g.transition().duration(800);
	
		// Transition the data on all arcs, even the ones that aren’t visible,
		// so that if this transition is interrupted, entering arcs will start
		// the next transition from the desired position.
		path.transition(t)
			.tween("data", d => {
			const i = d3.interpolate(d.current, d.target);
			return t => d.current = i(t);
			})
		.filter(function(d) {
			return +this.getAttribute("fill-opacity") || arcVisible(d.target);
		})
			.attr("fill-opacity", d => arcVisible(d.target)? (d.children ? 1 : 1) : 0)
			.attr("stroke", d => arcVisible(d.target) ? (d.children ? "white" : "none") : "none")
			.attr("stroke-width", 0)
			.attrTween("d", d => () => arc(d.current));
	
		label.filter(function(d) {
			return +this.getAttribute("fill-opacity") || labelVisible(d.target);
		}).transition(t)
			.attr("fill-opacity", d => +labelVisible(d.target))
			.attrTween("transform", d => () => labelTransform(d.current));
	}
	;

	// VISIBILITY ********************************************************
	function arcVisible(d) {
		return d.y1 <= VISIBLE_RINGS && d.y0 >= 1 && d.x1 > d.x0;
	}
	
	function labelVisible(d) {
		return d.y1 <= VISIBLE_RINGS && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.0; //was: '>0.03'. Don't know why

	}
	
	function labelTransform(d) {

		const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
		const y = (d.y0 + d.y1) / 2 * SLICE_RADIUS;
		return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
	}
	
	// COLORS *********************************************************************	
	function color_grey(i) {
		return (i%2==1) ?    "#817f84":"#aeaeb2";
	} 
	
	// EVENT HANDLERS ****************
	function colourSwitchOver(d, i, nodes) {
		// console.log("Over");
		// console.log("d: " + d);
		// console.log("i: " + i);
		// //console.log("Nodes: " + nodes);
		// console.log("Element: " + nodes[i]);
		// console.log("Current Colour:", d3.select(this).attr("fill"));
		d3.select(nodes[i]).attr("fill",  COLOUR_SLICE_HOVER);
		// native event is available as d3.event
		// for the duration of the handler function
		//label.text(`${d3.event.clientX} x ${d3.event.clientY}`)******
	
		
	}
	
	function colourSwitchOut(d, i, nodes) {
		// console.log("Out");
		// console.log("d: " + d);
		// console.log("i: " + i);
		// //console.log("Nodes: " + nodes);
		// console.log("Element: " + nodes[i]);
		// console.log("Current Colour:", d3.select(this).attr("fill"));
		d3.select(nodes[i]).attr("fill", color_slice(i+1, 'none')) ;
		
	}

	return svg.node();
	}	  


arc = d3.arc()
.startAngle(d => d.x0)
.endAngle(d => d.x1)
.padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.002))
.padRadius(SLICE_RADIUS * 1.6)
.innerRadius(d => d.y0 * SLICE_RADIUS)
.outerRadius(d => 
	{
		if (d.depth == 400000) 
				r = SLICE_RADIUS - 80;
		else r = SLICE_RADIUS; 
		
		return Math.max(d.y0 * r, d.y1 * r  )
	})
	;
  

function colorValue(code, grade, depth){
	if (code =='none') return +depth;
	if (code =='traffic')  return +colorScaleNumTraffic(grade)
	if (code =='coverage') return +colorScaleNumCoverage(grade)
	
}
domainColorsInergy = [
	// '#e3d5ca', '#d6ccc2',
// '#0096FF',
// '#76D6FF',
'#A12119',  
'#BD0006',  
'#D70006' 
]
domainColorsInergyDarkOnly = [
	// '#e3d5ca', '#d6ccc2',
// '#0096FF',
// '#76D6FF',
'#820003'
//'#A12119',  
// '#BD0006',  
// '#D70006' 
]

domainColorsBlue = ['#014f86']
domainColorsPartnership = domainColorsBlue;
x= [
	"#adb5bd"
	,"#adb5bd"
	,"#adb5bd"
	,"#adb5bd"
	,"#adb5bd"
	,"#adb5bd"
	,"#adb5bd"
	,"#adb5bd"
	,"#adb5bd"
	,'#014f86'	,'#014f86'
	,"#adb5bd"
	,"#adb5bd"
	,"#adb5bd"
	,"#adb5bd"
	,"#adb5bd"
	// ,"#6c757d"
	// ,"#475569"
]
colorScaleDomainOrdinal = d3.scaleOrdinal()
  .domain([1,2]) 
  .range(domainColorsInergyDarkOnly);

colorScaleCapabilityOrdinal = d3.scaleOrdinal()
  .domain([0,1]) 
  .range([ 
	 "#817f84"
	 ,	 "#817f84"

	,"#aeaeb2"   

  //
]);

colorScaleCoverageOrdinal = d3.scaleOrdinal()
	.domain([-1, 0,1]) 
	.range([ 
		,,"#817f84",//"#aeaeb2",// 
//		"#fee2e2",
//		"#fef3c7"

//		,"#475569"
//		'#E7E7E7',		"#817f84",

//		,"#aeaeb2"   
//		,'#4E4F55'  
	//
]);

colorScaleBanded = d3.scaleOrdinal()
	.domain([1,2,3,4,5]) 
	.range([ 
		"#aeaeb2", "#817f84"
	//
]);

maturityLime=[
"#ecfccb"
,"#d9f99d"
,"#bef264"
,"#a3e635"
,"#84cc16"
,"#65a30d"
]
maturityGrey= [ 
	"#f8f9fa"
	,"#e9ecef"
	,"#dee2e6"
	,"#ced4da"
	,"#adb5bd"
	,"#6c757d"
	,"#475569"

]
maturitySlate=
["#fee2e2",
	"#fef3c7"
,"#e2e8f0"
,"#cbd5e1"
,"#94a3b8"//,"#b91c1c"//
,"#64748b"
,"#475569"
//,"#334155"
//,"#1e293b"//,"#84cc16"//,"#4d7c0f"//
]
maturityRedGreen=[
	"#94a3b8"
,"#dc2626"
,"#ea580c"
,"#d97706"
,"#ca8a04"
,"#65a30d"
,"#4d7c0f"
]
maturityBlues = ["#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa","#3b82f6", "#2563eb"]
colorScaleTrafficOrdinal = d3.scaleOrdinal()
	.domain([-1,0,1,2,3,4,5]) 
	.range(maturityGrey
		//[		 "#e5e7eb" // light grey
		// ,"#6b7280" // dark grey
		// ,"#dc2626" //red
		// ,"#fcd34d" // yellow
		// ,"#f59e0b" // orange
		// ,"#65a30d" //green
		// ,"#4d7c0f" // dark green



		// "#aeaeb2",    //Grey => Unknown
		// "#817f84",    //Grey => Unknown
		// '#FF0000',    //Red  
		// '#FFC000',    //Orange
		// '#FFC000',    //Orange
		// '#92D050',     //Green
		// '#92D050',     //Green
//	]
	);

colorScaleNumCoverage = d3.scaleOrdinal().domain([-1,0,1,2,3,4,5]).range([-1,0,0, 0,1,1,1])
colorScaleNumTraffic  = d3.scaleOrdinal().domain([-1,0,1,2,3,4,5]).range([-1,0,1,2,3,4,5])

function color_slice(v, type){
	const c =  (v == undefined) ? 0 : v;
	//console.log('c:', c)
	if (type=='inergy')    		return colorScaleDomainOrdinal(c);
	if (type=='coverage') 		return colorScaleCoverageOrdinal(c);
	if (type=='traffic')        return colorScaleTrafficOrdinal(c);
	if (type=='none')      	 	return colorScaleBanded(c);
}
format = d3.format(",d");
