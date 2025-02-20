let selectedTopic   = 'DMBOK';
let selectedSource  = 'CourseSlides';
let selectedSection = 1;
let sectionQuestions;
let examFinished;
let minQuestionNumber, maxQuestionNumber, currentQuestionNumber;
let examAnswers = new Map();
let countAnswers = 0;

const themes = [
  {
    canvas   : {size: {width: 2000, height: 2000},
                margin: {top: 50, right: 0, bottom: 0, left: 50}
              },
    question : {box   : {width: 1500, height: 150, fill: "#293ea8", fillOpacity: 1}, 
                button: {fillActive: "#293ea8", fillInactive: "darkgrey", height: 45, width: 120, text : {fontsize: 20}},
                number: {circle: {r: 40, fill: "none", stroke: "white", strokeWidth: 2}, 
                         text:   {fontsize:35, fill: "white"}},
                text  : {fontsize: 20, lineheight:30, margin: {left: 140, right:10}},
                type  : {text  : {fontsize: 16, lineheight:30, margin: {left: 140, right:10}}},

                stats : {text: {fontsize: 16, fill: "darkgrey" }}

              },
   
  }];
const theme = themes[0];
const SCHEMAS =
  [
    //Sheet 1: Questions
        {

      'Id': {
        prop: 'Id',
        type: Number
      },
      'Include': {
        prop: 'Include',
        type: String
      },

      'Topic': {
        prop: 'Topic',
        type: String,
      }
      ,
      'Source': {
        prop: 'Source',
        type: String,
      }
      ,
      'Section': {
        prop: 'Section',
        type: String
      }

      ,
      'Number': {
        prop: 'Number',
        type: Number
      }
      ,
      'Question': {
        prop: 'Question',
        type: String
      }
      ,
      'QuestionType': {
        prop: 'QuestionType',
        type: String
      }
      ,
      'A': {
        prop: 'A',
        type: String
      }
      
      
      ,
      'B': {
        prop: 'B',
        type: String
      }
      
      ,
      'C': {
        prop: 'C',
        type: String
      }
      
      ,
      'D': {
        prop: 'D',
        type: String
      }
      
      ,
      'E': {
        prop: 'E',
        type: String
      }
      
      ,
      'F': {
        prop: 'F',
        type: String
      }
      ,
      'Answer': {
        prop: 'Answer',
        type: String
      }
      ,
      'Chapter': {
        prop: 'Chapter',
        type: String
      }
      ,
      'Explanation': {
        prop: 'Explanation',
        type: String
      }
      ,
      'QuestionNbr': {
        prop: 'QuestionNbr',
        type: String
      }
      
      ,
      'NumberOrg': {
        prop: 'NumberOrg',
        type: String
      }

      ,
      'SetOrg': {
        prop: 'SetOrg',
        type: String
      }


    }    

  ]

// TOOLTIP
d3.select('body').append('div').attr('id', 'ToolTip')
      .attr('style', 'position: absolute; opacity: 0; top: 104px; left: 300px');  

const svg = d3.select("#viz").append("svg")
  .attr("width"     , theme.canvas.size.width  - theme.canvas.margin.left - theme.canvas.margin.right)
  .attr("height"    , theme.canvas.size.height - theme.canvas.margin.top  - theme.canvas.margin.bottom)
  .attr('transform' , `translate (${theme.canvas.margin.left},${theme.canvas.margin.top})`)

const gControlButtons     = svg.append('g').attr('id','ControlButtons').attr("transform", `translate(${2},${2})`);
const gQuestion           = svg.append('g').attr('id','Question');
const gShowResultsButton  = svg.append('g').attr('id','SubmitExam').attr("transform", `translate(${2},${600})`);;
const gExamResults        = svg.append('g').attr('id','ExamResults').attr("transform", `translate(${2},${50})`);;

let data;

function main() {
  // console.log(selectedSection, selectedSource, selectedTopic)
  examAnswers = new Map();

  let questionsUnfiltered = {};

  let promiseList = [];
  /////////////////////////////////////////////////////////////
  // Data
  /////////////////////////////////////////////////////////////
  
  // promiseList.push(fetch(`data/dmbok.xlsx`).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 1, schema: SCHEMAS[0] }).then((resolve, reject) => { chaptersUnfiltered  = resolve.rows; })))
  // promiseList.push(fetch(`data/dmbok.xlsx`).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 2, schema: SCHEMAS[1] }).then((resolve, reject) => { sectionsUnfiltered  = resolve.rows; })))        
  promiseList.push(fetch(`data/Exam.xlsx`).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 1, schema: SCHEMAS[0] }).then((resolve, reject) => { questionsUnfiltered = resolve.rows; 
    // console.log('reject',reject, resolve)
  })))        
  Promise.all(promiseList)
    .then((resolve, reject) => {
      
      // const chapters = chaptersUnfiltered.filter(e => (e.Include=="Y")).sort((a,b) => (a.Section - b.Section))
      // const sections = sectionsUnfiltered.filter(e => (e.Include=="Y"))//.sort((a,b) => (a.Section - b.Section))
      // console.log(questionsUnfiltered)
      // console.log(selectedTopic, selectedSource, selectedSection)
      sectionQuestions = questionsUnfiltered.filter(e => ( e.Include=="Y"  
                                                        & e.Topic==selectedTopic 
                                                        & e.Source==selectedSource 
                                                        & e.Section==selectedSection
                                                        ))//.sort((a,b) => (a.Section - b.Section))
      // console.log(sectionQuestions, selectedTopic, selectedSource, selectedSection, questionsUnfiltered)

      // Get unique list of Exams
      const menu = [...new Set(sectionQuestions.map(item => item.Number))]; // [ 'A', 'B']
      // drawMenu(menu);


      minQuestionNumber = d3.min(sectionQuestions, d => d.Number);
      maxQuestionNumber = d3.max(sectionQuestions, d => d.Number);
      currentQuestionNumber = minQuestionNumber;
      drawScreen(); //Buttons, Question, Choices
  }
  )
}
function drawMenu(data){
  // console.log(data)

  svgMenu.selectAll('.menu').data(data)
    .join(
      enter => {
            const gEnter = enter.append('g').attr('id',(d,i) => `menuItem${d.Id}`).attr('transform', (d,i) => `translate(${5},${i*40 + 10})`);
            gEnter.append('rect')
              .attr('class', 'menuItem')
              .attr('x1', 0).attr('y1',0).attr('width', 300).attr('height', 30)
              .on("mouseover", function (e, d) {
                  d3.select(this).attr('class', "menuItemSelected")


                  ////////////////////////////////////////////
                  // Details Panel - Tooltip Div / HTML
                  ////////////////////////////////////////////
                  const selectedMenuItem = d["Chapter"]
                  var tooltip = d3.select('#ToolTip');
                  const tripDetailsTripId = chapters.filter(r => r.Chapter == d.Chapter)
                  let htmlList = "<div class='details'> ";
                  tripDetailsTripId.map(r => {
                    htmlList += `<div class='detailsTitle' style='max-width: 350px'>${r.Section}</div>`;
                    htmlList += `<div class='detailsDescr' style='max-width: 350px'>${r.Summary}</div>`;
                    }
                  )

                  htmlList += '</div>'
                  tooltip.transition().duration(1000).attr('style', 'position: absolute; opacity: 1; top: 104px; left: 450px');
                  tooltip.html(htmlList)

                })

                .on("mouseout", function (e, d) {
                  tooltip = d3.select('#ToolTip').attr("style", "opacity:0");
                  d3.select(this).attr('class', "menuItem")


                })
            

            gEnter.append('text').attr('class', 'menuItem').attr('x', (d,i) => 10).attr('y',20).text((d,i)=>`${d}`);
              
              
            const gEnterDetails =  gEnter.append('g').attr('transform', `translate(${280},${5})`).attr('class', "arrow-details");
            gEnterDetails
            .append('path').attr('d', 'M0 0 L10 10 L0 20 Z');        
          });
                
    
  return;
};
function drawScreen(action) {
  // console.log(examAnswers)
  if (action=='Next') currentQuestionNumber+=1;
  if (action=='Prev') currentQuestionNumber-=1;
  drawButtons();
  drawQuestion(currentQuestionNumber);


  // svg.append("svg:foreignObject")
  // .attr("width", 200)
  // .attr("height", 200);
  // .append("div")
  // .html("<span style='color:red'>Hello</span> <span
  // style='color:blue'>world</span>!");
  
  

}
function buttonMouseOver(){
    d3.select(this).attr("fill", theme.question.button.fillActive);//.attr("stroke-width", 2)
  
}
function buttonMouseOut(){
  d3.select(this).attr("fill", theme.question.button.fillInactive);//.attr("stroke-width", 0)
}
function buttonClick(e){
  // console.log(e)
  return;
}
function drawButtons(){
  // console.log('buttons',currentQuestionNumber, minQuestionNumber, maxQuestionNumber)

  gControlButtons.selectAll('g.button').remove()
  
  // Button Click Prev
  if (currentQuestionNumber > minQuestionNumber) {
      let gControlButtonPrev = gControlButtons.append('g').attr('class','button').attr('id','ButtonPrev')
      .on("click", () => drawScreen('Prev'));


      gControlButtonPrev.append('rect').attr('width', theme.question.button.width).attr('height',theme.question.button.height).attr("fill","darkgrey")
      .on("mouseover", buttonMouseOver)
      .on("mouseout", buttonMouseOut)
      ;
      gControlButtonPrev.append('text')
        .text('Prev')
        .attr('dy',theme.question.button.height/2 + theme.question.button.text.fontsize/4)
        .attr('dx',  theme.question.button.width/2).attr('text-anchor', 'middle')
  }
  // Button Click Next
  if (currentQuestionNumber < maxQuestionNumber) {
    let gControlButtonNext = gControlButtons.append('g')
      .attr('class','button').attr('id','ButtonNext').attr('transform',`translate(${theme.question.box.width - theme.question.button.width},${0})`)
      .on("click", () => drawScreen('Next'));

    gControlButtonNext.append('rect').attr('width', theme.question.button.width).attr('height',theme.question.button.height).attr("fill","darkgrey")
    .on("mouseover", buttonMouseOver)
    .on("mouseout", buttonMouseOut)
    gControlButtonNext.append('text') 
      .text('Next')
      .attr('dy',theme.question.button.height/2 + theme.question.button.text.fontsize/4)
      .attr('dx',  theme.question.button.width/2).attr('text-anchor', 'middle')
  }
    // Button Answer

}
function updateStats () {
  gControlButtons.selectAll('g.QuestionStats').remove();
  gQuestionStats = gControlButtons.append('g').attr('class','QuestionStats').attr('transform', `translate(${theme.question.box.width/2},${40})`)
  gQuestionStats.append('text').text(`Current Question: ${currentQuestionNumber}, Questions Answered: ${countAnswers}, Total Questions: ${maxQuestionNumber}`)
  .attr('text-anchor', "middle")
  .attr('font-style', "italic")
  .attr('fill', theme.question.stats.text.fill)
  .attr('font-size', theme.question.stats.text.fontsize)
}
function mouseOverRadioDot(e,d){
  // console.log(e,d)
  d3.select(`circle#${d[0]}`).attr("class","radioDot Selected")
  updateStats();

}
function mouseOutRadioDot(e,d){
  // console.log(e,d)
  const currentAnswer = examAnswers.get(currentQuestionNumber)

  if (d[0] == currentAnswer)  d3.select(`circle#${d[0]}`).attr("class","radioDot Selected")
  else d3.select(`circle#${d[0]}`).attr("class","radioDot Neutral")

}
function mouseClickRadioDot(e,d){
  // console.log(e,d, selectedChoice)
  const currentAnswer = examAnswers.get(currentQuestionNumber)
  if (examAnswers.get(currentQuestionNumber)== d[0])   {
    d3.select(`circle#${currentAnswer}`).attr("class","radioDot Neutral")
    examAnswers.set(currentQuestionNumber, undefined)
    //selectedChoice = undefined;

  }
  else  {
    d3.select(`circle#${d[0]}`).attr("class","radioDot Selected")
    d3.select(`circle#${currentAnswer}`).attr("class","radioDot Neutral")
    //selectedChoice = d[0]
    examAnswers.set(currentQuestionNumber, d[0])

  }
  // Count number of answers given
  countAnswers = 0;
  for (const [k, v] of examAnswers) {
    v ? countAnswers += 1: countAnswers+=0
  }
  // console.log(countAnswers, sectionQuestions.length)

  // console.log(sectionQuestions)
  if (countAnswers == sectionQuestions.length) 
  {
    examFinished = true;
    drawSubmitExam();
  }

  updateStats();
  return;
}
function setRadioDotClass(d){
  // console.log(currentQuestionNumber, d[0], examAnswers.get(currentQuestionNumber))
  if (examAnswers.get(currentQuestionNumber)==d[0]) return "radioDot Selected"
  return "radioDot Neutral"
}
function splitText(str,i){
  // str: string to be split, l: number of lines, i: current line
  // When line number = 1 the substring start position needs to become 0
  // When line number = 2 the substring start position needs to become box width / fontsize * 1

  const pixelsPerChar = theme.question.text.fontsize / 2; //Does not really make sense....
  const split = str.substring((i-1) * ((theme.question.box.width - theme.question.text.margin.left - theme.question.text.margin.right)/pixelsPerChar),(i * ((theme.question.box.width - theme.question.text.margin.left - theme.question.text.margin.right)/pixelsPerChar)));
  // console.log('split', split, str, l, i)
  return split;
}
function drawQuestion(questionNumber) {
  updateStats();
  const question = sectionQuestions.filter(r => r.Number==questionNumber);
  const choices = new Map();
  const options =['A', 'B', 'C','D','E','F','G']
  // console.log("question:",question)
  options.map(o => {
   if (question[0][o]) choices.set(o, question[0][o])
  })
  
  gQuestion.selectAll('g.Q').data(question)
  .join(
    enter => {
      let gEnter = enter.append('g').attr('transform',`translate(${0},${50})`).attr('class', 'Q');
      gEnter.append('rect').attr('x', 0).attr('y', 0).attr('width', theme.question.box.width).attr('height', theme.question.box.height).attr('rx', 10).attr("fill", theme.question.box.fill).attr("fill-opacity", theme.question.box.fillOpacity);
 
      const gQuestionType = gEnter.append('g').attr('class', 'gQuestionType').attr('transform',`translate(${theme.question.box.width - 160},${10})`)
      gQuestionType.append('rect').attr('x', 0).attr('y', 0).attr('width', 150).attr('height', 40).attr('rx', 10).attr("fill", "#2D3135").attr("fill-opacity", 0.3).attr("stroke", "#789CBD").attr("stroke-width", 2);
      gQuestionType.append('text').text(d => d.QuestionType).attr('x', 20).attr('y', 25).attr('font-size', theme.question.type.text.fontsize);

      gEnter.append('line').attr('x1', (theme.question.number.circle.r * 2) + 30).attr('y1', 0).attr('x2', (theme.question.number.circle.r * 2) + 30).attr('y2', theme.question.box.height).attr('stroke', 'white').attr('stroke-width', 2)
      gEnter.append('circle').attr('class','number').attr('cx', theme.question.number.circle.r + 15).attr('cy',theme.question.box.height/2).attr('r', theme.question.number.circle.r).attr('stroke','white').attr('stroke-width', 2).attr('fill','none')
      gEnter.append('text').attr('class','number').text(d => d.Number).attr('x', theme.question.number.circle.r + 15).attr('y', theme.question.box.height/2 + theme.question.number.text.fontsize / 3).attr('font-size', theme.question.number.text.fontsize).attr('font-weight', 1000).attr('text-anchor','middle')

      const gEnterText =gEnter.append('text')
      gEnterText.append('tspan').attr("class","line1").text(d =>splitText(d.Question, 1)).attr('x', theme.question.text.margin.left).attr('y', 1*theme.question.text.lineheight + 10).attr("fill-opacity", 0).attr('font-size', theme.question.text.fontsize).transition().duration(1000).attr("fill-opacity",1);;
      gEnterText.append('tspan').attr("class","line2").text(d =>splitText(d.Question, 2)).attr('x', theme.question.text.margin.left).attr('y', 2*theme.question.text.lineheight + 10).attr("fill-opacity", 0).attr('font-size', theme.question.text.fontsize).transition().duration(1000).attr("fill-opacity",1);;
      gEnterText.append('tspan').attr("class","line3").text(d =>splitText(d.Question, 3)).attr('x', theme.question.text.margin.left).attr('y', 3*theme.question.text.lineheight + 10).attr("fill-opacity", 0).attr('font-size', theme.question.text.fontsize).transition().duration(1000).attr("fill-opacity",1);;
      gEnterText.append('tspan').attr("class","line4").text(d =>splitText(d.Question, 4)).attr('x', theme.question.text.margin.left).attr('y', 4*theme.question.text.lineheight + 10).attr("fill-opacity", 0).attr('font-size', theme.question.text.fontsize).transition().duration(1000).attr("fill-opacity",1);;

    },
    update => {
      // console.log('update')
      // update.append('rect').attr('x', 0).attr('y', 0).attr('width', 900).attr('height', 100).attr('rx', 10);
      // update.append('text').text(d => d.Question).attr('class', 'Q').attr('dx', 40).attr('dy', 40);
   
      // update.select("tspan.line2").text(d => `${d.Question.substring(20,30)}`).attr('x', 40).attr('y', 70).attr("fill-opacity", 0).transition().duration(1000).attr("fill-opacity",1);
      update.select('.gQuestionType').select('text').text(d => d.QuestionType)
      update.select("text.number").text(d =>d.Number);
      update.select("tspan.line1").text(d =>splitText(d.Question, 1)).attr('x', theme.question.text.margin.left).attr('y', 1*theme.question.text.lineheight+ 10).attr("fill-opacity", 0).attr('font-size', theme.question.text.fontsize).transition().duration(1000).attr("fill-opacity",1);;
      update.select("tspan.line2").text(d =>splitText(d.Question, 2)).attr('x', theme.question.text.margin.left).attr('y', 2*theme.question.text.lineheight+ 10).attr("fill-opacity", 0).attr('font-size', theme.question.text.fontsize).transition().duration(1000).attr("fill-opacity",1);;
      update.select("tspan.line3").text(d =>splitText(d.Question, 3)).attr('x', theme.question.text.margin.left).attr('y', 3*theme.question.text.lineheight+ 10).attr("fill-opacity", 0).attr('font-size', theme.question.text.fontsize).transition().duration(1000).attr("fill-opacity",1);;
      update.select("tspan.line4").text(d =>splitText(d.Question, 4)).attr('x', theme.question.text.margin.left).attr('y', 4*theme.question.text.lineheight+ 10).attr("fill-opacity", 0).attr('font-size', theme.question.text.fontsize).transition().duration(1000).attr("fill-opacity",1);;

    },
    exit => {
      // console.log('remove')
      // exit.transition().duration(2000).remove()
    }

  )

  gQuestion.selectAll('g.C').data(choices)
  .join(
    enter => {
      // console.log('enter')
      let gEnter = enter.append('g').attr('transform',(d,i)=>`translate(${0},${i* 50 +200})`).attr('class', 'C');
      // gEnter.append('rect').attr('x', 0).attr('y', 0).attr('width', 900).attr('height', 100).attr('rx', 10);
      gEnter.append("circle").attr("cx", 25).attr("cy", 30).attr("r",13).attr("class","radioOutline")
      gEnter.append("circle").attr("cx", 25).attr("cy", 30).attr("r",8).attr("class", d => setRadioDotClass(d)).attr("id",d=>d[0])
        .on("mouseover", mouseOverRadioDot)
        .on("mouseout", mouseOutRadioDot)
        .on("click", mouseClickRadioDot)
      gEnter.append('text').text(d => `${d[0]}. ${d[1]}`).attr('dx', 50).attr('dy', 40).attr('font-size', theme.question.text.fontsize);

    },
    update => {
      // console.log('update')
      // update.append('rect').attr('x', 0).attr('y', 0).attr('width', 900).attr('height', 100).attr('rx', 10);
      // update.append('text').text(d => d.Question).attr('class', 'Q').attr('dx', 40).attr('dy', 40);
      update.select("text").text(d => { return `${d[0]}. ${d[1]}`;}).attr('dx', 50).attr('dy', 40).attr("fill-opacity", 0).transition().duration(1000).attr("fill-opacity",1).attr('font-size', theme.question.text.fontsize);
      
      
      update.select("circle.radioDot").attr("cx", 25).attr("cy", 30).attr("r",8).attr("class",d => setRadioDotClass(d))
      update.select("circle").attr("cx", 25).attr("cy", 30).attr("r",13).attr("class","radioOutline")

    },
    exit => {
      // console.log('remove')
      exit.remove();
      // exit.selectAll("text").remove();
    }


  )



  return;
}

function drawSubmitExam(){
  console.log('drawSubmitExam')
  const gSubmitButton = gShowResultsButton.append('g').attr('class','button');
  gSubmitButton
    .append("rect")
    .attr("width", theme.question.button.width)
    .attr("height", theme.question.button.height)
    .attr("fill", theme.question.button.fillActive)
    .on("click", showResults);


  gSubmitButton
    .append('text').text('Results')
    .attr('y',theme.question.button.height/2 + theme.question.button.text.fontsize/2).attr('x', theme.question.button.width/2).attr('text-anchor', 'middle')
  return;
}
function showResults() {
  console.log(examAnswers, sectionQuestions)
  d3.select('g#ControlButtons').remove();
  d3.select('g#Question').remove();
  d3.select('g#SubmitExam').remove();

  const gExamResultsList= gExamResults.append('g').attr("id","ExamResultsList");
  gExamResultsList.selectAll('.examResultHeader').data(['Nr','Answer', 'Your Answer'])
    .join(
      enter => {
        enter.append('text').text(d => d).attr('x', (d,i)=>i*150).attr('y', 10).attr('font-weight', 900)
      },
      update => {},
      exit => {},
      
    )
    gExamResultsList.append('line')
    .attr("x1", 0)
    .attr("y1", theme.question.text.lineheight  /2      )
    .attr("x2", 1000)
    .attr("y2", theme.question.text.lineheight    /2    )
    .attr("class","ExamResult");
    gExamResultsList.append('line')
    .attr("x1", 0)
    .attr("y1", (theme.question.text.lineheight  /2) + 2      )
    .attr("x2", 1000)
    .attr("y2", (theme.question.text.lineheight    /2 ) +2   )
    .attr("class","ExamResult");

  gExamResultsList.selectAll('.examResult').data(sectionQuestions)
  .join(
    enter => {
      const gEnter = enter.append('g').attr('transform', `translate(${0},${50})`);
      // console.log(examAnswers.get(1))
      theme.question.text.lineheight
      gEnter.append('line')
        .attr("x1", 0)
        .attr("y1", (d,i) => i*      theme.question.text.lineheight        )
        .attr("x2", 1000)
        .attr("y2", (d,i) => i*      theme.question.text.lineheight        )
        .attr("class","ExamResult");
        gEnter.append('text').text((d,i) => `${d.Number}.`).attr("x",  0).attr("y", (d,i)=>i*theme.question.text.lineheight -5).attr("class", "ExamResult")
        gEnter.append('text').text((d,i) => `${d.Answer?d.Answer:""}` ).attr("x", 150).attr("y", (d,i)=>i*theme.question.text.lineheight -5).attr("class", "ExamResult")
        // gEnter.append('text').text((d,i) => examAnswers.get(d.Number) ).attr("x",      theme.question.text.lineheight  ).attr("y", (d,i)=>i*theme.question.text.lineheight -5).attr("class", "ExamResult")
        gEnter.append('text').text((d,i) => `${examAnswers.get(d.Number)?examAnswers.get(d.Number):"?"} => ${examAnswers.get(d.Number)==d.Answer ? "Correct":"Incorrect"} `).attr("x",300).attr("y", (d,i)=>i*theme.question.text.lineheight -5).attr("class", "ExamResult")

    },
    update => {},
    exit => {}

  )

}

main();





