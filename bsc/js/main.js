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
  width   : 200,
  height  : 200,
  scale   : .2

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
  { //Sheet 4: Issues
    'id'            : {   prop: 'id',		        type: String,		required: true	  } ,
    'name'          : {		prop: 'name'    ,		  type: String,		required: true	  } ,
    'groupId'       : {		prop: 'groupId'    ,	type: String,		required: false	  } ,
  },
  { //Sheet 5: Impacts
    'issueId'       : {		prop: 'issueId'    ,	type: String,		required: true	  } ,
    'goalId'        : {   prop: 'goalId',		    type: String,		required: true	  } ,
    'Impact'        : {		prop: 'Impact'    ,		type: Number,		required: true	  } ,
  }
]
//const CUSTOMER = 'Inergy';//'DQQuickScan'
const CUSTOMER = 'Inergy';
const LINKXLS = `data/bsc${CUSTOMER}.xlsx`

function readExcelFile(){
	//log('LINK:', LINK)
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
        //log(rows)
        var data = composeBscJson(rows);
        updateScoreCard(data);
        updateIssueSelection(data);
        updateBoxSelection(data);
        updateRelationStrengthSelection(data);
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
  const issues = sheetData[3].rows;
  const impacts = sheetData[4].rows;

  bsc.boxes=boxes;
  bsc.boxes.map(b => {
    b.selected=true;
    b.goals = goals.filter(r => { return r.boxId==b.id});
    b.goals.map(g => { g.relations = relations.filter(r => { return r.goalId == g.id})})
    b.goals.map(g => { g.impactedByIssues = impacts.filter(r => { return r.goalId == g.id})  })
  
  }
  )
  bsc.issues=issues;


  log ('Data From Excel: ', bsc)

  return bsc;
}

readExcelFile()

//VIZ BSC
//########################
const WIDTH  				  = 1200;
const HEIGHT  				= 1300;
const BOX             = { WIDTH: WIDTH, HEIGHT: 110}
const ELLIPSE         = { WIDTH: 100, HEIGHT: 25, INITIALFILL: "#707070", INITIALSTROKE: "#999999", INITIALOFFSET: 2.5, SPACE: 2.5}
const GOAL            = { CX: 10, CY: 10, RX: 200, RY: 50}
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
  {"start":"#cccccc","stop":"#bbbbbb", "stroke":"#A12119"}, //DEFAULT - GREY (prev stroke color: "#494c53")

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
  log('UpdateScoreCard data',data);
  d3.select("#vizBsc").selectAll(".box").remove();
  d3.select("#vizBsc").selectAll(".goalRelation").remove();
  log('updateScoreCard - selectedRelationStrength:', selectedRelationStrength,)
  var fdata = data.boxes.filter(b => b.selected==true);

  // log('fdata:', fdata,)
  updateBoxes(fdata);
  updateGoals(fdata);
  updateGoalRelations(fdata);
  
}

function updateBoxes(data){
  log('updateBoxes data:', data)
  const t = svg.transition().duration(T.BOXES);

  const enterBox = (join ) => {
    //parm "join": data join (dom-selection + data)
    //log('updateBoxes bscBox start')
    const g = join.append('g').attr("class", "box").attr("id", (d,i)=>`${d.name}`).attr("transform",`translate(${0}, ${-50})`);

    //log('updateBoxes bscBox after g append ')
    g.append('g').attr("coord", (d,i) => {d.coord={"x":5,"y":i*(BOX.HEIGHT+5)};return `(${d.coord.x},${d.coord.y})`})
    g.append("rect").attr("class", "box").attr("rx", 5).attr("ry", 5).attr("width", BOX.WIDTH).attr("height", (d,i) => BOX.HEIGHT)
    g.append("text").attr("class", "box").text(d =>d.name).attr("y", 20).attr("x",10)
    
    //log('updateBoxes bscBox boxText ')
    g.selectAll(".boxText").data((d,i) => [d.description]).join(
      enter => enter.append("text").text((d,i)=>d).attr("class", "boxText").attr("x", 20).attr("y", (d,i)=>(i+2)*22 ));
    ;
    //log('updateBoxes bscBox transition')

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
        update => {log('update boxes' , update)},
        exit   => {log('exit boxes'   , exit); exit.call(exitBox)}) 
      ;
  //log('updateBoxes end;')
  return svg.node();

}

function updateGoals(data){
  log('data updateGoals', data, 50)
  var updateGoal = (update, op) => {
    log( 'updateGoal')
    update.select("ellipse").call(updateGoalFill);
    update.select("text.goal").call(updateGoalText);//.text(d=>{log('d:', d.name); return d.name}).attr("text-anchor", "middle").attr("dy", 5)
  }
  var updateGoalText = (j) => {
    j.text(d =>  d.name).attr("class","goal").attr("text-anchor", "middle").attr("dy", 5)
  }
  var updateGoalFill = (j) => {
    j.attr("fill", (d,i) => {
            log( 'updateGoalFill', d)
            var ellipseColour = "url(#grad0)";
            if (Object.hasOwn(d, "impactedByIssues")) {
              log('updateGoalFill:', d, SelectedIssueId, 50)
              var impactedBySelectedIssue = d.impactedByIssues.find(x => { return x.issueId == SelectedIssueId})
              log('impactedBySelectedIssue:',impactedBySelectedIssue)
              impactedBySelectedIssue ?  ellipseColour = "url(#grad" + impactedBySelectedIssue.Impact + ")" : ELLIPSE.INITIALCOLOR;
            }
            return  ellipseColour;
          })
          .attr("stroke", (d,i)=>{
            var ellipseStroke = ELLIPSE.INITIALSTROKE;
            if (Object.hasOwn(d, "impactedByIssues")) {
              const impactedBySelectedIssue = d.impactedByIssues.find(x => {return x.issueId == SelectedIssueId})
              impactedBySelectedIssue ?  ellipseStroke = colorGoalRange[impactedBySelectedIssue.Impact].stroke : ELLIPSE.INITIALSTROKE;
            }
            return  ellipseStroke;
          })
          .attr("stroke-width", 2)
          return j
  }
  const enterGoal = (enter, op,  box) => {
    log( 'enterGoal', enter)
    const t1 = svg.transition().duration(T.GOALS);

    //Compute goal absolute coordinates: box + goal x and y 
    const goalCoord = (d,i) => {return {"x": (ELLIPSE.WIDTH * ELLIPSE.INITIALOFFSET + (ELLIPSE.WIDTH * i * ELLIPSE.SPACE)) + box.coord.x,
                                        "y": (BOX.HEIGHT/2 ) + box.coord.y}
                  };
    var g        = enter.append('g').attr("class", "goal").attr("id", (d,i)=>`${d.id}`).attr("transform",`translate(${0}, ${-50})`);

    g.append('g').attr("coord", (d,i) => {d.coord=goalCoord(d,i); return `(${goalCoord(d,i)})`})

    var gEllipse = g.append("ellipse").attr("fill",ELLIPSE.INITIALFILL).attr("stroke",ELLIPSE.INITIALSTROKE).attr("rx", ELLIPSE.WIDTH).attr("ry", ELLIPSE.HEIGHT)
    var gText    = g.append("text").attr("class","goal").text(d=>d.name).attr("text-anchor", "middle").attr("dy", 5)
    g.call(enter=> enter.transition(t1).attr("transform",(d,i)=>`translate(${ELLIPSE.WIDTH * ELLIPSE.INITIALOFFSET + (ELLIPSE.WIDTH * i * ELLIPSE.SPACE)}, ${(BOX.HEIGHT/2 )})`));
    gEllipse.call(enter => enter//.transition(t2)
                          .attr("fill", (d,i) => {
                            var ellipseColour = "url(#grad0)";
                            if (Object.hasOwn(d, "impactedByIssues")) {
                              var impactedBySelectedIssue = d.impactedByIssues.find(x => {
                                                    log('x fill: ', x, )  
                                                    return x.issueId == SelectedIssueId;
                                                    })
                              impactedBySelectedIssue ?  ellipseColour = "url(#grad" + impactedBySelectedIssue.Impact + ")" : ELLIPSE.INITIALCOLOR;
                              log('d fill', d)
                              log('ellipseColour fill', ellipseColour)
                              log('impactedBySelectedIssue fill', impactedBySelectedIssue)
                              log('SelectedIssueId fill', SelectedIssueId)
                              
                            }
                            return  ellipseColour;
                            })
                          .attr("stroke", (d,i)=>{
                            var ellipseStroke = ELLIPSE.INITIALSTROKE;
                            if (Object.hasOwn(d, "impactedByIssues")) {

                              
                              var impactedBySelectedIssue = d.impactedByIssues.find(x => {return x.issueId == SelectedIssueId})
                              impactedBySelectedIssue ?  ellipseStroke = colorGoalRange[impactedBySelectedIssue.Impact].stroke : ELLIPSE.INITIALSTROKE;
                              log('d stroke', d)
                              log('impactedBySelectedIssue stroke', impactedBySelectedIssue)
                              log('SelectedIssueId stroke', SelectedIssueId)                            }
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
              update  => { log( "SelectedIssueId", SelectedIssueIdPrev); if (SelectedIssueId != SelectedIssueIdPrev) updateGoal(update, 'update');},
              exit    => {   }
          )}
    )
  
  return svg.node();

}

// issues
// #####################

//SELECTIONS
var SelectedIssueId;
var SelectedIssueIdPrev;

function updateGoalRelations(data){
  log('updateGoalRelation', data)
 
  const scaleStrength = d3.scaleLog()
  .base(10)
  .domain([1, 4]);

  const enterGoalRelation = (enter, op ) => {
    const t1 = svg.transition().duration(T.RELATIONS);
    //log('x:', enter.select(this.parentNode).attr("transform").translate);
    const g= enter.append('g').attr('class', 'goalRelation')
            .append('path').attr('d', d => {
              if (d.source.coord.x == d.target.coord.x){ 
                if (d.source.coord.y == d.target.coord.y) 
                  alert('Something is wrong'); // Source and Target have same coordinates. That is not correct.
              
                else
                {
                  if (Math.abs(d.source.coord.y - d.target.coord.y) > BOX.HEIGHT +10)     
                  {                                   
                    return linkGoalCurvedVertical(d);
                  }
                  else return linkGoalVertical(d);  
                }
              }
              else { //X coordinates not equal
                if (d.source.coord.y == d.target.coord.y) 
                {
                  if (Math.abs(d.source.coord.x - d.target.coord.x) > ELLIPSE.WIDTH + 10) 
                  {    
                    return linkGoalCurvedHorizontal(d);
                  }
                  else { return linkGoalHorizontal(d)};
                }
                else                                      
                  return linkGoalVertical(d);
              } 
              
            }).attr('class', 'link').attr('opacity', 0)
    
    g.call(enter => enter.transition(t1)
                          .attr('opacity', 0.5))
                          .attr('marker-end', 'url(#arrow)') 
                          .attr("stroke-width", d =>  scaleStrength(d.strength*2)) 

    return;
    }
    const cReds = d3.schemeReds[9];
    
    // SOURCE & TARGET COORDINATES
  var  links=[]
  data.map((box,bi) => {
    //log(box, bi, box.coord)
  
    if (Object.hasOwn(box, "goals")) {
      //log('box has goal list')
      box.goals.map((goalSource, gi) => {
        //log(goal,gi, goal.coord, box.coord)
        //svg.append('circle').attr('cx',goalSource.coord.x).attr('cy',goalSource.coord.y ).attr("r", 10)
        
        if(Object.hasOwn(goalSource, "relations")){
          goalSource.relations.map(relation => {
          //Find Target Goal 
            if (+relation.strength > selectedRelationStrength)
            {
              try 
              {
                data.map(boxTarget => 
                  { 
                    //log('goals length:', boxTarget.goals.length )
                    if (boxTarget.goals.length > 0) 
                    {
                      //log(boxTarget.goals)
                      boxTarget.goals.map(goalTarget => {
                      //log("goalTarget.id", goalTarget.id)

                      if (goalTarget.id==relation.goalIdRelated)  { 
                        //log('Source, Target: ', goalSource, goalTarget);
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
                log('An error occurred!', err)
                }          
            }
          }
          )
        }
      })
    }
     
  })
  //log("links", links)

  var linkGoalVertical = d3.linkVertical()
    .source(d => { return {x: d.source.coord.x, y: d.source.coord.y-(ELLIPSE.HEIGHT * (d.source.coord.y > d.target.coord.y ? 1 : -1))}})
    .target(d => { return {x: d.target.coord.x, y: d.target.coord.y+(ELLIPSE.HEIGHT * (d.source.coord.y > d.target.coord.y ? 1 : -1)) + (markerWidth*2)*(d.source.coord.y > d.target.coord.y ? 1 : -1)}})
    .x(d => d.x)
    .y(d => d.y);
  
  var linkGoalHorizontal = d3.linkHorizontal()
    .source(d => { var c;
                  (d.source.coord.x < d.target.coord.x ) ? // Is source left or right of target?
                  c =  {x: d.source.coord.x + (ELLIPSE.WIDTH), y: d.source.coord.y}  : //LEFT
                  c =  {x: d.source.coord.x - (ELLIPSE.WIDTH), y: d.source.coord.y } ; //RIGHT
                  return c;
                }) 
    .target(d => { var c;
                  (d.source.coord.x < d.target.coord.x ) ? // Is source left or right of target?
                  c =  {x: d.target.coord.x - (ELLIPSE.WIDTH)  - (markerWidth), y: d.target.coord.y } : //LEFT
                  c =  {x: d.target.coord.x + (ELLIPSE.WIDTH)  + (markerWidth), y: d.target.coord.y } ; //RIGHT
                  return c;
                }) 
    .x(d => d.x)
    .y(d => d.y);
  
    var linkGoalCurvedVertical = function(d) {
      var p = d3.path();
      p.moveTo( d.source.coord.x - ELLIPSE.WIDTH, d.source.coord.y );
      p.quadraticCurveTo(d.target.coord.x  - ELLIPSE.WIDTH*2, 
                         d.target.coord.y - (d.target.coord.y - d.source.coord.y)/2, 
                         d.target.coord.x - ELLIPSE.WIDTH, 
                         d.target.coord.y);
      return p;
     };
  
     var linkGoalCurvedHorizontal = function(d) {
      var p = d3.path();
      p.moveTo( d.source.coord.x , d.source.coord.y - ELLIPSE.HEIGHT );
      p.quadraticCurveTo(d.source.coord.x + (d.target.coord.x - d.source.coord.x)/2, 
                         d.target.coord.y  - ELLIPSE.HEIGHT*3, 
                         d.target.coord.x, 
                         d.target.coord.y - ELLIPSE.HEIGHT);
      return p;
     };
  
  


  svg.selectAll('.link').data(links).join(
      enter => enterGoalRelation(enter, 'enter')
  )
    return svg.node();

}

function updateIssueSelection(data) {
  //log('updateissues data', data)
  var issueSelectDiv     = d3.select("#selectIssueDiv").data([null]);
  const issueSelectDivInputGroup = issueSelectDiv.append("div").attr("class", "input-group")
  issueSelectDivInputGroup.append("div").attr("class","input-group-prepend")
                          .append("label").attr("class", "input-group-text")
                          .attr("for", "issue-list").text("Issue")
  const issueSelectForm = issueSelectDivInputGroup.append("select")
                  .attr("class" , "form-control")
                  .attr("name"  , "issue-list")
                  .attr("id"    , "selectIssue");
                  
  //log('updateissues: before dummy')
  const dummyOption = {	"id": 0,  "name" : "Select ...",  "group": ""  }
  var IssueOptionList = issueSelectForm.selectAll("option").data([dummyOption, ...data.issues]).join(
      enter => enter.append("option").text((d,i) => d.name).attr("value", (d,i) => d.id)
    ) 

  const selectIssue = document.querySelector('#selectIssue');
  log('selectIssue:', selectIssue, )
  selectIssue.addEventListener('change', (event) => {
    SelectedIssueIdPrev = SelectedIssueId;
    SelectedIssueId     = event.target.value;
    log('SelectedIssueId', SelectedIssueId, )
    updateScoreCard(data);
    // updateGoals(data);

  });
  return;
}

function updateBoxSelection(data){
  log('updateBoxSelection data', data)
  var boxSelectDiv     = d3.select("#selectBoxDiv").data([null]);
  const boxSelectDivInputGroup = boxSelectDiv.append("div").attr("class", "input-group")
  boxSelectDivInputGroup.append("div").attr("class","input-group-prepend")
                          .append("label").attr("class", "input-group-text")
                          .attr("for", "selectBox").text("Boxes")
  const boxSelectDivCheckBoxes = boxSelectDivInputGroup.append('div').attr("class","col");
  boxSelectDivCheckBoxes.selectAll(".row").data(data.boxes).join(
    enter => { var divCheckBox = enter.append("div").attr("class", "row").append("div").attr("class", "form-check form-switch");
              divCheckBox.append("input").attr("class", "form-check-input bscCheckBox").attr("type", "checkbox").attr("id", (d,i) => `${d.id}`).attr("checked",true);
              divCheckBox.append("label").attr("class", "form-check-label").attr("for", (d,i) => `${i}`).text((d,i) => d.name)
             }
  )

  const bscCheckBoxes = document.querySelectorAll('.form-check-input.bscCheckBox');
  log('s:', bscCheckBoxes)
  bscCheckBoxes.forEach(r => r.addEventListener('change', (event) => {
    const boxesCheckedSelection = document.querySelectorAll('.form-check-input.bscCheckBox:checked')

    const bscBoxesChecked = Array.from(boxesCheckedSelection).map(x => x.id)
    data.selected=bscBoxesChecked
    log('data:', data)
    log('Boxes Checked:',bscBoxesChecked)
    data.boxes.map(b => {b.selected = bscBoxesChecked.includes(b.id) ? true : false})
    log('data:',data)

    log('boxesCheckedSelection:', boxesCheckedSelection)
    updateScoreCard(data);
    
  }
  ));
  
  return;
}

var selectedRelationStrength = 0;
function updateRelationStrengthSelection(data){
  log('updateRelationSelection data', data)
  var relationStrengthSelectDiv     = d3.select("#selectRelationStrengthDiv").data([null]);
  const relationStrengthSelectDivInputGroup = relationStrengthSelectDiv.append("div").attr("class", "input-group")
  relationStrengthSelectDivInputGroup.append("div").attr("class","input-group-prepend")
                          .append("label").attr("class", "input-group-text")
                          .attr("for", "selectRelationStrength").text("Relation Strength")

  const slider = relationStrengthSelectDivInputGroup.append('div');
  slider.append('label').attr('for','relationStrength').attr('class', 'form-label')
  slider.append('input').attr('type','range')
                        .attr('class', 'form-range').attr('min', '0')
                        .attr('max', '20')
                        .attr('step', "1")
                        .attr('id', 'selectRelationStrength')
  relationStrengthSelectDivInputGroup.append('div').attr('id', 'selectedRelationStrengthValue').text('0')


  const selectRelationStrength = document.querySelector('#selectRelationStrength');
  log('query selector relation strength', selectRelationStrength, )
  selectRelationStrength.addEventListener('change', (event) => {
    selectedRelationStrength     = +event.target.value;
    log('SelectedRelationStrength', selectedRelationStrength,)

    updateScoreCard(data);
    updateGoals(data);
  });

  const selectedRelationStrengthValue = document.querySelector('#selectRelationStrength');
  selectedRelationStrengthValue.addEventListener('change', (event) => {
    document.getElementById("selectedRelationStrengthValue").textContent = `${+event.target.value}`;
  });



  
  return;

}
