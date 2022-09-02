const MARGIN ={LEFT: 10, TOP: 10, RIGHT:10, BOTTOM:10}

d3.json("data/buildings.json")
	.then(data => {
	data.forEach(d => {
		d.height = +(d.height)
	})
	
const svg = d3.select("#chart-area").append("svg")
	.attr("width", 500)
	.attr("height", 500)

const bars = svg.selectAll(".bar")
		.data(data)

	bars.enter().append("rect")
		.attr("x", (d, i) => (i * 30) + 20)
		.attr("y", 100)
        .attr("width", 20)
        .attr("height", (d)=>{return d.height * 0.6})
        .attr("class", "bar")
        
		
}).catch(error => {
	console.log(error)
})