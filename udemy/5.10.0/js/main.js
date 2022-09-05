/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

//MARGIN CONVENTION
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH  = 1200 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 1000 - MARGIN.TOP  - MARGIN.BOTTOM
const svg    = d3.select("#chart-area").append("svg")
  					.attr("width" , WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
  					.attr("height", HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
const svgCanvas = svg.append("g")
  					.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

//SCALES
// Here the X and Y axis are initialized with their respective range.
// The domain is set in the update function
let xScale = d3.scaleLog()
				.base(10)
				.range([0, WIDTH])
let cScale = d3.scaleOrdinal(['#33DDED', '#99EF33',  '#FF798E', '#FFEC33']);
// #FF798E Asia
// #33DDED Africa
// #99EF33 Americas
// #FFEC33 Europe

let bScale = d3.scaleLinear().range([5,80])
let yScale = d3.scaleLinear()
	.range([HEIGHT, 0])

//AXES
const xAxis = d3.axisBottom(xScale).ticks(3, '~g')//.tickValues([ 40, 400, 4000, 40000], '~g')
const gAxisX = svgCanvas.append('g')
		.attr('transform', `translate(${0}, ${HEIGHT})`)
	
const yAxis  = d3.axisLeft(yScale)
const gAxisY = svgCanvas.append('g')

// GRID
const xAxisGrid = d3.axisBottom(xScale).tickSize(-HEIGHT).tickFormat('').ticks(10);

//LABEL
const xAxisLabel = svgCanvas.append('g').attr('class', 'xAxisLabel')
xAxisLabel.append('text').text('Income')
xAxisLabel.attr('transform', `translate(${WIDTH/2}, ${HEIGHT+40})`)

const yAxisLabel = svgCanvas.append('g').attr('class', 'yAxisLabel')
yAxisLabel.append('text').text('Life Expectancy')
yAxisLabel.attr('transform', `translate(${-40}, ${HEIGHT/2}) rotate(-90)`)


//YEAR
const gRectYear = svgCanvas.append('g')
gRectYear
	.attr('id', 'gYear')
	.append('rect')
	.attr('width', 80)
	.attr('height', 30)
	.attr('id', 'year' )
	.attr('fill', 'none')
textYearLabel = gRectYear.append('text').text('')
	.attr('class', 'year')	
	.attr('text-anchor', 'middle')
	.attr('dx', 20)
	.attr('dy', 20)				
gRectYear
	.attr('transform', `translate(${WIDTH/2},${HEIGHT/2})`)

//GLOBAL VARS
var maxLifeExp    = 0 
var maxIncome     = 0
var maxPopulation = 0
var continentList = undefined

//DATA
d3.json("data/data.json").then(
	data => {
	const prepData = data.map(years => {return {'year':years.year, 'countries': years["countries"].filter(country=>(country.income !== null && country.life_exp !== null))}})
	maxIncome      = d3.max(prepData, row => { return d3.max(row['countries'], d => d.income)});
	maxLifeExp     = d3.max(prepData, row => { return d3.max(row['countries'], d => d.life_exp)});
	maxPopulation  = d3.max(prepData, row => { return d3.max(row['countries'], d => d.population)});
	//console.log(prepData)
	//console.log(prepData[0])
	//console.log(prepData[1])
	const yearCount = prepData.length-1
	
	const countries = []
	prepData.map(row =>  row['countries'].map(d => { countries.push(d.country)})) //add country name to the array
	var countryList = [... new Set (countries)] // removes duplicate country names from the array
	
	const continent = []
	prepData.map(row =>  row['countries'].map(d => { continent.push(d.continent)})) //add country name to the array
	continentList = [... new Set (continent)] // removes duplicate country names from the array
	//console.log(continentList)
	//cScale.domain( countryList);
	cScale.domain( continentList);
	var yearList =[]
	prepData.map(row => yearList.push(row.year))
	//console.log(yearList)
	
	bScale.domain([1, maxPopulation])
	//console.log(maxPopulation)
	var y=0
	t =	d3.interval(() => {
		update(yearList[y], prepData.filter(d => d.year==yearList[y]))
		// console.log(prepData.length, y, y>=prepData.length-1 )
		// console.log(y)
		// console.log(y>prepData.length)
		if (y+1 > yearCount) {console.log('REPEAT');y=0;t.stop()}
		y++

	}
	,300
	)
})

//UPDATE--------------------------------------------------------------------------------
function update(year, countries){
	//console.log(continentList)
	//data.forEach(d => console.log(d.income))
	const t = d3.transition()
		.duration(200)
		.ease(d3.easeLinear);

	//console.log(year)
	yScale.domain([1, maxLifeExp])
	xScale.domain([100, maxIncome])

	//GRID
	gAxisX.call(xAxisGrid)

	//AXES
	gAxisX.call(xAxis)
	gAxisY.call(yAxis)


	
	//YEAR LABEL
	textYearLabel.text(year )
		
	//DATA JOIN: CIRCLES
	circles = svgCanvas.selectAll('.circle-country').data(countries[0].countries, d => d.country);
	//console.log(circles)
	//console.log(countries[0].countries)
	
	//REMOVE
	circles.exit().remove()

	// //UPDATE
	// circles
	// 	.attr('class', 'circle-country')
	// 	.attr('r'    , d => bScale(d.population))
	// 	.attr('cx'   , d => xScale(d.income))
	// 	.attr('cy'   , d => yScale(d.life_exp))
	// 	.attr('fill' , d => cScale(d.continent))
	// 	.transition(t)
		
	//INSERT
	circles.enter().append('circle')
		.attr('class' , 'circle-country')
		.attr('id', d => {return 'circle-' + d.country})
		.merge(circles)
		.transition(t)
		.attr('r'     , d => bScale(d.population))
		.attr('cx'    , d => xScale(d.income))
		.attr('cy'    , d => yScale(d.life_exp))
		.attr('fill'  , d => {//console.log(d.continent, cScale(d.continent)); 
								return cScale(d.continent)})
		.attr('stroke', "#636665")
		.attr('stroke-width', .6)
		.attr('stroke-opacity', 0.8)
		.attr('fill-opacity', .8)
		
}