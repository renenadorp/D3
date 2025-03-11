/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////

export const RadarTweenChart = (chartElement, data, options = {}) => {
	var cfg = {
	 width: 600,				//Width of the circle
	 height: 600,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 3,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.13, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.15, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3.schemeCategory10	//Color function
	};
	// console.log('RadarTweenChart', data, options, chartElement)
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if
	
	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(data, (i) => i.value));
	var allAxis = (data.filter(d => d.stage == 99).map(function(i, j){return i.dim})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.width/2, cfg.height/2), 	//Radius of the outermost circle
		Format = d3.format('00'),			 	//Formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);
		
	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////
	
    // const svg = d3.create("svg")
    //     .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
    //     .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
    //     .attr("viewBox", [-cfg.width /2, -cfg.height /2 , cfg.width+100, cfg.height])
    //     .attr("style", "max-width: 100%; height: intrinsic;");
                
	// //Append a g element		
	// var g = svg.append("g")
	// 		.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
	
    var g = chartElement;
	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////
	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){
            // console.log('circle d:', d, 'radius:', radius, 'cfg.levels:', cfg.levels); 
            return radius/cfg.levels*d;})
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "12px")
	   .attr("fill", "#737373")
	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////
	
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "16px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth);

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////
	
	//The radial line function
	var radarLine = d3.lineRadial()
		// .interpolate("linear-closed")
        .curve(d3.curveLinearClosed)
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });
		
	// if(cfg.roundStrokes) {
	// 	radarLine.interpolate("cardinal-closed");
	// }
				
	// Create a wrapper for the Target Stage
	const dataTarget = data.filter(d => d.stage ==99)
	// console.log('dataTarget:',dataTarget)
	var blobWrapperTarget = g.selectAll(".radarTargetWrapper")
		.data([dataTarget])
		.enter().append("g")
		.attr("class", "radarTargetWrapper");

	//Append the target radar	
	const dt = radarLine(data.filter(d => d.stage==99))	
	
	blobWrapperTarget
	.append("path")
	.attr("class", "radarArea")
	.attr("d", dt )
	.style("fill", cfg.color(99))
	.style("fill-opacity", 0.2)
	.style("stroke", cfg.color(99))
	.style("filter" , "url(#glow)")
	;	
	
	// Append the dots
	blobWrapperTarget.selectAll(".radarCircle")
		.data(dataTarget)
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", cfg.color(99))
		.style("fill-opacity", 1)
		.style("stroke", "lightgrey");








	//Create a wrapper for the Current Stage
	let dataStage = data.filter(d => d.stage==-1)
	let d0 = radarLine(data.filter(d => d.stage==-1))   //Starting Stage is -1 (center points)
	var blobWrapperStage = g.selectAll("#radarStageWrapper")
		.data([null])
		.enter().append("g")
		.attr("id", "radarStageWrapper");
	
	blobWrapperStage
		.append("path")
		.attr("class", "radarArea")
		.attr("id", "radarAreaStage")
		.attr("d", d0 )
		.style("fill", cfg.color(0))
		.style("fill-opacity", cfg.opacityArea)
		.style("stroke", cfg.color(0))
		.style("filter" , "url(#glow)")
		;	
	blobWrapperStage.selectAll(".radarCircleStage")
		.data(dataStage)
		.enter().append("circle")
		.attr("class", "radarCircleStage")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", cfg.color(0))
		.style("fill-opacity", 1)
		.style("stroke", "lightgrey");



		

	function pathTween(d1, precision) {
		return function() {
			const path0 = this;
			const path1 = path0.cloneNode();
			path1.setAttribute("d", d1);
			const n0 = path0.getTotalLength();
			const n1 = path1.getTotalLength();
		
			// Uniform sampling of distance based on specified precision.
			const distances = [0];
			const dt = precision / Math.max(n0, n1);
			let i = 0; while ((i += dt) < 1) distances.push(i);
			distances.push(1);
		
			// Compute point-interpolators at each distance.
			const points = distances.map((t) => {
			const p0 = path0.getPointAtLength(t * n0);
			const p1 = path1.getPointAtLength(t * n1);
			return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
			});
		
			return (t) => t < 1 ? "M" + points.map((p) => p(t)).join("L") : d1;
		};
		}
	

	const uniqueStages = [...new Set(data.filter(item => item.stage < 99).map(item => item.stage))]; // [ 'A', 'B']
	// console.log(uniqueStages)



	uniqueStages.forEach(function(s,index,collection) {
        setTimeout(function(){
			let currentStage = s;			
	
			let d0 = radarLine(data.filter(d => d.stage==currentStage))   //Starting Stage is -1 (center points)
			animateRadarTransition(s,d0)


        }, index * 1000);
    });


	function animateRadarTransition(s,d0) {
		// console.log('animate', i, d0)
		const pathSelect = 		d3.select("#radarAreaStage")
	
		pathSelect
			.transition()
			.duration(1000)
			.attrTween("d", pathTween(d0,1))
			// .transition()
			// .duration(5000)
			// .attrTween("d", pathTween(d1, 1))
		;
		
		dataStage = data.filter(d => d.stage==s)

		const circleSelect = d3.selectAll(".radarCircleStage")

		.data(dataStage)
		.join(enter =>{
			// console.log('enter');


		},
			update => {

				// console.log('update');
				update
				.transition()
				.duration(1000)
				.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
				.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
			

			},
			exit => {}
		)








		return
	
	}

	
	

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the invisible circles on top
	// var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
	// 	.data(data)
	// 	.enter().append("g")
	// 	.attr("class", "radarCircleWrapper");
		
	//Append a set of invisible circles on top for the mouseover pop-up
	// blobCircleWrapper.selectAll(".radarInvisibleCircle")
	// 	.data(function(d,i) { return d; })
	// 	.enter().append("circle")
	// 	.attr("class", "radarInvisibleCircle")
	// 	.attr("r", cfg.dotRadius*1.5)
	// 	.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
	// 	.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
	// 	.style("fill", "none")
	// 	.style("pointer-events", "all")
	// 	.on("mouseover", function(d,i) {
	// 		const newX =  parseFloat(d3.select(this).attr('cx')) - 10;
	// 		const newY =  parseFloat(d3.select(this).attr('cy')) - 10;
					
	// 		tooltip
	// 			.attr('x', newX)
	// 			.attr('y', newY)
	// 			.text(Format(d.value))
	// 			.transition().duration(200)
	// 			.style('opacity', 1);
	// 	})
	// 	.on("mouseout", function(){
	// 		tooltip.transition().duration(200)
	// 			.style("opacity", 0);
	// 	});
		
	//Set up the small tooltip for when you hover over a circle
	// var tooltip = g.append("text")
	// 	.attr("class", "tooltip")
	// 	.style("opacity", 0);
	
	// /////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
	function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}//wrap	
	



}//RadarChart