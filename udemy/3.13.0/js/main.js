/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const svgCanvas = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

//DATA
d3.csv("data/revenues.csv")
	.then(data => {
	data.forEach(d => {
		d.revenue = +(d.revenue)
		d.profit = +(d.profit)
	})
	console.log(data)
	//X-AXIS
	const xScale = d3.scaleBand()
		.domain(data.map(d=>d.month))
		.range([0, WIDTH])
		.paddingInner(0.3)
		.paddingOuter(0.2)
	
	const xAxis = d3.axisBottom(xScale)
	svgCanvas.append('g')
		.attr('class', 'xAxis')
		.attr('transform', `translate(${0},${HEIGHT})`) // Move x-axis down
		.call(xAxis)
		.attr("text-anchor","end")
		.selectAll("text").attr('transform', "rotate(-45)")

	//Y-AXIS 
	const yScale = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.revenue)])
		.range([HEIGHT,0])

	const yAxis = d3.axisLeft(yScale)

	svgCanvas.append('g')
		.attr('class', 'yAxis')
		.call(yAxis)

	//Y-VALUE
	const bars = svgCanvas.selectAll(".bar")
		.data(data)
	bars.exit().remove()
	bars.enter().append("rect")
		.attr("x", (d,i) => {	return xScale(d.month)})
		.attr("y", (d) => yScale(d.revenue))
		.attr("width", xScale.bandwidth)
        .attr("height", (d)=>{return HEIGHT - yScale(d.revenue)})
        .attr("class", "bar")
        
		
}).catch(error => {
	console.log(error)
})
