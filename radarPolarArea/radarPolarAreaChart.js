export function RadarPolarAreaChart(element, data, {
    value,
    group = null,
    levels = 5,
    width = 800, // outer width, in pixels
    height = 800, // outer height, in pixels
    margin = 1, // shorthand for margins
    marginTop = margin, // top margin, in pixels
    marginRight = margin, // right margin, in pixels
    marginBottom = margin, // bottom margin, in pixels
    marginLeft = margin, // left margin, in pixels
    padding = 50, // padding for labels
    color = d3.schemeTableau10, // color scheme, if any
    opacity = 0.6, // fill opacity
    fill = "#f1f1f1", // fill for levels
    stroke = "#cdcdcd", // stroke for lines
} = {}) {
  let groups = [];
  // console.log(data)
  const radius = Math.min(width - marginLeft - marginRight - padding, height - marginTop - marginBottom - padding) / 2;
  console.log('radius:', radius, width, marginLeft, marginRight, padding, height, marginTop, marginBottom)
  
  // Collect groups
  if (group) {
    groups = [...new Set(data.map(group))];
  }
  
  // Layout the data with using a pie chart with equal sized slices
  const layoutData = d3.pie().value(1)(data);
  
  const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(d => value(d.data) * (radius / levels));

  const svg = element;
  
  
  // d3.create("svg")
  //   .attr("viewBox", [
  //     marginRight - marginLeft - width / 2,
  //     marginBottom - marginTop - height / 2,
  //     width,
  //     height
  //   ])
  //   .attr("width", width)
  //   .attr("height", height)
  //   .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
  //   .attr("font-family", "sans-serif")
  //   .attr("font-size", 12)
  //   .attr("text-anchor", "middle");
  
  //-------------------------------------
	// Draw the grid
	//-------------------------------------
	
	// Wrapper for the grid & axes
	var axisGrid = svg.append("g").attr("class", "axisWrapper");
	
	// Draw the background circles
	axisGrid.selectAll(".levels")
	  .data(d3.range(1, levels+1).reverse())
	  .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", d => d * (radius / levels))
		.style("fill", fill)
		.style("stroke", stroke)
		.style("fill-opacity", opacity);
  
	// Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(layoutData)
		.enter()
		.append("g")
		.attr("class", "axis");
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", d => radius * Math.cos(d.startAngle - Math.PI/2))
		.attr("y2", d => radius * Math.sin(d.startAngle - Math.PI/2))
		.attr("class", "line")
		.style("stroke", stroke);

  //-------------------------------------
	// Draw the data
	//-------------------------------------

	// Labels
	axis.append("text")
		.attr("class", "legend")
		.attr("text-anchor", "middle")
		.attr("dy", "-10")
    .attr("x", d => radius * Math.cos((d.startAngle + d.endAngle)/2 - Math.PI/2))
		.attr("y", d => radius * Math.sin((d.startAngle + d.endAngle)/2 - Math.PI/2))
    .attr("transform", d => {
      const x = radius * Math.cos((d.startAngle + d.endAngle)/2 - Math.PI/2);
		  const y = radius * Math.sin((d.startAngle + d.endAngle)/2 - Math.PI/2);
      const degrees = (d.startAngle + d.endAngle)/2*180/Math.PI;
      return `rotate(${degrees}, ${x}, ${y})`;
    })
		.text(d => d.data.dim);
  
  // Values
  svg.selectAll("path")
    .data(layoutData)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", d => {
      const idx = group ? groups.indexOf(group(d.data)) : d.index;
      return color[idx];
    })
    .attr("fill-opacity", opacity);

  return svg.node();
}
