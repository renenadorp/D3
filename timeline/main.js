
//console.log('main.js')

const VERTICAL_TICKS = 16;
const TIMELINE_GAP = 90;
var margin    = { top: 20, right: 180, bottom: 100, left: 50 },
    height    = 1200 - margin.top - margin.bottom;
var maxWidth  = 1500 - margin.left - margin.right;
var width     = maxWidth - margin.left - margin.right;

// var parseTime = d3.timeParse("%ddd %mmm %Y HH:MM:SS"); // Tue May 01 2012 02:00:00 GMT+0200 (Central European Summer Time)
var parseTime = d3.timeFormat("%d-%b-%Y"); 
var timeFormat = d3.timeFormat("%d-%b-%Y");

var _x = d3.scaleTime().range([0, width]);
var _y = d3.scaleLinear().range([height, 0]);

var svg = d3.select("body").append("svg").attr("width", maxWidth).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var tip = d3.select("body").append("div").attr('id', 'timeLineToolTip').attr('style', 'position: absolute; opacity: 0; z-index: 100');

const LINKXLS = `CaldicRoadmap.xlsx`

const SCHEMAS  = 
[
  { //Sheet Timeline
    'Id'              : { prop: 'Id',		          type: Number,		required: true	  } ,
    'TimeLineId'      : { prop: 'TimeLineId',	    type: Number,		required: true	  } ,
    'Year'            : {	prop: 'Year',           type: Number,   required: false	  } ,
    'Month'           : {	prop: 'Month',          type: Number,   required: false	  } ,
    'Day'             : {	prop: 'Day',            type: Number,   required: false	  } ,
    'Name'            : {	prop: 'Name',	  type: String,		required: false	  } ,
    'AnnTitle'        : { prop: 'AnnTitle',          type: String,		required: false	  } ,
    'AnnLabel'        : {	prop: 'AnnLabel',	    type: String,		required: false	  } ,
    'Description'     : {	prop: 'Description',	    type: String,		required: false	  } ,
    'AnnDX'           : {	prop: 'AnnDX',	type: Number,		required: false	  } ,
    'AnnDY'           : {	prop: 'AnnDY',	type: Number,		required: false	  } ,
    'AnnType'         : {	prop: 'AnnType',	type: String,		required: false	  } ,
    'AnnConnectorEnd' : {	prop: 'AnnConnectorEnd',	type: String,		required: false	  } ,
    'AnnLineType'     : {	prop: 'AnnLineType',    	type: String,		required: false	  } ,
    
  }

]

const TimeLineColor = d3.scaleOrdinal(d3.schemeSet1); // schemeCategory10,schemeAccent, schemeDark2, schemeSet1

var data;
var labels, labelData;
function getLabelData(rows) {
  var label_data = rows.filter(row => {
    return (row.hasOwnProperty("AnnTitle"))
  }
  );
  console.log('label_data',label_data)
  return label_data;
}
function handleTimeLineTipMouseOver (e, item) {
  var t = function(s) {
    if (s == undefined)
      return "?";
    else return s
  }

  var tipData = item[0];
  // console.log('tipData:', tipData)
  var tipBox ="";
  tipBox+= "<div class='tipBox'>";
  tipBox+="<div class='tipTitle'>"+t(tipData.Name)+"</div>";
  tipBox+= "<div>"+t(tipData.Description)+"</div>";
  tipBox+="</div>";
  //console.log("TIP IN", e, item)
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

function createTimeline(e, item ) {
  var timeLine =   e.append("path");
  timeLine
  .data([data.filter(r => {return (r.TimeLineId == item)})])
  // .attr("class", "line")
  .attr("style", "stroke-width: 10; stroke: "+ TimeLineColor(item)+";    stroke-linecap: round; ")
  .attr("d", d3.line()
        .x(function(d) { return _x(d.Date) })
        .y(function(d) { return _y(d.Value) }) //_y(d.Value)
        ) 
  .on("mouseover", function(e,d){return handleTimeLineTipMouseOver(e, d)})
  .on("mouseout", (e,d)=>handleTimeLineTipMouseOut(e,d))    
    
}

function main(){
	fetch(LINKXLS)
		.then(response => response.blob())
		.then(blob => 
      Promise.all ([
        readXlsxFile(blob, {sheet:1, schema: SCHEMAS[0] }),
      ] )
      .then((rows ) => {
        data   = rows[0].rows;

        console.log('data:', data)
        
        labelData = getLabelData(data);
        
        // DATA PREP
        data.forEach(function (d) {
          //d.Date = parseTime(String(d.Day)+"-"+String(d.Month)+"-"+String(d.Year) );


          d.Date = new Date(Date.UTC(d.Year,  d.Month - 1, d.Day,0, 0, 0, 0)); // Month starts with 0 for Jan, 11 for Dec
          d.Date.setUTCFullYear(d.Year);
          
          //console.log(d.Date)
          //d.Date = d.Date;
          //d.Value = +d.Value;
          d.Value = height - (+d.TimeLineId * TIMELINE_GAP +160);
        });
        
      
        // AXES
        _x.domain(d3.extent(data, function (d) {
          return d.Date;
        }));
      
        _y.domain([150, d3.max(data, function (d) {
          return d.Value;
          })+100]);         
        
        svg.append("g").attr("class", "x-axis").attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(_x).tickSize(-height)
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
          .forEach((item,index) => createTimeline(svg, item, index))
       
        // ANNOTATIONS
        const annotation_types = {'elbow'     : d3.annotationCalloutElbow,
                                  'circle'    : d3.annotationCalloutCircle,
                                  'rect'      : d3.annotationCalloutRect,
                                  'badge'     : d3.annotationBadge,
                                  'threshold' : d3.annotationXYThreshold
                                }
        // console.log('labelData', labelData)
        var labels = labelData.map(r => {
          return {  data: {Date:r.Date, Value: r.Value, Annotation: r.AnnTitle, Label: r.AnnLabel},
                    color: TimeLineColor(r.TimeLineId ),
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
            l.note = Object.assign({}, l.note, { title:  l.data.Annotation, label: l.data.Label
              //label: timeFormat(l.data.Date) 
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
          .attr("y1", 20)
          .attr("x2", _x(today))  //<<== and here
          .attr("y2", height)
          .style("stroke-width", .6)
          .style("stroke", "red")
          .style("fill", "none");
          gToday.append('rect')
          .attr('x', _x(today) - 25)
          .attr('y', 0)
          .attr('width', 50)
          .attr('height', 30)
          .attr('stroke', 'red')
          .attr('stroke-opacity', 0.8)
          .attr('opacity', 0.8)
          .attr('fill', 'red')
          .attr('rx', 5)
          
          gToday.append('text')
          .attr('x', _x(today) - 13 )
          .attr('y', 13)
          .text('Today')
          .attr('stroke', 'white')
          .attr('fill', 'white')
          
          gToday.append('text')
          .attr('x', _x(today) - 13 )
          .attr('y', 23)
          .text(today.getDate()  + "-" + (today.getMonth()+1) + "-" + today.getFullYear())
          .attr('stroke', 'white')
          .attr('fill', 'white')
          .attr('font-size', '0.6em')
          .attr('font-weight', 'normal')
          
        
        
      }) 
    )
}
main();