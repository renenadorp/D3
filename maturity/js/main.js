
//MARGIN CONVENTION
var MARGIN = {  LEFT  : 100, RIGHT: 1, TOP: 100, BOTTOM: 1 }
var CANVAS = {  WIDTH : 1200  - MARGIN.LEFT - MARGIN.RIGHT,
                HEIGHT: 600  - MARGIN.TOP  - MARGIN.BOTTOM}
var GRAPH = {  	WIDTH : CANVAS.WIDTH,
				HEIGHT: CANVAS.HEIGHT - 80}

const svg     = d3.select("#viz-maturity").append("svg")
  					.attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
  					.attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
const svgCanvas = svg.append("g")
  					.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
//SCALES
let xScale = d3.scaleLinear()
		.range([0, CANVAS.WIDTH])

//AXES
const gAxisX = svgCanvas.append('g')
		.attr('transform', `translate(${0}, ${GRAPH.HEIGHT})`)
const gAxisMaturity = svgCanvas.append('g')
		.attr('transform', `translate(${0}, ${GRAPH.HEIGHT+5})`)

//LABELS
const xAxisLabel = svgCanvas.append('g').attr('class', 'xAxisLabel')
xAxisLabel.append('text').text('Maturity Level')
xAxisLabel.attr('transform', `translate(${GRAPH.WIDTH/2}, ${GRAPH.HEIGHT+60})`)

// GRID
const xAxisGrid = d3.axisBottom(xScale).tickSize(-CANVAS.HEIGHT).tickFormat('').ticks(5);
gAxisX.call(xAxisGrid)


//
const SHAPES = {"AXISMATURITY": {HEIGHT: 35, PAD:10, ARROWSIZE: 10}}

//DATA
const LINK = "data/data.json"
d3.json(LINK)
.then(data => update(data));

	
function update (data){  
	//console.log(data)
	drawAxisMaturity(data.maturity);

	return svg.node();
}

function drawAxisMaturity(data){
	const AxisMaturity = gAxisMaturity.selectAll('.AxisMaturity').data(data);
	const MaturityLevels = data.length;
	const MaturityWidth = CANVAS.WIDTH / MaturityLevels
	
	AxisMaturity
	.join(
		function(enter) {
	
		gAxisMaturityEnter=  
			enter.append('g')
				.attr('class', 'AxisMaturity')
				.attr( 'transform', (d,i)=>`translate(${(i)*MaturityWidth },${0})`);

		gAxisMaturityEnter.append('svg:polygon').attr('points', (d,i) =>  AxisMaturityShape(i, MaturityWidth))
		.attr('fill', (d,i) => d3.schemeBlues[8][i]);
		gAxisMaturityEnter.append('text').text( (d,i)=> `Level ${d.Level}: ${d.Name}`)
			.attr('dx', MaturityWidth/2)
			.attr('dy', SHAPES.AXISMATURITY.HEIGHT/2 + 5)
			.attr('class', 'AxisMaturity')
			.attr('text-anchor', 'middle')
		},
		function(update){return},

		function(exit) {
			return exit.remove();
		  }
		
	)
	const verticalPosition = MaturityWidth*3.1
	drawVerticalLine([verticalPosition,0],[verticalPosition,GRAPH.HEIGHT])	
	drawMaturityCurve();

	return svg.node();

}
function AxisMaturityShape(i, MaturityWidth){
	const MATURITYWIDTH = MaturityWidth;
	const maturity_start=
	[
		[0, 0],
		[MATURITYWIDTH-SHAPES.AXISMATURITY.ARROWSIZE, 0],
		[MATURITYWIDTH, SHAPES.AXISMATURITY.HEIGHT/2],
		[MATURITYWIDTH-SHAPES.AXISMATURITY.ARROWSIZE, SHAPES.AXISMATURITY.HEIGHT],
		[0, SHAPES.AXISMATURITY.HEIGHT]
	];
	const maturity_end=
	[
		[0, 0],
		[MATURITYWIDTH-SHAPES.AXISMATURITY.ARROWSIZE, 0],
		[MATURITYWIDTH, SHAPES.AXISMATURITY.HEIGHT/2],
		[MATURITYWIDTH-SHAPES.AXISMATURITY.ARROWSIZE, SHAPES.AXISMATURITY.HEIGHT],
		
		[0, SHAPES.AXISMATURITY.HEIGHT],
		[SHAPES.AXISMATURITY.ARROWSIZE, SHAPES.AXISMATURITY.HEIGHT/2]
	];

	return i==0 ? maturity_start : maturity_end
}
function drawMaturityCurve() {
		p1=[0,GRAPH.HEIGHT/3*2];
		p2=[GRAPH.WIDTH, 100];
		cp=[GRAPH.WIDTH/5*3, GRAPH.HEIGHT/3*2];
        let path = d3.path();
        path.moveTo(p1[0], p1[1])
        path.quadraticCurveTo(cp[0], cp[1], p2[0], p2[1]);

        svgCanvas.append('path').attr('d', path).attr('class', 'maturity-line')

		return svg.node();
	

}
function drawMaturityLines() {

	var bezierLine = d3.line()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; }); 

	svgCanvas.append('path')
    .attr("d", bezierLine([		[GRAPH.WIDTH/5 * 0, GRAPH.HEIGHT - 65], 
								[GRAPH.WIDTH/5 * 1, GRAPH.HEIGHT - 70], 
								[GRAPH.WIDTH/5 * 2, GRAPH.HEIGHT - 80], 
								[GRAPH.WIDTH/5 * 3, GRAPH.HEIGHT - 100], 
								[GRAPH.WIDTH/5 * 4, GRAPH.HEIGHT - 160], 
								[GRAPH.WIDTH/5 * 5, GRAPH.HEIGHT - 280]]))
    .attr("stroke", "steelblue")
    .attr("stroke-width", 10)
	.attr("stroke-opacity", .4)
    .attr("fill", "none");
	
	return svg.node();
	}

function drawVerticalLine (p1,p2) {
	
	svgCanvas.append("line")
	.attr("x1", p1[0])
	.attr("y1", p1[1])
	.attr("x2", p2[0])
	.attr("y2", p2[1])
	.attr('class', 'vertical')
	

	return svg.node();

}	


function drawMaturityCurveCircles(data)
{
	var n_segments = 100;
	var path = svg.select("path#TCurve-0");
	var pathEl = path.node();
	//console.log(pathEl)

	var pathLength = pathEl.getTotalLength();
	var line = gMap.select("line#TLine-1");

	pts_i = path_line_intersections(pathEl,line)
	for (i=0; i< pts_i.length; i++){
		if (pts_i[i].x!==1000){
			gMap.append('circle')
				.attr('r', 5)
				.attr('cx', pts_i[i].x)
				.attr('cy', pts_i[i].y).attr('stroke', 'none').attr('fill', 'none')
		}
	}



	function btwn(a, b1, b2) {
		if ((a >= b1) && (a <= b2)) { return true; }
		if ((a >= b2) && (a <= b1)) { return true; }
		return false;
	}

	function line_line_intersect(line1, line2) {
		var x1 = line1.x1, x2 = line1.x2, x3 = line2.x1, x4 = line2.x2;
		var y1 = line1.y1, y2 = line1.y2, y3 = line2.y1, y4 = line2.y2;
		var pt_denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		var pt_x_num = (x1*y2 - y1*x2) * (x3 - x4) - (x1 - x2) * (x3*y4 - y3*x4);
		var pt_y_num = (x1*y2 - y1*x2) * (y3 - y4) - (y1 - y2) * (x3*y4 - y3*x4);
		if (pt_denom == 0) { return "parallel"; }
		else { 
		var pt = {'x': pt_x_num / pt_denom, 'y': pt_y_num / pt_denom}; 
		if (btwn(pt.x, x1, x2) && btwn(pt.y, y1, y2) && btwn(pt.x, x3, x4) && btwn(pt.y, y3, y4)) { return pt; }
		else { return "not in range"; }
		}
	}

	function path_line_intersections(pathEl, line) {

		var pts = []
		for (var i=0; i<n_segments; i++) {
		var pos1 = pathEl.getPointAtLength(pathLength * i / n_segments);
		var pos2 = pathEl.getPointAtLength(pathLength * (i+1) / n_segments);
		var line1 = {x1: pos1.x, x2: pos2.x, y1: pos1.y, y2: pos2.y};
		var line2 = {x1: line.attr('x1'), x2: line.attr('x2'), 
					y1: line.attr('y1'), y2: line.attr('y2')};
		var pt = line_line_intersect(line1, line2);
		if (typeof(pt) != "string") {
			pts.push(pt);
		}
		}
		
		return pts;
	
	}
	return svg.node();
}


function pathVerticalLines(){
	var xPosCircles = [	GRAPH.WIDTH/5*1,
						GRAPH.WIDTH/5*2,
						GRAPH.WIDTH/5*3,
						GRAPH.WIDTH/5*4
					];

	var line = d3.line()
	.x(function(d){ return d.x; })
	.y(function(d){ return d.y; });

	xPosCircles.map((d)=>svgCanvas.append('path').attr('d', line([{x:d,y:0},{x:d,y:GRAPH.HEIGHT}]))
	.attr('class', 'line-vertical'));
	
	return;
}

pathVerticalLines();
test();
//https://stackoverflow.com/questions/57410977/cant-get-gettotallength-from-path
function test(){

	var group = d3.select(document.createElementNS(d3.namespace('svg:svg'), 'g'));

	p1=[0,GRAPH.HEIGHT/3*2];
	p2=[GRAPH.WIDTH, 100];
	cp=[GRAPH.WIDTH/5*3, GRAPH.HEIGHT/3*2];
	let path = d3.path();
	path.moveTo(p1[0], p1[1])
	path.quadraticCurveTo(cp[0], cp[1], p2[0], p2[1]);
	//console.log(path._)
	// var path_test1 = svgCanvas.append('path').attr('d', path)
	// console.log(path_test1)
	// var l = path_test1.node().getTotalLength();
	// console.log(l)


	const path_test3 = d3.create("svg");

	// Manipulate detached element.
	path_test3
	.attr("width", GRAPH.WIDTH)
	.attr("height", GRAPH.HEIGHT);

	// Bind data. Append sub-elements (also not attached to DOM).
	p3 = path_test3.append('path').attr('d', path)
	//console.log(path_test3, p3)
	var l = p3.node().getTotalLength();
	//console.log(l)
	//console.log(svg.node())
	p = getPoint(p3, l, 0.7)
	svgCanvas.append('circle').attr('r', 50).attr('cx', p.x).attr('cy', p.y)

	return;
}


function getPoint(path, l, t) {
	point = path.node().getPointAtLength(t * l)
	console.log(point)
	return point
  };




//console.log(createSomething())
