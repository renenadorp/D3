
const svg = d3.select("svg")

const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40
}
const width = +svg.attr("width") - margin.left - margin.right
const height = +svg.attr("height") - margin.top - margin.bottom


// piece of paper
const g = svg.append("g")
  .attr("transform",
    "translate(" +
    margin.left + "," +
    margin.top + ")");

//specs for Circle 1
const xCenter1 = 150
const yCenter1 = 150
const circleRad = 100

//draw Circle 1
const circle1 = g.append("circle")
  .attr("r", circleRad)
  .attr('transform',
    "translate(" +
    xCenter1 + "," +
    yCenter1 + ")");

//add'l specs for Circle 2
const offsetFactor = 1.2
const offset = offsetFactor * circleRad
const xCenter2 = xCenter1 + offset
const yCenter2 = yCenter1 //creating new var for clarity

//draw Circle 2
const circle2 = g.append("circle")
  .attr("r", circleRad)
  .attr('transform',
    "translate(" +
    xCenter2 + "," +
    yCenter2 + ")");

//add'l specs for Circle 3
const xCenter3 = xCenter1 + offset / 2
const yCenter3 = yCenter1 + Math.sqrt(3) * offset / 2

//draw Circle 3
const circle3 = g.append("circle")
  .attr("r", circleRad)
  .attr('transform',
    "translate(" +
    xCenter3 + "," +
    yCenter3 + ")");

//compute first points of intersection
const triHeight = Math.sqrt(circleRad ** 2 - (offset / 2) ** 2)
//outer intersection of Circles 1 and 2
const xIsect1 = xCenter3
const yIsect1 = yCenter1 - triHeight
//inner intersection of Circles 1 and 2
const xIsect4 = xCenter3
const yIsect4 = yCenter1 + triHeight

//treat "triHeight" as the hypoteneuse of a 30.60.90 triangle.
//this tells us the shift from the midpoint of a leg of the triangle
//to the point of intersection
const xDelta = triHeight * Math.sqrt(3) / 2
const yDelta = triHeight / 2

const xMidpointC1C3 = (xCenter1 + xCenter3) / 2
const xMidpointC2C3 = (xCenter2 + xCenter3) / 2
const yMidpointBoth = (yCenter1 + yCenter3) / 2

//find the rest of the points of intersection
const xIsect2 = xMidpointC1C3 - xDelta
const yIsect2 = yMidpointBoth + yDelta
const xIsect3 = xMidpointC2C3 + xDelta
const yIsect3 = yMidpointBoth + yDelta

const xIsect5 = xMidpointC1C3 + xDelta
const yIsect5 = yMidpointBoth - yDelta
const xIsect6 = xMidpointC2C3 - xDelta
const yIsect6 = yMidpointBoth - yDelta

xPoints = [xIsect1, xIsect2, xIsect3, xIsect4, xIsect5, xIsect6]
yPoints = [yIsect1, yIsect2, yIsect3, yIsect4, yIsect5, yIsect6]

const makeIronShapes = ([x1, x2, x3, y1, y2, y3]) => {
  path = `M ${x1} ${y1}
             A ${circleRad} ${circleRad} 0 0 1 ${x2} ${y2}
             A ${circleRad} ${circleRad} 0 0 0 ${x3} ${y3}
             A ${circleRad} ${circleRad} 0 0 1 ${x1} ${y1}`
  return path
}


const makeSunShapes = ([x1, x2, x3, y1, y2, y3]) => {
  path = `M ${x1} ${y1}
             A ${circleRad} ${circleRad} 0 0 0 ${x2} ${y2}
             A ${circleRad} ${circleRad} 0 0 0 ${x3} ${y3}
             A ${circleRad} ${circleRad} 0 1 1 ${x1} ${y1}`
  return path
}


const makeRoundedTri = ([x1, x2, x3, y1, y2, y3]) => {
  path = `M ${x1} ${y1}
             A ${circleRad} ${circleRad} 0 0 1 ${x2} ${y2}
             A ${circleRad} ${circleRad} 0 0 1 ${x3} ${y3}
             A ${circleRad} ${circleRad} 0 0 1 ${x1} ${y1}`
  return path
}


ironPoints = [
  [1, 5, 6],
  [3, 4, 5],
  [2, 6, 4]
]
sunPoints = [
  [3, 5, 1],
  [2, 4, 3],
  [1, 6, 2]
]
roundedTriPoints = [
  [5, 4, 6]
]

for (const points of ironPoints) {
  const ptCycle = points.map(i => xPoints[i - 1]).concat(
    points.map(i => yPoints[i - 1])
  )
  const shape = makeIronShapes(ptCycle)

  g.append("path")
    .attr("d", shape)
    .attr("class", "segment")
    .attr("fill", "#cc6666")
    .attr("opacity", 0.4)
}

for (const points of sunPoints) {
  const ptCycle = points.map(i => xPoints[i - 1]).concat(
    points.map(i => yPoints[i - 1])
  )
  const shape = makeSunShapes(ptCycle)

  g.append("path")
    .attr("d", shape)
    .attr("class", "segment")
    .attr("fill", "#6699cc")
    .attr("opacity", 0.4)
}

for (const points of roundedTriPoints) {
  const ptCycle = points.map(i => xPoints[i - 1]).concat(
    points.map(i => yPoints[i - 1])
  )
  const shape = makeRoundedTri(ptCycle)

  g.append("path")
    .attr("d", shape)
    .attr("class", "segment")
    .attr("fill", "#66cc66")
    .attr("opacity", 0.4)
}


g.selectAll("path.segment")
    .on("mouseover", function () {
        d3.select(this)
        	.transition()
        	.attr("opacity", 0.8)
          .duration(500)
    })
    .on("mouseout", function () {
        d3.select(this)
        	.transition()
        	.attr("opacity", 0.4)
          .duration(500)
    })



g.append("text")
  .text("1")
  .attr("x", xIsect1)
  .attr("y", yIsect1)

g.append("text")
  .text("2")
  .attr("x", xIsect2)
  .attr("y", yIsect2)

g.append("text")
  .text("3")
  .attr("x", xIsect3)
  .attr("y", yIsect3)

g.append("text")
  .text("4")
  .attr("x", xIsect4)
  .attr("y", yIsect4)

g.append("text")
  .text("5")
  .attr("x", xIsect5)
  .attr("y", yIsect5)

g.append("text")
  .text("6")
  .attr("x", xIsect6)
  .attr("y", yIsect6)

