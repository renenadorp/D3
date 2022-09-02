/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

//MARGIN CONVENTION-----------------------------------------------------------
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM
const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
const svgCanvas = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

//SCALES---------------------------------------------------------------------
// Here the X and Y axis are initialized with their respective range.
// The domain is set in the update function
let xScale = d3.scaleLog()
	.base(10)
	.range([1, WIDTH])
const xAxis = d3.axisBottom(xScale).ticks(5, '~g')//.tickValues([ 40, 400, 4000, 40000], '~g')

const gAxisX = svgCanvas.append('g')
		.attr('transform', `translate(${0}, ${HEIGHT})`)
	
let yScale = d3.scaleLinear()
	.range([HEIGHT, 0])

const yAxis = d3.axisLeft(yScale)
const gAxisY = svgCanvas.append('g')

var cScale = d3.scaleOrdinal().range(['#b2182b','#d6604d','#f4a582','#fddbc7','#f7f7f7','#d1e5f0','#92c5de','#4393c3','#2166ac'])//schemeCategory10,schemeTableau10;
var bScale = d3.scaleLinear().range([5,25])
var maxLifeExp    = 0 
var maxIncome     = 0
var maxPopulation = 0

//DATA---------------------------------------------------------------------------------
d3.json("data/data.json").then(
	data => {
	const prepData = data.map(years => {return {'year':years.year, 'countries': years["countries"].filter(country=>(country.income !== null && country.life_exp !== null))}})
	maxIncome      = d3.max(prepData, row => { return d3.max(row['countries'], d => d.income)});
	maxLifeExp     = d3.max(prepData, row => { return d3.max(row['countries'], d => d.life_exp)});
	maxPopulation  = d3.max(prepData, row => { return d3.max(row['countries'], d => d.population)});
	//console.log(prepData)
	// console.log(prepData[0])
	// console.log(prepData[1])
	const yearCount = prepData.length-1
	
	const countries = []
	prepData.map(row =>  row['countries'].map(d => { countries.push(d.country)})) //add country name to the array
	var countryList = [... new Set (countries)] // removes duplicate country names from the array
	
	const continent = []
	prepData.map(row =>  row['countries'].map(d => { countries.push(d.continent)})) //add country name to the array
	var continentList = [... new Set (continent)] // removes duplicate country names from the array
	
	//cScale.domain( countryList);
	cScale.domain( continentList);
	var yearList =[]
	prepData.map(row => yearList.push(row.year))
	//console.log(yearList)
	
	bScale.domain([1, maxPopulation])
	console.log(maxPopulation)
	var y=0
	t =	d3.interval(() => {
		update(yearList[y], prepData.filter(d => d.year==yearList[y]))
		// console.log(prepData.length, y, y>=prepData.length-1 )
		// console.log(y)
		// console.log(y>prepData.length)
		if (y+1 > yearCount) {console.log('REPEAT');y=0;}
		if (y+1 > yearCount * 3) {t.stop()}
		y++

	}
	,100
	)
})

//UPDATE--------------------------------------------------------------------------------
function update(year, countries){
	//data.forEach(d => console.log(d.income))
	
	//console.log(year, countries)
	yScale.domain([1, maxLifeExp])
	xScale.domain([1, maxIncome])

	//AXES
	gAxisX.call(xAxis)
	gAxisY.call(yAxis)

	//DATA JOIN-----------------------------------------------------------------------
	circles = svgCanvas.selectAll('circle').data(countries[0].countries);
	//console.log(countries[0].countries)
	//REMOVE
	circles.exit().remove()

	//UPDATE
	circles		
		.attr('class', 'circle')
		.attr('r' , d => bScale(d.population))
		.attr('cx', d => xScale(d.income))
		.attr('cy', d => yScale(d.life_exp))
	
	//INSERT
	circles.enter().append('circle')
		.attr('class' , 'circle')
		.attr('area'  , d => Math.PI * (bScale(d.population))**2)
		.attr('cx'    , d => xScale(d.income))
		.attr('cy'    , d => yScale(d.life_exp))
		.attr('fill'  , d => cScale(d.country))
		.attr('stroke', "#67000d")
		.attr('stroke-width', .5)
}