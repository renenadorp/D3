var sourceFile    =`CaldicRFP.xlsx`;
var colorBy       = 'TimeLineId';
var colorScheme   = 'schemeTableau10';

const sourceFileSettings = [
  { sourceFile: "Football_EC_2024.xlsx", 
    colorByList: [
          {  value: 'TimeLineId', name: 'TimeLine'},
          {  value: 'Country', name: 'Country'},
        ],
        svgHeight: 500,
        XaxisPadding: {left: 15, right:2 } //Number of days to add left/right to the x-axis
  },
  {sourceFile: "CaldicRFP.xlsx", 
          colorByList: [
                  {  value: 'TimeLineId', name: 'TimeLine'},
                  {  value: 'Country', name: 'Country'},
                ],
                svgHeight: 300,
                XaxisPadding: {left: 5, right:2 } //Number of days to add left/right to the x-axis
      },
      
    {sourceFile: "CaldicRoadmap.xlsx", colorByList: [
                          {  value: 'TimeLineId', name: 'TimeLine'},
                          {  value: 'Stream', name: 'Stream'},
                        ],
                        svgHeight: 1150,
                        XaxisPadding: {left: 10, right:10 } //Number of days to add left/right to the x-axis
                      },
              {sourceFile: "ObvionRoadmap.xlsx", colorByList: [
                  {  value: 'TimeLineId', name: 'TimeLine'},
                  {  value: 'Stream', name: 'Stream'},
                ],
                svgHeight: 550,
                XaxisPadding: {left: 10, right:10 } //Number of days to add left/right to the x-axis
              },
              {sourceFile: "Philosophy.xlsx", colorByList: [
                {  value: 'TimeLineId', name: 'TimeLine'},
                {  value: 'Stream', name: 'Stream'},
                {  value: 'Country', name: 'Country'},
                {  value: 'DateOfBirth', name: 'DateOfBirth'},
              ],
              svgHeight: 2500,
              XaxisPadding: {left: 10, right:5000 } //Number of days to add left/right to the x-axis
            },
           {sourceFile: "LDM_Stages.xlsx", colorByList: [
              {  value: 'TimeLineId', name: 'TimeLine'},

            ],
            svgHeight: 600,
            XaxisPadding: {left: 10, right:10 } //Number of days to add left/right to the x-axis
          }
]
const colorSchemeList = [
  {name: "schemeSet1"       , scheme: d3.schemeSet1  },
  {name: "schemeCategory10" , scheme: d3.schemeCategory10  },
  {name: "schemeAccent"     , scheme: d3.schemeAccent  },
  {name: "schemeDark2"      , scheme: d3.schemeDark2  },
  {name: "schemeTableau10"  , scheme: d3.schemeTableau10  },
  {name: "schemeCustom1"    , scheme: d3.scaleOrdinal().range([`#383867`, `#584c77`, `#33431e`, `#a36629`, `#92462f`, `#b63e36`, `#b74a70`, `#946943`])  }
  
  
]

const VERTICAL_TICKS =  16;
const TODAY_MARKER_Y = -40;
const TODAY_LINE_Y   = -10;

const TIMELINE_GAP    = 30;
const TIMELINE_OFFSET = 90;
var   margin       = { top: 50, right: 180, bottom: 100, left: 150 }
var   maxWidth     = 3000 - margin.left - margin.right;
var   width        = maxWidth - margin.left - margin.right;
var   svgMain;
// var parseTime = d3.timeParse("%ddd %mmm %Y HH:MM:SS"); // Tue May 01 2012 02:00:00 GMT+0200 (Central European Summer Time)
var parseTime = d3.timeFormat("%d-%b-%Y"); 
var timeFormat = d3.timeFormat(" [%d-%b-%Y ]");

var _x, _y, height, TimeLineColor;


var tip = d3.select("body").append("div").attr('id', 'timeLineToolTip').attr('style', 'position: absolute; opacity: 0; z-index: 100');


const SCHEMAS  = 
[
  { //Sheet Timeline
    'Id'              : { prop: 'Id',		          type: Number,		required: true	  } ,
    'TimeLineId'      : { prop: 'TimeLineId',	    type: Number,		required: true	  } ,
    'Year'            : {	prop: 'Year',           type: Number,   required: false	  } ,
    'Month'           : {	prop: 'Month',          type: Number,   required: false	  } ,
    'Day'             : {	prop: 'Day',            type: Number,   required: false	  } ,
    'Name'            : {	prop: 'Name',	          type: String,		required: false	  } ,
    'AnnTitle'        : { prop: 'AnnTitle',       type: String,		required: false	  } ,
    'AnnLabel'        : {	prop: 'AnnLabel',	      type: String,		required: false	  } ,
    'Description'     : {	prop: 'Description',	  type: String,		required: false	  } ,
    'AnnDX'           : {	prop: 'AnnDX',	        type: Number,		required: false	  } ,
    'AnnDY'           : {	prop: 'AnnDY',	        type: Number,		required: false	  } ,
    'AnnType'         : {	prop: 'AnnType',	      type: String,		required: false	  } ,
    'AnnConnectorEnd' : {	prop: 'AnnConnectorEnd',type: String,		required: false	  } ,
    'AnnLineType'     : {	prop: 'AnnLineType',    type: String,		required: false	  } ,
    'Central Ideas'   : {	prop: 'Central Ideas',  type: String,		required: false	  } ,
    'Stream'          : {	prop: 'Stream',    	    type: String,		required: false	  } ,
    'Publications'    : {	prop: 'Publications',   type: String,		required: false	  } ,
    'Country'         : {	prop: 'Country',        type: String,		required: false	  } ,
    'DateOfBirth'     : {	prop: 'DateOfBirth',    type: String,		required: false	  } ,
    'DateOfDeath'     : {	prop: 'DateOfDeath',    type: String,		required: false	  } ,
    'urlBase'     : {	prop: 'urlBase',    type: String,		required: false	  } ,
    'urlPage'     : {	prop: 'urlPage',    type: String,		required: false	  } ,
  }

]



var data;
var labels, labelData;
function getLabelData(rows) {
  var label_data = rows.filter(row => {
    return (row.hasOwnProperty("AnnTitle"))
  }
  );
  // console.log('label_data',label_data)
  return label_data;
}
function handleTimeLineTipMouseOver (e, item) {
  var t = function(tipList) {
    var tipBox ='';
    const tipBoxHeader = `<table class= 'tipBox'>`;
    const tipBoxFooter = `</table>`;
    tipList.map(l => { 
                      return l.Value ? tipBox+=`<tr><td class='tipTitle'>${l.Key}</td><td class='tipContent'>${l.Value}</td></tr>`:null; 
                    })
    return tipBoxHeader + tipBox + tipBoxFooter;
  }

  var tipData = item[0];
  // console.log('tipData:', tipData)
  var tipList = [
                {"Key"        : "Name",         "Value"   : tipData.Name}, 
                {"Key"        : "Country",      "Value"   : tipData.Country}, 
                {"Key"        : "Stream",       "Value"   : tipData.Stream}, 
                {"Key"        : "Publications", "Value"   : tipData.Publications},
                {"Key"        : "Central Ideas","Value"   : tipData["Central Ideas"]},
                {"Key"        : "Description",  "Value"   : tipData.Description},
              ]
  var tipBox = t(tipList);
    tip
    // .transition()		
    // .duration(200)		
    .style("opacity", 0.9)
    .html(tipBox)
    .style("left", (e.pageX) + "px")
    .style("top", (e.pageY+10) + "px")
    return;
    }
 

function handleTimeLineTipMouseOut (e, item) {    
  //parms: e=onmouse event data, item: item data 
  tip.style("opacity", 0)
    //console.log("TIP OUT")
//      tip.remove();
}

function handleTimeLineClick(e, d) {
    if (d[0].urlBase)
    window.open(
      `${d[0].urlBase}/${d[0].urlPage}`,
      '_blank' 
    );
}

function createTimeline(e, item, index, colorBy ) {
  var timeLine =   e.append("path").attr("class", "TimeLine");
  timeLine
  .data([data.filter(r => {return (r.TimeLineId == item)})])
  // .attr("class", "line")
  .attr("style", d=> {
    return `stroke-width: 8; stroke: ${TimeLineColor(d[0][colorBy])}; stroke-linecap: round; `})
  .attr("d", d3.line()
        .x(function(d) { return _x(d.Date) })
        .y(function(d) { return _y(d.Value)}) //_y(d.Value)
        ) 
  .on("mouseover", function(e,d){return handleTimeLineTipMouseOver(e, d)})
  .on("mouseout", (e,d)=>handleTimeLineTipMouseOut(e,d))
  .on("click", (e,d)=>handleTimeLineClick(e,d))    
    
}

function main(){
  //Fill Option List for ColorBY
  var domColorByOptionList = d3.select('#colorByOptionList');
  var htmlColorByOptionList="";
  
  var settings = sourceFileSettings.find(row => row.sourceFile === sourceFile);
  settings.colorByList.map(option => {
      htmlColorByOptionList += `<option value ="${option.value}" ${option.value === colorBy ? "selected" : ''}>${option.name}</option> \n`;
  })
  domColorByOptionList.html(htmlColorByOptionList);
  selectedScheme = colorSchemeList.find(scheme => {return scheme.name === colorScheme })
  TimeLineColor  = d3.scaleOrdinal(selectedScheme.scheme);
  
  height    = settings.svgHeight ;
  var canvasHeight = settings.svgHeight - margin.bottom - margin.top ;
  console.log(height, canvasHeight)
  _x = d3.scaleTime().range([0, width]);
  _y = d3.scaleLinear().range([0, canvasHeight   ]);

  LINKXLS = sourceFile;
	fetch(LINKXLS)
		.then(response => response.blob())
		.then(blob => 
      Promise.all ([
        readXlsxFile(blob, {sheet:1, schema: SCHEMAS[0] }),
      ] )
      .then((rows ) => {

        data   = rows[0].rows;

        // console.log('data:', data, rows)
        
        labelData = getLabelData(data);
        
        // DATA PREP
        data.forEach(function (d) {
          //d.Date = parseTime(String(d.Day)+"-"+String(d.Month)+"-"+String(d.Year) );


          d.Date = new Date(Date.UTC(d.Year,  d.Month - 1, d.Day,0, 0, 0, 0)); // Month starts with 0 for Jan, 11 for Dec
          d.Date.setUTCFullYear(d.Year);
          
          //console.log(d.Date)
          //d.Date = d.Date;
          //d.Value = +d.Value;

          d.Value = d.TimeLineId ;
        });
        
      
        // AXES
        function addDays(date, days) {
          var result = new Date(date);
          result.setDate(result.getDate() + days);
          return result;
        }
        xDomainExtent = d3.extent(data, function (d) {
          return d.Date;
        });
        console.log(xDomainExtent)
        // date.addDays(5)
        xDomainExtent[0] = addDays( xDomainExtent[0], -settings.XaxisPadding.left);
        xDomainExtent[1] = addDays( xDomainExtent[1], settings.XaxisPadding.right);
        console.log(xDomainExtent)
        

        _x.domain(xDomainExtent);
      
        _y.domain([-1, d3.max(data, function (d) {
          return d.Value;
          }) + 2]);      

        
        d3.select('body').select("#svgContainer").remove();
        svg = d3.select('body')
                .append('div').attr('id', 'svgContainer')
                .append("svg")
                .attr("width",  maxWidth)
                .attr("height", height)
                .append('g')
                .attr("transform", `translate(${margin.left} , ${margin.top})`)
                ;

        svgAxisX1 = svg.append("g").attr("class", "x-axis").attr("transform", "translate(0,0)");
        svgAxisX1
        .call(d3.axisTop(_x).tickSize(-canvasHeight )
        .ticks(VERTICAL_TICKS))
        .selectAll("text") 
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-90)")
          ;
          
          svgAxisX2 = svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${canvasHeight})`);
          svgAxisX2
          .call(d3.axisBottom(_x).tickSize(0 )
          .ticks(VERTICAL_TICKS))
          .selectAll("text") 
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-90)")
            ;
            
                  

        svg.append("g").call(d3.axisLeft(_y).tickValues([]));
        
        // TIMELINES
        const Timelines = Array.from(new Set(data.map((item) => item.TimeLineId)));
        Timelines          
          .forEach((item,index) => createTimeline(svg, item, index, colorBy))
       
        // ANNOTATIONS
        const annotation_types = {'elbow'     : d3.annotationCalloutElbow,
                                  'circle'    : d3.annotationCalloutCircle,
                                  'rect'      : d3.annotationCalloutRect,
                                  'badge'     : d3.annotationBadge,
                                  'threshold' : d3.annotationXYThreshold
                                }
        // console.log('labelData', labelData)
        var labels = labelData.map(r => {
          return {  data: {Date:r.Date, Value: r.Value, Annotation: r.AnnTitle +`${r.urlBase? ' ⤴':''}`, Label: r.AnnLabel, url: r.urlBase ? `${r.urlBase}/${r.urlPage}`:undefined},
                    color: TimeLineColor(r[colorBy] ),
                    dy: r.AnnDY ? r.AnnDY : -5,
                    dx: r.AnnDX ? r.AnnDX : 0,
                    type:  d3.annotationCustomType(annotation_types[r.AnnType],//d3.annotationCalloutElbow, //d3.annotationCalloutCircle
                    {"className"  : "callout",
                      "connector" : {"type":"elbow",
                                     "end"       : r.AnnConnectorEnd
                                    },
                      "note"      : {"lineType" :r.AnnLineType}
                      
                    })
                  }
        }).map(function (l) {
          // console.log('l', l)
            l.note = Object.assign({}, l.note, { title:  l.data.Annotation , url:l.data.url, label: l.data.Label + timeFormat(l.data.Date) 
            });
            return l;
          });
                      
          
        window.makeAnnotations = d3.annotation()
        .annotations(labels)
        .accessors({ 
          x: function x(d) {
            return _x(d.Date);
          },
          y: function y(d) {
            return _y(d.Value);
          }
  
        }).accessorsInverse({
          Date: function Date(d) {
            return timeFormat(_x.invert(d.x));
          },
          Value: function Value(d) {
            return _y.invert(d.y);
          }
        }).on('subjectover', function (annotation) {
      
          //cannot reference this if you are using es6 function syntax
          this.append('text').attr('class', 'hover').text(annotation.note.title).attr('text-anchor', 'middle').attr('y', annotation.subject.y && annotation.subject.y == "bottom" ? 50 : -40).attr('x', -15);
      
          this.append('text').attr('class', 'hover').text(annotation.note.label).attr('text-anchor', 'middle').attr('y', annotation.subject.y && annotation.subject.y == "bottom" ? 70 : -60).attr('x', -15);
        }).on('subjectout', function (annotation) {
          this.selectAll('text.hover').remove();
        });
      

        svg.append("g").attr("class", "annotation-test").call(makeAnnotations);
            

        // ADD TODAY MARKER LINE
        const today = new Date(); 
        var dd = String(today.getDate());
        var gToday = svg.append('g').attr('id', 'gToday')
        gToday.append("line")
          .attr("x1", _x(today))  //<<== change your code here
          .attr("y1", TODAY_LINE_Y)
          .attr("x2", _x(today))  //<<== and here
          .attr("y2", canvasHeight)
          .style("stroke-width", .6)
          .style("stroke", "red")
          .style("fill", "none");
          gToday.append('rect')
          .attr('x', _x(today) - 25)
          .attr('y', TODAY_MARKER_Y)
          .attr('width', 50)
          .attr('height', 30)
          .attr('stroke', 'red')
          .attr('stroke-opacity', 0.8)
          .attr('opacity', 0.8)
          .attr('fill', 'red')
          .attr('rx', 5)
          
          gToday.append('text')
          .attr('x', _x(today) - 13 )
          .attr('y', TODAY_MARKER_Y + 10)
          .text('Today')
          .attr('stroke', 'white')
          .attr('fill', 'white')
          
          gToday.append('text')
          .attr('x', _x(today) - 13 )
          .attr('y',  TODAY_MARKER_Y + 20)
          .text(today.getDate()  + "-" + (today.getMonth()+1) + "-" + today.getFullYear())
          .attr('stroke', 'white')
          .attr('fill', 'white')
          .attr('font-size', '0.6em')
          .attr('font-weight', 'normal')
          
        
        
      }) 
    )
}
main();