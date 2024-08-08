// https://observablehq.com/@attharmirza/mapping-vantage-points-during-an-open-source-investigatio

const WIDTH  				  = 900;
const HEIGHT  				= WIDTH*0.8;

  //MARGIN CONVENTION
  var MARGIN = {  LEFT  : 0, RIGHT: 0, TOP: 0, BOTTOM: 0 }
  var CANVAS = {  WIDTH : 1300  - MARGIN.LEFT - MARGIN.RIGHT,
                  HEIGHT: 1200  - MARGIN.TOP  - MARGIN.BOTTOM}
  
  const svg      = d3.select("#viz").append("svg")
              .attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
              .attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
                      .attr("version", "1.1")

  const svgCanvas = svg.append("g")
              .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
let  extent = {};
let data;


const SCHEMAS  = 
[
    //Sheet 1: Objects
    {
             
      'ID': {
        prop: 'ID',
        type: Number
      },
        'Date': {
          prop: 'Date',
          type: Date,
      },
    'Start': {
        prop: 'Start',
        type: Date
        },
      'End': {
        prop: 'End',
        type: Date
        },
        'Lat': {
          prop: 'Lat',
          type: Number
          }					
          ,
        'Long': {
          prop: 'Long',
          type: Number
          }	
          ,
          'Year': {
            prop: 'Year',
            type: Number
            }	
            ,
            'Month': {
              prop: 'Month',
              type: Number
              }	
              ,
              'Day': {
                prop: 'Day',
                type: Number
                }	
                ,
                'Hour': {
                  prop: 'Hour',
                  type: Number
                  }	
                  ,
                  'Minute': {
                    prop: 'Minute',
                    type: Number
                    }	
                    ,
                    'Second': {
                      prop: 'Second',
                      type: Number
                      }	
        },
  ]

function dims ()  {
  let dimensions = {
    width: CANVAS.WIDTH,
    height: CANVAS.HEIGHT,
    marginTop: 175
  };

  dimensions.marginLeft = dimensions.marginTop;
  dimensions.marginBottom = dimensions.marginTop;
  dimensions.marginRight = dimensions.marginTop;

  dimensions.chartWidth =
    dimensions.width - dimensions.marginLeft - dimensions.marginRight;
  dimensions.chartHeight =
    dimensions.height - dimensions.marginTop - dimensions.marginBottom;

  return dimensions;
}

svgDims = dims();


// EXTENT
const extentPromise = d3.json('zoom.geojson').then(function(data)
{return data;
});

//this promise returns an array with lattitude and longitude
const extentData = extentPromise.then(data =>
  {
    
    extent = data;
  }
);


function main()
{
  let vectors = {};
  let points = {};
  let zoom = {};

  Promise.all ([
    d3.json('sidewalks.geojson').then((resolve,reject) => {return resolve;}).then( (resolve, result) => {vectors.sidewalks = resolve;  }),
    d3.json('roads.geojson').then((resolve,reject) => {return resolve;}).then( (resolve, result) => {vectors.roads = resolve;  }),
    d3.json('buildings.geojson').then((resolve,reject) => {return resolve;}).then( (resolve, result) => {vectors.buildings = resolve;  }),
    d3.csv('zoom.geojson').then((resolve,reject) =>    { zoom = resolve;}),
    // d3.csv('demo.csv').then((resolve,reject) =>    { points = resolve;}),
    fetch('Objects.xlsx')    .then(response => response.blob()).then(blob => readXlsxFile(blob, {sheet:1, schema: SCHEMAS[0] }).then((resolve,reject ) => {points = resolve.rows; console.log('points', points)})),

  ]
).then((resolve, reject) =>
{
  // console.log('points', points)
  
  dataGeoJSON = ( )=> {
    const features = [];
  
    points
      // .filter(e => Math.abs(+e["Lat"]) > 0 && e["Start"].length > 0) // Purpose of filter?
      .map(d => {
        features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [+d["Long"], +d["Lat"]]
          },
          properties: {}
        });
  
        return d;
      });
  
    const output = {
      type: "FeatureCollection",
      features: features
    };
    console.log('output GeoJson:', output)
    return output;
  }

  dataGeoJSON = dataGeoJSON();
  
  
  drawChart(vectors,dataGeoJSON, points)
  
    }
  )
}

function drawChart(vectors, dataGeoJSON, points) {
  console.log('drawChart', vectors, dataGeoJSON, points)

  // projection = d3
  //   .geoMercator()
  //   .fitExtent(
  //     [
  //       [dims.marginLeft, dims.marginTop],
  //       [dims.width - dims.marginRight, dims.height - dims.marginBottom]
  //     ],
  //     dataGeoJSON
  //   )
  //   ;

    var projection = d3.geoIdentity()
    .fitSize([WIDTH,HEIGHT], vectors.roads)
  
  path = d3.geoPath(projection);
  colors = { blue: "#0A9CE5", orange: "#FF7121" };
  
  mouseenter = function(event, d) {
    d3.select(".tooltip").text(
      `Video ID: ${d["ID"]}, Start Time: ${d["Start"]}
      }`
    );
  
    d3.selectAll(".video").attr("fill", colors.blue);
  
    d3.select(this)
      .attr("fill", colors.orange)
      .raise();
  }

  mouseleave = function(event, d) {
    // d3.select(".tooltip").text(
    //   "Hover over a vantage point for additional info."
    // );
    
    // d3.select(this)
    //   .attr("fill", colors.blue)
    //   .raise();
  }
  
  const sidewalks = svg
      .append("g")
      .selectAll("path")
      .data(vectors["sidewalks"]["features"])
      .join("path")
      .attr("d", path)
      .attr("fill", d => "none")
      .attr("stroke", "lightgray")
      .style("pointer-events", "none");    

    
  
      const buildings = svg
      .append("g")
      .selectAll("path")
      .data(vectors["buildings"]["features"])
      .join("path")
      .attr("d", path)
      .attr("fill", d => "none")
      .attr("stroke", "black")
      .style("pointer-events", "none");    


  
      const roads = svg
      .append("g")
      .selectAll("path")
      .data(vectors["roads"]["features"])
      .join("path")
      .attr("d", path)
      .attr("fill", d => "none")
      .attr("stroke", "blue")
      .style("pointer-events", "none");    




      const dots = svg
    .append("g")
    .selectAll("circle")
    .data(points.filter(e => Math.abs(+e["Lat"]) > 0))
    .join("circle")
    .attr("cx", d => projection([+d["Long"], +d["Lat"]])[0])
    .attr("cy", d => projection([+d["Long"], +d["Lat"]])[1])
    .attr("r", 3)
    .attr("fill", colors.blue)
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .attr("opacity", 1)
    .attr("class", d => "video " + d["ID"])
    .on("mouseenter", mouseenter)
    .on("mouseleave", mouseleave);
}



main();