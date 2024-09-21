// https://observablehq.com/@attharmirza/mapping-vantage-points-during-an-open-source-investigatio
//https://www.google.com/maps/dir/5221+'s-Hertogenbosch/Hamburg,+Germany/9850+Hirtshals,+Denmark/Kristiansand,+Norway/Stavanger,+Norway/Bergen,+Norway/Oslo,+Norway/Gothenburg,+Sweden/Copenhagen,+Denmark/51.7212599,5.2480084/@51.6852056,5.3248952,11z/data=!4m67!4m66!1m5!1m1!1s0x47c6ed93047f67c9:0xade3d3b710b642d5!2m2!1d5.2442077!2d51.7196067!1m5!1m1!1s0x47b161837e1813b9:0x4263df27bd63aa0!2m2!1d9.9871703!2d53.5488282!1m5!1m1!1s0x4648c84950fc8e4d:0x139a906a2601e4a9!2m2!1d9.9668379!2d57.586953!1m5!1m1!1s0x46380258d5607a5b:0xdf0c0d6fc81c58a4!2m2!1d8.0182064!2d58.1599119!1m5!1m1!1s0x463a3549dd29f795:0xad7aeb21b80a9259!2m2!1d5.7331074!2d58.9699756!1m5!1m1!1s0x46390d4966767d77:0x9e42a03eb4de0a08!2m2!1d5.3220544!2d60.3912628!1m5!1m1!1s0x46416e61f267f039:0x7e92605fd3231e9a!2m2!1d10.7522454!2d59.9138688!1m5!1m1!1s0x464f8e67966c073f:0x4019078290e7c40!2m2!1d11.97456!2d57.70887!1m15!1m1!1s0x4652533c5c803d23:0x4dd7edde69467b8!2m2!1d12.5683372!2d55.6760968!3m4!1m2!1d5.4260897!2d51.7162581!3s0x47c6e5289f0aac7b:0xcf795b140d9534!3m4!1m2!1d5.3486725!2d51.7090762!3s0x47c6efbf648932ab:0xbd2a82799e59b11b!1m0!3e0?entry=ttu&g_ep=EgoyMDI0MDgyMS4wIKXMDSoASAFQAw%3D%3D
landrange = [
  [
    '#BDC6D9',
    '#52688F',
    '#E3E7F1',
    '#7391C8'
  ],
  [
    "#BFD7ED"
    , "#60A3D9"
    , "#0074B7"
  ]
]
const themes = [
  {
    land: {
      stroke: { fill: "black", opacity: .1 },
      fill: {
        range: landrange[0]
        , opacity: .5
      }
    },
    marker: {
      trip: {
        animation: { speed: 1500 },
        color: { stroke: "grey", fill: "red" },
        size: { r: 3, strokeWidth: .5 },
        label: { color: { stroke: "black", fill: "black" }, size: { fontSize: 14, fontWeight: 400, strokeWidth: .3 } },
        line: { color: { stroke: "black", fill: "darkgrey" }, size: { strokeWidth: .5 } },
        box: { color: { stroke: "darkgrey", fill: "white", opacity: .8 }, padding: { left: 5, top: 0 }, size: { width: 150, height: 20, strokeWidth: .9 } },
      },
      info: {
        color: { stroke: "grey", fill: "white" },
        size: { r: 2 },
        label: { color: { stroke: "green", fill: "green" }, size: 8 },
        line: { color: { stroke: "none", fill: "darkgrey" }, size: { strokeWidth: 1 } },

      },
      default: {
        color: { stroke: "grey", fill: "none" },
        size: { r: 2, strokeWidth: .5 },
        label: {
          color: { stroke: "black", fill: "black", fillOpacity: .3, strokeOpacity: .3},
          fontSize: 18,
          fontWeight: 700,
          strokeWidth: .8
        },
        line: { color: { stroke: "none", fill: "darkgrey" }, size: { strokeWidth: 1 } },

      },

    },
    panels: {
    details: {position: {top:104, left: 1250}, width: 800}}
  }];
const theme = themes[0];

let selectedTrip ='Norway';
let selectedYear = '2025';
let centerMap=[-10, 57.0];

// const map = {countries : ['Denmark']}
// 
const SCHEMAS =
  [
    //Sheet 1: Cities
    {

      'ID': {
        prop: 'ID',
        type: Number
      },
      'Include': {
        prop: 'Include',
        type: String
      },
      'Name': {
        prop: 'Name',
        type: String,
      },
      'Descr': {
        prop: 'Descr',
        type: String,
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

      'Country': {
        prop: 'Country',
        type: String
      },
      'iso2': {
        prop: 'Iso2',
        type: String
      }
      ,
      'iso3': {
        prop: 'Iso3',
        type: String
      }
      ,
      'admin_name': {
        prop: 'AdminName',
        type: String
      }
      ,
      'capital': {
        prop: 'Capital',
        type: String
      }
      ,
      'population': {
        prop: 'Population',
        type: Number
      }
      ,
      'id': {
        prop: 'Id',
        type: Number
      }
    }
    ,
    //Sheet 2: Trip
    {

      'Id': {
        prop: 'Id',
        type: Number
      },
      'Include': {
        prop: 'Include',
        type: String
      },
      'Name': {
        prop: 'Name',
        type: String,
      },
      'Descr': {
        prop: 'Descr',
        type: String,
      },
      'Visiting': {
        prop: 'Visiting',
        type: String
      }
      ,
      'Step': {
        prop: 'Step',
        type: Number
      },
      
      'StartDate': {
        prop: 'StartDate',
        type: Date
      },
      'EndDate': {
        prop: 'EndDate',
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

      'dxName': {
        prop: 'dxName',
        type: Number
      }
      ,
      'dyName': {
        prop: 'dyName',
        type: Number
      }
      ,
      'Url': {
        prop: 'Url',
        type: String
      }
      ,

      'Country': {
        prop: 'Country',
        type: String
      },
      'City': {
        prop: 'City',
        type: String
      }

    },
    //Sheet 3: TripDetails
    {
    'Id': {
      prop: 'Id',
      type: Number
    }
    ,
    'Include': {
      prop: 'Include',
      type: String
    }
    ,
    'TripId': {
      prop: 'TripId',
      type: Number
    }
    ,
    'StepName': {
      prop: 'StepName',
      type: String
    }
    ,
    'Sort': {
      prop: 'Sort',
      type: Number
    }
    ,
    'Title': {
      prop: 'Title',
      type: String
    }
    ,
    'Descr': {
      prop: 'Descr',
      type: String
    }
    ,
    'Image': {
      prop: 'Image',
      type: String
    }
    ,
    'Url': {
      prop: 'Url',
      type: String
    }
    ,
    'Cost': {
      prop: 'Cost',
      type: Number
    }
    ,
    'Km': {
      prop: 'Km',
      type: Number
    }
  }

    //Id	TipId	StepName	Sort	Title	Descr	Picture	Url
  ]

// TOOLTIP
d3.select('body').append('div').attr('id', 'ToolTip')
      .attr('style', `position: absolute; opacity: 0; top: 104px; left: ${theme.panels.details.position.left}px`);  

//MARGIN CONVENTION
var MARGIN = { LEFT: 0, RIGHT: 0, TOP: 0, BOTTOM: 0 }
var CANVAS = {
  WIDTH: 1000 - MARGIN.LEFT - MARGIN.RIGHT,
  HEIGHT: 1000 - MARGIN.TOP - MARGIN.BOTTOM
}

const svgMenuCanvas = d3.select("#menu").append("svg")
  .attr("width", 400)
  .attr("height", '100%')

const svgDetailsCanvas = d3.select("#details").append("svg")
  .attr("width", theme.panels.details.width)
  .attr("height", '100%')

const svgCanvas = d3.select("#viz").append("svg")
  .attr("width", CANVAS.WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", CANVAS.HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
  .attr("viewBox", [0, 0, CANVAS.WIDTH, CANVAS.HEIGHT])


let extent = {};
let data;

const width = CANVAS.WIDTH;
const height = CANVAS.HEIGHT;

const WIDTH = width;
const HEIGHT = height;


// EXTENT
// const extentPromise = d3.json('zoom.geojson').then(function (data) {
//   return data;
// });

//this promise returns an array with lattitude and longitude
// const extentData = extentPromise.then(data => {

//   extent = data;
// }
// );


let svg;
let svgMenu;

function main() {
  let vectors = {};
  let cities = {};
  let trip = {};
  let zoom = {};
  let promiseList = [];
  let countries;

  /////////////////////////////////////////////////////////////
  // Trip Menu
  /////////////////////////////////////////////////////////////
  svgMenuCanvas.select('g#menu').remove();
  svgMenu = svgMenuCanvas.append("g").attr('id', 'menu');
  

  /////////////////////////////////////////////////////////////
  // Trip Details
  /////////////////////////////////////////////////////////////
  svgDetailsCanvas.select('g#details').remove();
  svgDetails= svgDetailsCanvas.append("g").attr('id', 'details');
  
  /////////////////////////////////////////////////////////////
  // Trip Graph
  /////////////////////////////////////////////////////////////
  // console.log(selectedTrip)
  svgCanvas.select('g#viz').remove();
  svg = svgCanvas.append("g")
    .attr('id', 'viz')
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

  d3.json(`data/${selectedYear}/${selectedTrip}/countries.json`)
    // .then((resolve,reject)=> {return resolve;})
    .then((resolve,reject) =>
      {
        countries = resolve;
        countries.map(c => promiseList.push(d3.json(`data/geojson/${c}.geojson`).then((resolve, reject) => { return resolve; }).then((resolve, result) => { vectors[c] = resolve; })))
        promiseList.push(fetch(`data/${selectedYear}/${selectedTrip}/${selectedTrip}.xlsx`).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 1, schema: SCHEMAS[0] }).then((resolve, reject) => { citiesUnfiltered      = resolve.rows; })))
        promiseList.push(fetch(`data/${selectedYear}/${selectedTrip}/${selectedTrip}.xlsx`).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 2, schema: SCHEMAS[1] }).then((resolve, reject) => { tripUnfiltered        = resolve.rows; })))
        promiseList.push(fetch(`data/${selectedYear}/${selectedTrip}/${selectedTrip}.xlsx`).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 3, schema: SCHEMAS[2] }).then((resolve, reject) => { tripDetailsUnfiltered = resolve.rows; })))
        
      }
      ).then((resolve,reject) => {

          Promise.all(promiseList)
            .then((resolve, reject) => {
              // console.log('data:', vectors, cities, trip)
              dataGeoJSON = () => {
              const features = [];

              cities
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
              return output;
            }
            const trip = tripUnfiltered.filter(e => (e.Include=="Y")).sort((a,b) => (a.Step - b.Step))
            const tripDetails = tripDetailsUnfiltered.filter(e => (e.Include=="Y")).sort((a,b) => (a.Sort - b.Sort))
            const cities = citiesUnfiltered.filter(e => (e.Include=="Y"))
            dataGeoJSON = dataGeoJSON();
            drawMenu(trip, tripDetails);
            drawMap(vectors, dataGeoJSON, countries, cities, trip)

          }
          )
        })
        }
function pulsatingCircle(circle) {
  function repeat() {
    circle
      .attr('r', 1)
      .attr('stroke-opacity', 1)
      .attr('fill-opacity', 1)
      .transition()
      .duration(theme.marker.trip.animation.speed)
      .ease(d3.easeExpOut)
      .attr('r', 80)
      .attr('stroke-opacity', 0)
      .attr('fill-opacity', 0)
      .transition()
      .duration(0)
      .attr('r', 5)
      .attr('stroke-opacity', 1)
      .attr('fill-opacity', .5)

      .on('end', repeat)
      ;
  }
  repeat();
}
function drawMenu(trip, tripDetails){
  svgMenu.selectAll('.menu').data(trip)
    .join(
      enter => {
            const gEnter = enter.append('g').attr('id',(d,i) => `menuItem${i}`).attr('transform', (d,i) => `translate(${5},${i*40 + 10})`);
            gEnter.append('rect')
              .attr('class', 'menuItem')
              .attr('x1', 0).attr('y1',0).attr('width', 260).attr('height', 30)
              .on("mouseover", function (e, d) {
                  d3.select(this).attr('class', "menuItemSelected")
                  
                  // Pulsating Circle on Map
                  const TripMarkerGroup = d3.select(`g#TripMarkerGroup${d.Id}`)
                  const TripMarkerGroupCircle =
                    TripMarkerGroup
                      .append('circle').attr('class', 'CircleAnimate').attr('fill-opacity', 0)
                      .attr("fill", "white")
                      .attr('r', .1).attr('stroke', "red").attr('stroke-width', 1);

                  pulsatingCircle(TripMarkerGroupCircle);

                  ////////////////////////////////////////////
                  // Details Panel - Tooltip Div / HTML
                  ////////////////////////////////////////////
                  const selectedMenuItem = d["Sort"]
                  var tooltip = d3.select('#ToolTip');
                  const tripDetailsTripId = tripDetails.filter(r => r.TripId == d.Id)
                  let htmlList = "<div class='details'> ";
                  tripDetailsTripId.map(r => {
                    htmlList += `<div class='detailsTitle' style='max-width: ${theme.panels.details.width - 20}px'>${r.Title}</div>`;
                    if (r.Cost) htmlList += `<div class='detailsCost'>€${r.Cost} </div>`;
                    if (r.Image) htmlList += `<div class='detailsImage'><img src="${r.Image}" width="${theme.panels.details.width - 20}px" height="auto" /img> </div>`;
                    htmlList += `<div class='detailsDescr' style='max-width: ${theme.panels.details.width - 20}px'>${r.Descr}</div>`;
                    }
                  )

                  htmlList += '</div>'
                  tooltip.transition().duration(1000).attr('style', `position: absolute; opacity: 1; top: ${theme.panels.details.position.top}px; left: ${theme.panels.details.position.left}px`);
                  tooltip.html(htmlList)

                  ////////////////////////////////////////////
                  // Details Panel - SVG
                  ////////////////////////////////////////////
                  // svgDetails.select("g#divDetails").remove();
                  
                  // // svgDetails.attr("style", () => svgDetails.attr("style") == "display:grid; " ? "display:none;" : "display:grid;")
                  // svgDetailsDiv = svgDetails.append("g").attr("id", "divDetails")
                  
                  // const tripDetailsTripId = tripDetails.filter(r => r.TripId == d.Id)

                  // svgDetailsDiv.selectAll('text').data(tripDetailsTripId)
                  // .join(
                  //   enter => {
                  //     const gEnter = enter.append('g').attr('transform', (d,i) => `translate(${5},${i*40 + 40})`);
                  //     gEnter.append('text').text(d => d.Title).attr('x', 5).attr('y', 0).attr('class', 'DetailsTitle')
                  //     gEnter.append('text').text(d => d.Descr).attr('x', 5).attr('dy', 20).attr('class', 'DetailsDescr')
                  //   }
                  // )




                  ////////////////////////////////////////////
                  // Details Panel - foreignObject
                  ////////////////////////////////////////////

                  // const selectedMenuItem = d["Sort"]
                  // divDetails = d3.select("div.tile#details");
                  // divDetails.select("foreignObject").remove();
                  
                  // divDetails.attr("style", () => divDetails.attr("style") == "display:grid; " ? "display:none;" : "display:grid;")
                  // divDetailsFrame = divDetails.append("foreignObject")
                  //   .append("xhtml:iframe").attr("src", (e,d) =>{console.log(d); return `data/${selectedYear}/${selectedTrip}/details/${selectedMenuItem}.html`} )
                  
                  //   .attr("width", 0)
                  //   .transition()
                  //   .duration(3000)  
                  //   .attr("width", "400")
    

                })

                .on("mouseout", function (e, d) {
                  const TripMarkerGroup = d3.select(`g#TripMarkerGroup${d.Id}`).select('circle.CircleAnimate').remove()     ;
                  tooltip = d3.select('#ToolTip').attr("style", "opacity:0");
                  d3.select(this).attr('class', "menuItem")


                })

            
            // gEnter.on("click", function (e,d)  {
            //   // console.log('clicked', d, d["Sort"])
            //   const selectedMenuItem = d["Sort"]
            //   divDetails = d3.select("div.tile#details");
            //   divDetails.select("foreignObject").remove();
              
            //   divDetails.attr("style", () => divDetails.attr("style") == "display:grid; " ? "display:none;" : "display:grid;")
            //   divDetails.append("foreignObject")
            //   .append("xhtml:iframe").attr("src", (e,d) =>{console.log(d); return `data/${selectedYear}/${selectedTrip}/details/${selectedMenuItem}.html`} )
            // divDetails
            // .attr("width", 0)
            // .transition()
            // .duration(2000)  
            // .attr("width", "400")

              
            // })    
            

            gEnter.append('text').attr('class', 'menuItem').attr('x', (d,i) => 10).attr('y',20).text((d,i)=>`${d.Step}.${d.Name}`);
              
              
            const gEnterDetails =  gEnter.append('g').attr('transform', `translate(${245},${5})`).attr('class', "arrow-details");
            gEnterDetails
            .append('path').attr('d', 'M0 0 L10 10 L0 20 Z');        
          });
                
    

};

function drawMap(vectors, dataGeoJSON, countries, cities, trip) {

  let projection = d3.geoConicEquidistant()
    .rotate([-20.0, 0.0])
    .center(centerMap)
    .parallels([35.0, 65.0])
    .translate([width / 2, height / 2])
    .scale(5000)
    .precision(.1)
  path = d3.geoPath().projection(projection);

 
  colorScaleMapCountry = d3.scaleOrdinal()
    .domain(countries)
    .range(theme.land.fill.range)
    ;

  countries.map(country => {
    svg
      .append("g").attr('id', country)
      .selectAll("path")
      .data(vectors[country]["features"])
      .join("path")
      .attr("d", path)
      .attr("fill", () => {
        // console.log(country,colorScaleMapCountry(country)); 
        return colorScaleMapCountry(country)
      })

      .attr("fill-opacity", theme.land.fill.opacity)
      .attr("stroke", theme.land.stroke.fill)
      .attr("stroke-opacity", theme.land.stroke.opacity)
      .attr("stroke-width", theme.land.stroke.width)
      .style("pointer-events", "none")

      ;
  })

  //TRIP ROUTE
  let prev;
  let dataTripLine = 
      trip
          .sort((a,b) => (a.Sort - b.Sort))//a.StartDate - b.StartDate)
          .map((t,i) => {
            // console.log(t,i);
            if (i==0) prev =t ;
            const line = {FromLat:prev.Lat, FromLong:prev.Long, ToLat: t.Lat, ToLong:t.Long, FromStart:prev.StartDate, FromName: prev.Name, ToName: t.admin_name};
            prev = t;
           return line
          })
  // console.log(dataTripLine)
  const svgTripLine = svg
    .append("g").attr('id', 'TripLine');

  svgTripLine.selectAll("line.TripLine")
             .data(dataTripLine)
             .join(
                enter => {
                  enter.append("line")
                  .attr("x1", d=>projection([+d["FromLong"], +d["FromLat"]])[0])
                  .attr("y1", d=>projection([+d["FromLong"], +d["FromLat"]])[1])
                  .attr("x2", d=>projection([+d["ToLong"], +d["ToLat"]])[0])
                  .attr("y2", d=>projection([+d["ToLong"], +d["ToLat"]])[1])
                  .attr("stroke", "red")


                }

             )


  const svgCities = svg
    .append("g").attr('id', 'Cities')
    .selectAll("marker")
    .data(cities) //& e.Population > 500000)))
    .join(

      enter => {
        const gEnter = enter.append('g').attr('transform', d => `translate(${projection([+d["Long"], +d["Lat"]])[0]},${projection([+d["Long"], +d["Lat"]])[1]})`);
        const gEnterCircle = gEnter.append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", theme.marker.default.size.r)
          .attr("fill", theme.marker.default.color.fill)
          .attr("stroke", theme.marker.default.color.stroke)
          .attr("stroke-width", theme.marker.default.size.strokeWidth)
          .attr("fill-opacity",)
        // .on("mouseenter", mouseenter)
        // .on("mouseleave", mouseleave);

        const gEnterLabel =
          gEnter
            .append("text")
            .text(d => d.Name)
            .attr("x", 0)
            .attr("y", 0)
            .attr("dx", -4)
            .attr("dy", 2)
            .attr("class", "LabelDefault")
            .attr("text-anchor", "end")
            .attr("font-size", theme.marker.default.label.fontSize)
            .attr("font-weight", theme.marker.default.label.fontWeight)
            .attr("fill", theme.marker.default.label.color.fill)
            .attr("fill-opacity", theme.marker.default.label.color.fillOpacity)
            .attr("stroke-opacity", theme.marker.default.label.color.strokeOpacity)
            .attr("stroke-width", theme.marker.default.label.strokeWidth)
            .attr("stroke", theme.marker.default.label.color.stroke)


      }
    )


  const svgTripMarkers = svg
    .append("g").attr('id', 'TripMarkers')
    .selectAll("TripMarkerGroup")
    .data(trip)
    .join(
      enter => {
        const gEnter = enter.append('g').attr('id', d => `TripMarkerGroup${d.Id}`).attr('class', 'TripMarkerGroup')
          .attr('transform', d => `translate(${projection([+d["Long"], +d["Lat"]])[0]},${projection([+d["Long"], +d["Lat"]])[1]})`);;
        const gEnterLine =
          gEnter
            .append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", d => d.dxName)
            .attr("y2", d => d.dyName)
            .attr("stroke", theme.marker.trip.line.color.fill)
            .attr("stroke-width", theme.marker.trip.line.size.strokeWidth)

          ;
        const gEnterBox =
          gEnter
            .append("a")
            .attr("href", d => { return d.Url; })
            .attr("target", "_blank")
            .append("rect")

            .attr("x", d => +d.dxName)
            .attr("y", d => +d.dyName - (theme.marker.trip.box.size.height / 2))
            .attr("width", theme.marker.trip.box.size.width)
            .attr("height", theme.marker.trip.box.size.height)
            .attr("rx", 3)

            .attr("class", "LabelTrip")
            .attr("fill", theme.marker.trip.box.color.fill)
            .attr("fill-opacity", theme.marker.trip.box.color.opacity)

            .attr("stroke", theme.marker.trip.box.color.stroke)
            .attr("stroke-width", theme.marker.trip.box.size.strokeWidth)


          ;


        const gEnterLabel =
          gEnter
            .append("text")
            .text(d => d.Name)
            .attr("x", 0)
            .attr("y", 0)
            .attr("dx", d => d.dxName + theme.marker.trip.box.padding.left)
            .attr("dy", d => d.dyName + (theme.marker.trip.label.size.fontSize / 3))
            .attr("class", "LabelTrip")
            .attr("font-size", theme.marker.trip.label.size.fontSize)
            .attr("font-weight", theme.marker.trip.label.size.fontWeight)
            .attr("fill", theme.marker.trip.label.color.fill)
            .attr("stroke", theme.marker.trip.label.color.stroke)
            .attr("stroke-width", theme.marker.trip.label.size.strokeWidth)
          ;


        const gEnterCircle =
          gEnter
            .append("circle").attr('id', d => `Trip${d.Id}`)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", d => d.Visiting == "Y" ? theme.marker.trip.size.r : theme.marker.info.size.r)
            .attr("stroke", d => d.Visiting == "Y" ? theme.marker.trip.color.stroke : theme.marker.info.color.stroke)
            .attr("fill", d => d.Visiting == "Y" ? theme.marker.trip.color.fill : theme.marker.info.color.fill)
            .attr("stroke-width", theme.marker.trip.size.strokeWidth)
            .attr("class", "Circle")

          // gEnterCircle.filter(function(d) {return d.Visiting == "Y"; }).append("animate").attr("attributeName","stroke-opacity").attr("from","1").attr("to","0").attr("dur","2.5s").attr("begin","0s").attr("repeatCount","indefinite");
          // gEnterCircle.filter(function(d) {return d.Visiting == "Y"; }).append("animate").attr("attributeName","r").attr("from","0").attr("to","100").attr("dur","2.5s").attr("begin","0s").attr("repeatCount","indefinite")
          // gEnterCircle.append("animate").attr("attributeName","stroke-opacity").attr("from","1").attr("to","0").attr("dur","2.5s").attr("begin","0s").attr("repeatCount","indefinite");
          // gEnterCircle.append("animate").attr("attributeName","r").attr("from","0").attr("to","100").attr("dur","2.5s").attr("begin","0s").attr("repeatCount","indefinite")
          ;


      }
    )
   
}



main();





