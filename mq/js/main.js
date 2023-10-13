// const LINK = "data/bsc.json"
// d3.json(LINK)
// .then(data => {
//   //log(20,data)
//   //updateScoreCard(data);
//   //updateCauses(data);
// });
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {log, drawLogo} from "./functions.js" ;

// LOGO
const vizLogo     = d3.select("#viz-logo");

const svgLogo = vizLogo.append("svg")
  					.attr("width" , 100)
  					.attr("height", 100);

const gLogo = svgLogo.append('g')
              .attr("transform", `translate(30,20)`)
            //.attr("viewBox", `0 -20 ${WIDTH} 33`)
            ;

drawLogo(gLogo, {
  width: 200,
  height: 200,
  scale : .2

});
const T = {BOXES: 1000, GOALS: 1000, RELATIONS: 2000}

const SCHEMAS  = 
[
  { //Sheet 1: Boxes
    'id'            : { prop: 'id',		          type: String,		required: true	  } ,
    'name'          : {	prop: 'name'    ,		    type: String,		required: false	  } ,
    'description'   : { prop: 'description',    type: String,		required: false	  } ,
    'guidance'      : {	prop: 'guidance',		    type: String,		required: false	  } ,
  },
  { //Sheet 2: Goals
    'id'            : {   prop: 'id',		        type: String,		required: true	  } ,
    'boxId'         : {		prop: 'boxId',	      type: String,		required: false	  } ,
    'name'          : {		prop: 'name',	        type: String,		required: false	  } ,
  },
  { //Sheet 3: Relations
    'goalId'        : {   prop: 'goalId',		    type: String,		required: true	  } ,
    'goalIdRelated' : {		prop: 'goalIdRelated',type: String,		required: true	  } ,
    'strength'      : {		prop: 'strength'     ,type: String,		required: false	  } ,
  },
  { //Sheet 4: Causes
    'id'            : {   prop: 'id',		        type: String,		required: true	  } ,
    'name'          : {		prop: 'name'    ,		  type: String,		required: true	  } ,
    'groupId'       : {		prop: 'groupId'    ,	type: String,		required: false	  } ,
  },
  { //Sheet 5: Impacts
    'goalId'        : {   prop: 'goalId',		    type: String,		required: true	  } ,
    'causeId'       : {		prop: 'causeId'    ,	type: String,		required: true	  } ,
    'Impact'        : {		prop: 'Impact'    ,		type: Number,		required: true	  } ,
  }
]
const CUSTOMER = 'Inergy'
const LINKXLS = `data/bsc${CUSTOMER}.xlsx`

function readExcelFile(){
	//log(20,'LINK:', LINK)
	fetch(LINKXLS)
		.then(response => response.blob())
		.then(blob => 
      Promise.all ([
        readXlsxFile(blob, {sheet:1, schema: SCHEMAS[0] }),
        readXlsxFile(blob, {sheet:2, schema: SCHEMAS[1] }),
        readXlsxFile(blob, {sheet:3, schema: SCHEMAS[2] }),
        readXlsxFile(blob, {sheet:4, schema: SCHEMAS[3] }),
        readXlsxFile(blob, {sheet:5, schema: SCHEMAS[4] })
      ] )
      .then((rows ) => {
        //log(20,rows)
        var data = composeBscJson(rows);
        updateScoreCard(data);
        updateCauseSelection(data);
        updateBoxSelection(data)
      }) 
    )
}

function composeBscJson(sheetData){
  // var result = blobList.filter(obj => {
  //   return obj.b === 6
  //})
  var   bsc = {};
  const boxes = sheetData[0].rows;
  const goals = sheetData[1].rows;
  const relations = sheetData[2].rows;
  const causes = sheetData[3].rows;
  const impacts = sheetData[4].rows;

  bsc.boxes=boxes;
  bsc.boxes.map(b => {
    b.selected=true;
    b.goals = goals.filter(r => { return r.boxId==b.id});
    b.goals.map(g => { g.relations = relations.filter(r => { return r.goalId == g.id})  })
    b.goals.map(g => { g.impactedByCauses = impacts.filter(r => { return r.goalId == g.id})  })
  
  }
  )
  bsc.causes=causes;


  //console.log ('Data From Excel: ', bsc)

  return bsc;
}

readExcelFile()

//VIZ BSC
//########################
const WIDTH  				  = 1500;
const HEIGHT  				= 1300;
const BOX             = { WIDTH: 900, HEIGHT: 110}
const ELLIPSE         = { WIDTH: 120, HEIGHT: 25, INITIALFILL: "#707070", INITIALSTROKE: "#999999"}
const GOAL            = { CX: 10, CY: 10, RX: 100, RY: 50}
const MARGIN          = { LEFT  : 550, RIGHT: 1, TOP: 400, BOTTOM: 1 }
const CANVAS          = { WIDTH : WIDTH  - MARGIN.LEFT - MARGIN.RIGHT,
                          HEIGHT: HEIGHT - MARGIN.TOP  - MARGIN.BOTTOM}

const vizBsc     = d3.select("#viz-bsc");

const svg = vizBsc.append("svg")
  					.attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
  					.attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
            .attr("id", "vizBsc")
            //.attr("viewBox", `0 -20 ${WIDTH} 33`)
            ;
const colorGoalDomain = [0,1,2,3,4,5,6,7,8,9,10];
const colorGoalRange =  [
  {"start":"#cccccc","stop":"#bbbbbb", "stroke":"#494c53"}, //DEFAULT - GREY

  {"start":"#CDE386","stop":"#8DB135", "stroke":"#81A331"}, //LOW     - GREEN
  {"start":"#CDE386","stop":"#8DB135", "stroke":"#81A331"},
  {"start":"#CDE386","stop":"#8DB135", "stroke":"#81A331"},

  {"start":"#F8E39A","stop":"#D3B34E", "stroke":"#C2A245"}, //MEDIUM  - YELLOW 
  {"start":"#F8E39A","stop":"#D3B34E", "stroke":"#C2A245"}, 
  {"start":"#F8E39A","stop":"#D3B34E", "stroke":"#C2A245"}, 
  
  {"start":"#FBD081","stop":"#F78A51", "stroke":"#A35E2F"}, //LARGE   - ORANGE
  {"start":"#FBD081","stop":"#F78A51", "stroke":"#A35E2F"}, //LARGE   - ORANGE
  {"start":"#FBD081","stop":"#F78A51", "stroke":"#A35E2F"}, //LARGE   - ORANGE
  

  {"start":"#EBA393","stop":"#C25037", "stroke":"#B1472F"}, //X-LARGE - RED
  {"start":"#EBA393","stop":"#C25037", "stroke":"#B1472F"}, 
  {"start":"#EBA393","stop":"#C25037", "stroke":"#B1472F"}, 
  {"start":"#EBA393","stop":"#C25037", "stroke":"#B1472F"}, 
 


]

var grads = svg.append("defs").selectAll("radialGradient")
                .data(colorGoalDomain)
                .enter()
                .append("radialGradient")
                .attr("gradientUnits", "objectBoundingBox")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", "100%")
                .attr("id", function(d, i) { return "grad" + i; });
          
        grads.append("stop")
            .attr("offset", "0%")
            .style("stop-color", function(d,i) { return colorGoalRange[i].start});
        
        grads.append("stop")
            .attr("offset", "100%")
            .style("stop-color",  function(d,i) { return colorGoalRange[i].stop});
            
const markerBoxWidth = 5;
const markerBoxHeight = 5;
const refX = markerBoxWidth /  2;
const refY = markerBoxHeight / 2;
const markerWidth = markerBoxWidth / 2;
const markerHeight = markerBoxHeight / 2;
const arrowPoints = [[0, 0], [0, 5], [5, 2.5]]; 

svg.select('defs')
.append('marker')
.attr('id', 'arrow')
.attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
.attr('refX', refX)
.attr('refY', refY)
.attr('markerWidth', markerBoxWidth)
.attr('markerHeight', markerBoxHeight)
.attr('orient', 'auto-start-reverse')
.append('path')
.attr('d', d3.line()(arrowPoints))
.attr('stroke', 'none');

//BSC
function updateScoreCard(data){
  log(20,'UpdateScoreCard data',data);
  d3.select("#vizBsc").selectAll(".box").remove();
  d3.select("#vizBsc").selectAll(".goalRelation").remove();

  var boxes = data.boxes.filter(b => b.selected==true)
  updateBoxes(boxes);
  updateGoals(boxes);
  log(20,'Box data:',boxes)
  updateGoalRelations(boxes);
  
}

function updateBoxes(data){
  log(20,'updateBoxes data:', data)
  const t = svg.transition().duration(T.BOXES);

  const enterBox = (join ) => {
    //parm "join": data join (dom-selection + data)
    //log(20,'updateBoxes bscBox start')
    const g = join.append('g').attr("class", "box").attr("id", (d,i)=>`${d.name}`).attr("transform",`translate(${0}, ${-50})`);

    //log(20,'updateBoxes bscBox after g append ')
    g.append('g').attr("coord", (d,i) => {d.coord={"x":5,"y":i*(BOX.HEIGHT+5)};return `(${d.coord.x},${d.coord.y})`})
    g.append("rect").attr("class", "box").attr("rx", 5).attr("ry", 5).attr("width", BOX.WIDTH).attr("height", (d,i) => BOX.HEIGHT)
    g.append("text").attr("class", "box").text(d =>d.name).attr("y", 20).attr("x",10)
    
    //log(20,'updateBoxes bscBox boxText ')
    g.selectAll(".boxText").data((d,i) => [d.description]).join(
      enter => enter.append("text").text((d,i)=>d).attr("class", "boxText").attr("x", 20).attr("y", (d,i)=>(i+2)*22 ));
    ;
    //log(20,'updateBoxes bscBox transition')

    g.call(join=> join.transition(t).attr("transform",(d,i)=>`translate(${5}, ${i*(BOX.HEIGHT+5)})`));
    return g.node()//element.node();
  }
  const exitBox = (join) => {
    //join.transition().duration(500).remove();
  }

  svg.selectAll(".box")
      .data(data)
      .join(
        enter  => {enter.call(enterBox);        },
        update => {log(20,'update boxes' , update)},
        exit   => {log(20,'exit boxes'   , exit); exit.call(exitBox)}) 
      ;
  //log(20,'updateBoxes end;')
  return svg.node();

}

function updateGoals(data){
  log(20,'data updateGoals', data)
  var updateGoal = (update, op) => {
    log(20, 'updateGoal')
    update.select("ellipse").call(updateGoalFill);
    update.select("text.goal").call(updateGoalText);//.text(d=>{log(20,'d:', d.name); return d.name}).attr("text-anchor", "middle").attr("dy", 5)
  }
  var updateGoalText = (j) => {
    j.text(d =>  d.name).attr("class","goal").attr("text-anchor", "middle").attr("dy", 5)
  }
  var updateGoalFill = (j) => {
    j.attr("fill", (d,i) => {
            log(20, 'updateGoalFill', d)
            var ellipseColour = "url(#grad0)";
            if (Object.hasOwn(d, "impactedByCauses")) {
              log(20,'updateGoalFill:', d, selectedCauseId)
              var impactedBySelectedCause = d.impactedByCauses.find(x => { return x.causeId == selectedCauseId})
              log(20,'impactedBySelectedCause:',impactedBySelectedCause)
              impactedBySelectedCause ?  ellipseColour = "url(#grad" + impactedBySelectedCause.Impact + ")" : ELLIPSE.INITIALCOLOR;
            }
            return  ellipseColour;
          })
          .attr("stroke", (d,i)=>{
            var ellipseStroke = ELLIPSE.INITIALSTROKE;
            if (Object.hasOwn(d, "impactedByCauses")) {
              const impactedBySelectedCause = d.impactedByCauses.find(x => {return x.causeId == selectedCauseId})
              impactedBySelectedCause ?  ellipseStroke = colorGoalRange[impactedBySelectedCause.Impact].stroke : ELLIPSE.INITIALSTROKE;
            }
            return  ellipseStroke;
          })
          .attr("stroke-width", 2)
          return j
  }
  const enterGoal = (enter, op,  box) => {
    log(20, 'enterGoal', enter)
    const t1 = svg.transition().duration(T.GOALS);

    //Compute goal absolute coordinates: box + goal x and y 
    const goalCoord = (d,i) => {return {"x": (ELLIPSE.WIDTH * 1.8 + (ELLIPSE.WIDTH * i * 2.1)) + box.coord.x,
                                        "y": (BOX.HEIGHT/2 ) + box.coord.y}
                  };
    var g        = enter.append('g').attr("class", "goal").attr("id", (d,i)=>`${d.id}`).attr("transform",`translate(${0}, ${-50})`);

    g.append('g').attr("coord", (d,i) => {d.coord=goalCoord(d,i); return `(${goalCoord(d,i)})`})

    var gEllipse = g.append("ellipse").attr("fill",ELLIPSE.INITIALFILL).attr("stroke",ELLIPSE.INITIALSTROKE).attr("rx", ELLIPSE.WIDTH).attr("ry", ELLIPSE.HEIGHT)
    var gText    = g.append("text").attr("class","goal").text(d=>d.name).attr("text-anchor", "middle").attr("dy", 5)
    g.call(enter=> enter.transition(t1).attr("transform",(d,i)=>`translate(${ELLIPSE.WIDTH * 1.8 + (ELLIPSE.WIDTH * i * 2.1)}, ${(BOX.HEIGHT/2 )})`));
    gEllipse.call(enter => enter//.transition(t2)
                          .attr("fill", (d,i) => {
                            var ellipseColour = "url(#grad0)";
                            if (Object.hasOwn(d, "impactedByCauses")) {
                              var impactedBySelectedCause = d.impactedByCauses.find(x => {
                                                    log(10, 'x fill: ', x)  
                                                    return x.causeId == selectedCauseId;
                                                    })
                              impactedBySelectedCause ?  ellipseColour = "url(#grad" + impactedBySelectedCause.Impact + ")" : ELLIPSE.INITIALCOLOR;
                              log(20,'d fill', d)
                              log(20,'ellipseColour fill', ellipseColour)
                              log(20,'impactedBySelectedCause fill', impactedBySelectedCause)
                              log(20,'selectedCauseId fill', selectedCauseId)
                              
                            }
                            return  ellipseColour;
                            })
                          .attr("stroke", (d,i)=>{
                            var ellipseStroke = ELLIPSE.INITIALSTROKE;
                            if (Object.hasOwn(d, "impactedByCauses")) {

                              
                              var impactedBySelectedCause = d.impactedByCauses.find(x => {return x.causeId == selectedCauseId})
                              impactedBySelectedCause ?  ellipseStroke = colorGoalRange[impactedBySelectedCause.Impact].stroke : ELLIPSE.INITIALSTROKE;
                              log(20,'d stroke', d)
                              log(20,'impactedBySelectedCause stroke', impactedBySelectedCause)
                              log(20,'selectedCauseId stroke', selectedCauseId)                            }
                            return  ellipseStroke;
                          })
                          .attr("stroke-width", 1)
                          )

    return g.node();
    }
  //data = [data] //convert string to list to ensure single row
  const boxes = svg.selectAll(".box").data(data);
  boxes.each((d,i) => {
      svg.select(`.box#${d.name}`).selectAll(".goal").data(d.goals, d => d.id)
        .join(enter   => { enterGoal(enter, 'enter', d)},
              update  => { log(20, "selectedCauseId", selectedCauseId); if (selectedCauseId != selectedCauseIdPrev) updateGoal(update, 'update');},
              exit    => {   }
          )}
    )
  
  return svg.node();

}

// CAUSES
// #####################

//SELECTIONS
var selectedCauseId;
var selectedCauseIdPrev;

function updateGoalRelations(data){
  log(20,'updateGoalRelation', data)
 
  const enterGoalRelation = (enter, op ) => {
    const t1 = svg.transition().duration(T.RELATIONS);
    //log(20,'x:', enter.select(this.parentNode).attr("transform").translate);
    const g= enter.append('g').attr('class', 'goalRelation')
            .append('path').attr('d', d => linkGen(d)).attr('class', 'link').attr('opacity', 0)
    
    g.call(enter => enter.transition(t1).attr('opacity', 1)).attr('marker-end', 'url(#arrow)') .attr("stroke-width", d =>  d.strength * 0.4) 

    return;
    }

  // SOURCE & TARGET COORDINATES
  var  links=[]
  data.map((box,bi) => {
    //log(20,box, bi, box.coord)
  
    if (Object.hasOwn(box, "goals")) {
      //log(20,'box has goal list')
      box.goals.map((goalSource, gi) => {
        //log(20,goal,gi, goal.coord, box.coord)
        //svg.append('circle').attr('cx',goalSource.coord.x).attr('cy',goalSource.coord.y ).attr("r", 10)
        
        if(Object.hasOwn(goalSource, "relations")){
          goalSource.relations.map(relation => {
          //Find Target Goal 
          try 
          {
            data.map(boxTarget => 
              { 
                //log(20,'goals length:', boxTarget.goals.length )
                if (boxTarget.goals.length > 0) 
                {
                  //log(20,boxTarget.goals)
                  boxTarget.goals.map(goalTarget => {
                  //log(20,"goalTarget.id", goalTarget.id)

                  if (goalTarget.id==relation.goalIdRelated)  { 
                    //log(20,'Source, Target: ', goalSource, goalTarget);
                    links.push({"source"  :goalSource,
                                "target"  :goalTarget,
                                "strength":+relation.strength
                              });
                            }

                  })
                }
              }
            )
          }
           catch(err) {
            log(20,'An error occurred!', err)
          }          })
          
        }
      })
      }
     
  })
  //log(20,"links", links)

  var linkGen = d3.linkVertical()
    .source(d => { return {x: d.source.coord.x, y: d.source.coord.y-(ELLIPSE.HEIGHT)}})
    .target(d => { return {x: d.target.coord.x, y: d.target.coord.y+(ELLIPSE.HEIGHT) + (markerWidth*2)}})
    .x(d => d.x)
    .y(d => d.y);
  
  svg.selectAll('.link').data(links).join(
      enter => enterGoalRelation(enter, 'enter')
  )
    return svg.node();

}

function updateCauseSelection(data) {
  //log(20,'updateCauses data', data)
  var causeSelectDiv     = d3.select("#selectCause").data([null]);
  const causeSelectDivInputGroup = causeSelectDiv.append("div").attr("class", "input-group")
  causeSelectDivInputGroup.append("div").attr("class","input-group-prepend")
                          .append("label").attr("class", "input-group-text")
                          .attr("for", "cause-list").text("Select Cause")
  const causeSelectForm = causeSelectDivInputGroup.append("select")
                  .attr("class" , "form-control")
                  .attr("name"  , "cause-list")
                  .attr("id"    , "cause-list");
                  
  //log(20,'updateCauses: before dummy')
  const dummyOption = {	"id": 0,  "name" : "Select ...",  "group": ""  }
  var CauseOptionList = causeSelectForm.selectAll("option").data([dummyOption, ...data.causes]).join(
      enter => enter.append("option").text((d,i) => d.name).attr("value", (d,i) => d.id)
    ) 

  const selectCause = document.querySelector('#selectCause');
  //log(20,'s:', selectCause)
  selectCause.addEventListener('change', (event) => {
    selectedCauseIdPrev = selectedCauseId;
    selectedCauseId     = event.target.value;
    updateScoreCard(data);
    // updateGoals(data);

  });
  return;
}

function updateBoxSelection(data){
  log(20,'updateBoxSelection data', data)
  var boxSelectDiv     = d3.select("#selectBox").data([null]);
  const boxSelectDivInputGroup = boxSelectDiv.append("div").attr("class", "input-group")
  boxSelectDivInputGroup.append("div").attr("class","input-group-prepend")
                          .append("label").attr("class", "input-group-text")
                          .attr("for", "selectBox").text("Select Boxes")
  const boxSelectDivCheckBoxes = boxSelectDivInputGroup.append('div').attr("class","col");
  boxSelectDivCheckBoxes.selectAll(".row").data(data.boxes).join(
    enter => { var divCheckBox = enter.append("div").attr("class", "row").append("div").attr("class", "form-check form-switch");
              divCheckBox.append("input").attr("class", "form-check-input bscCheckBox").attr("type", "checkbox").attr("id", (d,i) => `${d.id}`).attr("checked",true);
              divCheckBox.append("label").attr("class", "form-check-label").attr("for", (d,i) => `${i}`).text((d,i) => d.name)
             }
  )

  const bscCheckBoxes = document.querySelectorAll('.form-check-input.bscCheckBox');
  log(20,'s:', bscCheckBoxes)
  bscCheckBoxes.forEach(r => r.addEventListener('change', (event) => {
    const boxesCheckedSelection = document.querySelectorAll('.form-check-input.bscCheckBox:checked')

    const bscBoxesChecked = Array.from(boxesCheckedSelection).map(x => x.id)
    data.selected=bscBoxesChecked
    log(20,'data:', data)
    log(20,'Boxes Checked:',bscBoxesChecked)
    data.boxes.map(b => {b.selected = bscBoxesChecked.includes(b.id) ? true : false})
    log(20,'data:',data)

    log(20,'boxesCheckedSelection:', boxesCheckedSelection)
    updateScoreCard(data);
    
  }
  ));
  
  return;
}
