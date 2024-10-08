let StageIncrement = 0;
let transition = {duration: {normal: 2000, short: 1000, tiny: 500, long: 4000}}

let StageCurrent = 0;
let selectMap = 'Ilionx';
let mapNodes, mapLinks, mapSizeStoryLines;
let promiseList = [];

const SCHEMAS =
  [
    //Sheet 1: Nodes
    //id	NodeType	Description	Visibility	Evolution
    {

      'Id': {
        prop: 'Id',
        type: String
      },
      'Name': {
        prop: 'Name',
        type: String
      },
      'Map': {
        prop: 'Map',
        type: String
      },
      'Stage': {
        prop: 'Stage',
        type: Number
      },
      
      'NodeType': {
        prop: 'NodeType',
        type: String,
      }
      ,
      
      'Existing': {
        prop: 'Existing',
        type: String,
      }
      ,
      
      'Description': {
        prop: 'Description',
        type: String,
      }
      ,
      'Size': {
        prop: 'Size',
        type: Number
      },
      'Visibility': {
        prop: 'Visibility',
        type: Number
      }
      ,
      'Evolution': {
        prop: 'Evolution',
        type: Number
      }
      ,
      'SizePrev': {
        prop: 'SizePrev',
        type: Number
      },
      'VisibilityPrev': {
        prop: 'VisibilityPrev',
        type: Number
      }
      ,
      'EvolutionPrev': {
        prop: 'EvolutionPrev',
        type: Number
      }
      ,
      'SizeNext': {
        prop: 'SizeNext',
        type: Number
      },
      'VisibilityNext': {
        prop: 'VisibilityNext',
        type: Number
      }
      ,
      'EvolutionNext': {
        prop: 'EvolutionNext',
        type: Number
      }

    }
    ,
    //Sheet 2: Links
    {
      'Name': {
        prop: 'Name',
        type: String
      },
      'Source': {
        prop: 'Source',
        type: String
      },
      'Target': {
        prop: 'Target',
        type: String
      },
      'Descr': {
        prop: 'Descr',
        type: String
      },

      'Map': {
        prop: 'Map',
        type: String
      },

      'Stage': {
        prop: 'Stage',
        type: Number
      },

      'Size': {
        prop: 'Size',
        type: Number
      },

      'SourceVisibility': {
        prop: 'SourceVisibility',
        type: Number
      },

      'SourceEvolution': {
        prop: 'SourceEvolution',
        type: Number
      },

      'TargetVisibility': {
        prop: 'TargetVisibility',
        type: Number
      },

      'TargetEvolution': {
        prop: 'TargetEvolution',
        type: Number
      },



      'SourceVisibilityPrev': {
        prop: 'SourceVisibilityPrev',
        type: Number
      },

      'SourceEvolutionPrev': {
        prop: 'SourceEvolutionPrev',
        type: Number
      },

      'TargetVisibilityPrev': {
        prop: 'TargetVisibilityPrev',
        type: Number
      },

      'TargetEvolutionPrev': {
        prop: 'TargetEvolutionPrev',
        type: Number
      },



      'SourceVisibilityNext': {
        prop: 'SourceVisibilityNext',
        type: Number
      },

      'SourceEvolutionNext': {
        prop: 'SourceEvolutionNext',
        type: Number
      },

      'TargetVisibilityNext': {
        prop: 'TargetVisibilityNext',
        type: Number
      },

      'TargetEvolutionNext': {
        prop: 'TargetEvolutionNext',
        type: Number
      },



    }
    ,
    //Sheet 3: Story
    {
      'Stage': {
        prop: 'Stage',
        type: Number
      },
      'Paragraph': {
        prop: 'Paragraph',
        type: Number
      }
      ,
      'Sort': {
        prop: 'Sort',
        type: Number
      },
      'LineType': {
        prop: 'LineType',
        type: String
      }
      ,
      'StoryLine': {
        prop: 'StoryLine',
        type: String
      },



    }


  ]
const evolution = [
  { name: 'Genesis' },
  { name: 'Self Built' },
  { name: 'Product' },
  { name: 'Commodity' },
];
const valuechain = [

  { name: 'Visible' },
  { name: 'Invisible' },

];

const margin = { top: 40, right: 120, bottom: 100, left: 100 };
const marginStory = { top: 30, right: 120, bottom: 100, left: 10 };

const width = 600;
const height = 600;


const svgStory = d3.select('#story')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${marginStory.left}, ${marginStory.top})`);

const svg = d3.select('#viz')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

  
const xScaleAxis = d3.scaleBand()
  .domain(evolution.map(d => d.name))
  .range([0, width])
  .padding(0)
  .paddingInner(0)
  .paddingOuter(0)
  .align(0)
  ;
  
  const gMap      = svg.append('g').attr('id', 'Map');
  const gMapLinks = gMap.append('g').attr('class', 'MapLinks')
  const gMapNodes = gMap.append('g').attr('class', 'MapNodes')
  const gMapTransitions = gMap.append('g').attr('class', 'MapTransitions')
  
  const gStory = svgStory.append('g').attr('id', 'Story');
  
  const yScaleAxis = d3.scaleBand()
    .domain(valuechain.map(d => d.name))
    .range([0, height])
    .padding(0)
    .paddingInner(0)
    .paddingOuter(0)
    .align(0);
  
  const xAxis = d3.axisBottom(xScaleAxis)
  const yAxis = d3.axisLeft(yScaleAxis)

  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left / 2)
      .attr("x", - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Value Chain")
      .attr('class', 'axisLabel')
      ;    
  

  svg.append("text")
      .attr("transform", "rotate(0)")
      .attr("y", height + margin.bottom/3)
      .attr("x",(width / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr('class', 'axisLabel')
      .text("Evolution")
      ;    
  
  svg
    .append('g')
    .call(yAxis);
  
    svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'middle')
    .style('font-size', '10px')
    .attr('transform', 'rotate(0) translate(0, 0)');
    
    

promiseList.push(fetch(`data/Wardley.xlsx`).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 1, schema: SCHEMAS[0] }).then((resolve, reject) => { mapNodesUnfiltered = resolve.rows; })))
promiseList.push(fetch(`data/Wardley.xlsx`).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 2, schema: SCHEMAS[1] }).then((resolve, reject) => { mapLinksUnfiltered = resolve.rows; })))
promiseList.push(fetch(`data/Wardley.xlsx`).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 3, schema: SCHEMAS[2] }).then((resolve, reject) => { mapStoryUnfiltered = resolve.rows; })))
Promise.all(promiseList)
  .then((resolve, reject) => {
    mapNodes = mapNodesUnfiltered//.filter(e => (e.Include=="Y" & e.Topic==selectedTopic & e.Exam==selectedExam))//.sort((a,b) => (a.Section - b.Section))
    mapLinks = mapLinksUnfiltered//.filter(e => (e.Include=="Y" & e.Topic==selectedTopic & e.Exam==selectedExam))//.sort((a,b) => (a.Section - b.Section))
    mapStory = mapStoryUnfiltered//.filter(e => (e.Include=="Y" & e.Topic==selectedTopic & e.Exam==selectedExam))//.sort((a,b) => (a.Section - b.Section))
    // console.log( mapStoryUnfiltered)     

    mapLinks.sort((a, b) => {
      return a.Name.localeCompare(b.Name) || a.Stage - b.Stage
    }
    )
 
    drawMap(StageCurrent);
  })

function drawMap() {

  StageLast      = StageCurrent;
  StageCurrent   = StageCurrent + StageIncrement;  

  const divCurrentStage = d3.select('div#StageCurrent');
  divCurrentStage.select('p#StageCurrent').remove();
  divCurrentStage.append('p').attr('id', 'StageCurrent').html(`Stage: ${StageCurrent}`)

  const mapLinksStage      = mapLinks.filter(r => r.Stage==StageCurrent)
  const mapNodesStage      = mapNodes.filter(r => r.Stage==StageCurrent)
  const mapStoryStage      = mapStory.filter(r => r.Stage==StageCurrent)
  const mapNodesTransitionStage  = mapNodes.filter(r => r.Stage==StageCurrent && r.EvolutionPrev && r.VisibilityPrev && ( r.Evolution !== r.EvolutionPrev || r.Visibility !== r.VisibilityPrev))

  console.log('mapNodesTransition', mapNodesTransitionStage, mapNodesStage)
  
  let line = d3.line();

  // const xScale = d3.scaleLinear().domain(d3.extent(mapNodes, d => d.Evolution)).range([margin.left, width]);
  const xScale = d3.scaleLinear().domain([0,100]).range([margin.left, width]);
  const yScale = d3.scaleLinear().domain([0,100]).range([height, margin.top]);
  
  gMapLinks.selectAll('path.line').data(mapLinksStage, d => { return d.Name })
    .join(
      enter => {
        // console.log('enter links', enter)
        enter.append('path')
          .attr('class','line')
          // .attr('id', d => d.Name)
          .attr('d', d => {
            // console.log('enter:', d)
            const p = [];
            p.push([xScale(d.SourceEvolution), yScale(d.SourceVisibility)]);
            p.push([xScale(d.TargetEvolution), yScale(d.TargetVisibility)]);
            const l = line(p);
            // console.log('enter l', l)
            return l
          }
          )
          .transition().duration(transition.duration.normal).style('stroke-opacity',1)
          
      },
      update => {
        // console.log('update links', update);
        let previous, current;
        update
          .transition()
          .duration(transition.duration.normal)
          .attrTween('d', d => {
            // console.log('update', d, update, update.attr('d'))
            const p = [];

            p.push([xScale(d.SourceEvolutionPrev), yScale(d.SourceVisibilityPrev)]);
            p.push([xScale(d.TargetEvolutionPrev), yScale(d.TargetVisibilityPrev)]);
            previous = line(p);
            
            // console.log(StageCurrent, d)
            const c = [];
            c.push([xScale(d.SourceEvolution), yScale(d.SourceVisibility)]);
            c.push([xScale(d.TargetEvolution), yScale(d.TargetVisibility)]);
            current = line(c);
            // console.log(previous, current);
            return d3.interpolate(previous, current);
          });

     
      },
      exit => {
        // console.log('exit links')
        exit.remove()
      }
    )
  gMapNodes.selectAll('g.node').data(mapNodesStage.filter(n => {return n.Stage == StageCurrent}), d => d.Name)
    .join(
      enter => {
        // console.log('enter nodes')
        const gEnter = enter.append('g')
          .attr('class', 'node')
          .attr('id', d => d.Name)
          .attr('transform', d => `translate(${xScale(d.Evolution)},${yScale(d.Visibility)})`)
          ;

        gEnter.append('circle').attr('class', 'node').attr('id', d => d.Name).attr('r', d => d.Size).style('opacity',0)
          .transition().duration(transition.duration.normal).style('opacity',1)
        ;
        gEnter.append('text').text(d => d.Name).attr('class', 'node').attr('text-anchor', 'middle').style('opacity',0)
        .transition().duration(transition.duration.normal).style('opacity',1)
              .attr('dy', d => -d.Size);

      },
      update => {
        // console.log('update nodes')
        const gUpdate = update.transition().duration(transition.duration.normal)
          .attr('transform', d => {
            return `translate(${xScale(d.Evolution)},${yScale(d.Visibility)})`});
            gUpdate
            .select('circle.node')
            .attr('r', d => d.Size)
            ;
  
            gUpdate
            .select('text.node')
            .attr('dy', d => -d.Size);
            ;
  
    
      },
      exit => {
        // console.log('exit nodes');
        exit.remove()
      }

    );

  // console.log(mapStoryStage)
  gStory.selectAll('g.Story').data(mapStoryStage, d => d.Stage)
      .join(
        enter => {
          // console.log('enter')
          const gEnter =enter.append('g').attr('class','Story')
          gEnter.append('text').attr('y',  (d,i) => i*30).text(d => d.StoryLine).attr('class', d => d.LineType)
        },
        update => {
          update.selectAll('text').remove()
        },
        exit => {exit.remove()}
      )



  gMapTransitions.selectAll('g.transition').data(mapNodesTransitionStage, d => d.Name + d.EvolutionPrev + d.Evolution + d.VisibilityPrev + d.Visibility)
  .join(
    enter => {
      const gEnter = enter.append('g')
          .attr('class', 'transition')
          .attr('id', d => d.Name + d.EvolutionPrev + d.Evolution + d.VisibilityPrev + d.Visibility)
          // .attr('transform', d => `translate(${xScale(d.Evolution)},${yScale(d.Visibility)})`)
          ;

        gEnter.append('line').attr('class', 'transition')
        .attr('x1', d => xScale(d.Evolution))
        .attr('y1', d => yScale(d.Visibility))
        .attr('x2', d => xScale(d.EvolutionPrev))
        .attr('y2', d => yScale(d.VisibilityPrev))
        .style('opacity',0)
        .transition().duration(transition.duration.tiny).style('opacity',.5)
        .transition().duration(transition.duration.long).style('opacity',0)

      gEnter.append('g').attr('class', "transition")
       //https://www.guidodiepen.nl/2018/07/wrapping-my-head-around-d3-rotation-transitions/
      .attr('transform', d=>{ 
        
        const p1 = {x: xScale(d.EvolutionPrev), y: yScale(d.VisibilityPrev) }
        const p2 = {x: xScale(d.Evolution), y: yScale(d.Visibility) }
        let angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        // angle in degrees
        let angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
        console.log('angleDeg', angleDeg)
        return `translate(${xScale(d.Evolution)},${yScale(d.Visibility)}) rotate(${angleDeg}, 0,0)`})
        // .append('path').attr('d', 'M0 0 L10 10 L0 20 Z')
        .append('path').attr('d', 'M0 -10 L0 0 L0 10 L10 0 L0 -10 Z')
         
          .attr('opacity',0)
          .attr('class', 'transition')
          .transition().duration(transition.duration.tiny).style('opacity',.5)          
          .transition().duration(transition.duration.long).style('opacity',0)


        ;
    },
    update => {
      // console.log('update')
      update.selectAll('g.transition').remove()
    },
    exit => {exit.remove()}
  );

}
