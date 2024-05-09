import { useD3 } from "../useD3";
import React, { useContext, useEffect, useRef, useState } from "react";
// import useMultiRefs from "./multiRef";


import * as d3 from "d3";
import { useContainerSize }  from "../useContainerSize";
import { PhilosophyContext } from "../context_philosophy";
import { Annotation, SubjectCircle, ConnectorElbow, ConnectorEndDot, Note, AnnotationCalloutCircle, AnnotationXYThreshold } from "react-annotation"
import theme from "../theme"
import CONST from '@/app/d3config';

// console.log(CONST)
var _x = d3.scaleTime().range([0, CONST.SCREEN.WIDTH]);
var _y = d3.scaleLinear().range([CONST.SCREEN.HEIGHT, 0]);
const TimeLineColor = d3.scaleOrdinal(d3.schemeDark2);
var tip;


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
  tipBox+="<div class='tipTitle'>"+t(tipData.Philosopher)+" ("+t(tipData.DateOfBirth)+" ~ "+t(tipData.DateOfDeath)+")</div>";
  tipBox+= "<div>"+t(tipData.Synthesis)+"</div>";
  tipBox+="</div>";
  // console.log("TIP IN", e, item)
    tip
    // .transition()		
    // .duration(200)		
    .style("opacity", 0.9)
    .html(tipBox)
    .style("left", (e.pageX) + "px")
    .style("top", (e.pageY+10) + "px")
    return ;
  }

function handleTimeLineTipMouseOut (e, item) {    
  //parms: e=onmouse event data, item: item data 
  tip.style("opacity", 0)
    //console.log("TIP OUT")
//      tip.remove();
}

const createTimelineAnnotations = (rows) => {
  console.log('createAnnotations', rows)
  var labelData = rows.filter(row => {
    return (row.hasOwnProperty("Annotation"))
  }
  );
  var labels = labelData.map(r => {
    return {  data: {Date:r.Date, Value: r.Value, Annotation: r.Annotation},
              color: TimeLineColor(r.TimeLineId ),
              dy:   r.Annotation_dy ? r.Annotation_dy : -5,
              dx:   r.Annotation_dx ? r.Annotation_dx : 0,
              type: AnnotationXYThreshold
            }
  }).map(function (l) {
      l.note = Object.assign({}, l.note, { title:  l.data.Annotation,
        //label: timeFormat(l.data.Date) 
      });
      return l;
    });

  const annotations = labels
    .map(a => {
      const Annotation = a.type
      const { note, subject, dx, data } = a 
      note.wrap = 30
      note.lineType = null
      note.align = "middle"
      return <Annotation
        x={_x(data.Date)}
        y={_y(data.Value) || 1}
        dx={dx}
        note={note}
        subject={subject}
      />
    })
  
  
    return (
        annotations
    )

  };


function createTimeline(e, item, timeline_data) {
  var   timeLine =   e.append("path");

  timeLine
  .data([timeline_data])
  // .attr("class", "line")
  .attr("style", "stroke-width: 5; stroke: "+ TimeLineColor(item)+";    stroke-linecap: round; ")
  .attr("d", d3.line()
        .x(function(d) { return _x(d.Date) })
        .y(function(d) { return _y(d.Value) }) 
        ) 
  .on("mouseover", function(e,d){return handleTimeLineTipMouseOver(e, d)})
  .on("mouseout", (e,d)=>handleTimeLineTipMouseOut(e,d))    
    
}

function TimeLineChart(data,{svg} = {}) 
{
  // AXES
  _x.domain(d3.extent(data, function (d) {
    return d.Date;
  }));

  _y.domain([150, d3.max(data, function (d) {
    return d.Value;
    })+100]);  

  const Timelines = Array.from(new Set(data.map((item) => item.TimeLineId)));
  Timelines          
  .forEach((item,index) => {
    const timeline_data = data.filter(r => {return (r.TimeLineId == item)});
    createTimeline(svg, item, timeline_data);
  })


  svg.append("g").attr("class", "x-axis").attr("transform", "translate(0," + CONST.SCREEN.HEIGHT  + ")")
  .call(d3.axisBottom(_x).tickSize(-CONST.SCREEN.HEIGHT)
  .ticks(100))
  .selectAll("text") 
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", "rotate(-90)")
  ;
  svg.append("g").call(d3.axisLeft(_y).tickValues([]));

  
  // ANNOTATIONS
  svg.append('g').attr('id', 'annotations');



              
  // ZOOM
/*
  let zoom = d3.zoom()
    .on('zoom', handleZoom);

  function handleZoom(e) {
    svg.attr('transform', e.transform);
  }

  function initZoom() {
    svg.call(zoom);
  }

  initZoom();
*/

          


  return svg.node();
}

function Philosophy() {

  const containerRef      = useRef(null);
  const { width, height } = useContainerSize(containerRef);
  const raww              = useContext(PhilosophyContext);

  // const [selectedMake, setselectedMake] = useState("0-all");
  // const [selectedColor, setselectedColor] = useState(    "acceleration_0_100_km/h_s"  );

  // const [selectedSize, setselectedSize] = useState("highway_fuel_per_100km_l");

  let makeSelector = null;
  if (raww) {
  
  }


  const ref = useD3(
    (svg) => {
      tip = d3.select("body").append("div").attr('id', 'timeLineToolTip').attr('style', 'position: absolute; opacity: 0; z-index: 100');

      svg.selectAll("*").remove();
      // svg.attr("width", CONST.SCREEN.WIDTH).attr("height", CONST.SCREEN.HEIGHT)
      svg.attr('transform', `scale(${CONST.ZOOM.INITIAL_SCALE})`)
      if (!raww) return;

      //  filter everything with selectedMake

      let raw = raww;

      const columns = raww.columns;
    
      TimeLineChart(raw, {
    
        width: width,
        // height: height,
        svg
      });
   
      createTimelineAnnotations(raw, {

        svg
      });




    },
    [width, raww]
  );
  // width="50" height="50" viewBox="0 0 50 50">
  const viewBox = CONST.VIEWBOX.X+" " + CONST.VIEWBOX.Y+" " +CONST.VIEWBOX.WIDTH+" "+CONST.VIEWBOX.HEIGHT;


  return (
    <div className="gap-y-4">
      <div>{this.props.children}</div>

      {makeSelector}
      {/* <div ref={containerRef} className="w-full flex overflow"> */}
      <div ref={containerRef} className="chart"  >
      <svg
          ref={ref}
          // ref={addMultiRef}
          width= {CONST.SCREEN.WIDTH}
          height= {CONST.SCREEN.HEIGHT}
          viewBox= {viewBox}
          preserveAspectRatio="none"
          style={{

          }}
        />
      </div>
    </div>
  );
}

export default Philosophy;
