let StageIncrement = 0;
let TransitionDuration = 3000;
let StageCurrent = 0;
let selectMap = 'Ilionx';
let mapNodes, mapLinks, arrLinks;
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

const margin = { top: 10, right: 120, bottom: 100, left: 100 };
const width = 1000;
const height = 800;


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

svg
  .append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(xScaleAxis))
  .selectAll('text')
  .style('text-anchor', 'middle')
  .style('font-size', '10px')
  .attr('transform', 'rotate(0) translate(0, 0)');


const gMap = svg.append('g').attr('id', 'Map');
const gMapLinks = gMap.append('g').attr('class', 'MapLinks')
const gMapNodes = gMap.append('g').attr('class', 'MapNodes')

const yScaleAxis = d3.scaleBand()
  .domain(valuechain.map(d => d.name))
  .range([0, height])
  .padding(0)
  .paddingInner(0)
  .paddingOuter(0)
  .align(0);
svg
  .append('g')
  .call(d3.axisLeft(yScaleAxis));



promiseList.push(fetch(`data/Wardley.xlsx`).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 1, schema: SCHEMAS[0] }).then((resolve, reject) => { mapNodesUnfiltered = resolve.rows; })))
promiseList.push(fetch(`data/Wardley.xlsx`).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 2, schema: SCHEMAS[1] }).then((resolve, reject) => { mapLinksUnfiltered = resolve.rows; })))
Promise.all(promiseList)
  .then((resolve, reject) => {
    mapNodes = mapNodesUnfiltered//.filter(e => (e.Include=="Y" & e.Topic==selectedTopic & e.Exam==selectedExam))//.sort((a,b) => (a.Section - b.Section))
    mapLinks = mapLinksUnfiltered//.filter(e => (e.Include=="Y" & e.Topic==selectedTopic & e.Exam==selectedExam))//.sort((a,b) => (a.Section - b.Section))
    // console.log( mapLinks)     

    mapLinks.sort((a, b) => {
    return a.Name.localeCompare(b.Name) || a.Stage - b.Stage
    }
    )

    // [{name: name, source: source, target: target, stage: stage, evolution, visibility}]
    
    // [{name: name, source: source, target: target, stages: [number, evolution, visibility]}]

    let namePrev = '####';
    const namePrevEmpty = namePrev;
    arrLinks = []; 
    let record ={};
    let stages = [];

 
    mapLinks.map((row, i, arr)=> {

        
      if (namePrev !== namePrevEmpty ) 
      {
          if (namePrev !== row.Name) //Name changed => store record first, then begin a new record
          {    
              record.Stages = stages;
              arrLinks.push(record)

              record = {}
              stages = []
              record.Name = row.Name
              record.Source = row.Source
              record.Target = row.Target
              record.Size   = row.Size
              stages.push({ Stage: row.Stage, 
                            SourceVisibility  : row.SourceVisibility,  
                            SourceEvolution   : row.SourceEvolution,
                            TargetVisibility  : row.TargetVisibility, 
                            TargetEvolution   : row.TargetEvolution,
                          
                          })
          }
          else 
          {
              record.Name = row.Name
              stages.push({ Stage: row.Stage, 
                SourceVisibility  : row.SourceVisibility,  
                SourceEvolution   : row.SourceEvolution,
                TargetVisibility  : row.TargetVisibility, 
                TargetEvolution   : row.TargetEvolution,
              
              })
          }
      
          if (arr.length - 1 === i) // last row
          {
            record.Name = row.Name
            record.Size   = row.Size

            record.Source = row.Source
            record.Target = row.Target

            record.Stages = stages;
            arrLinks.push(record)
          }
      }
      else { //first row? => 
        record = {}
        stages = []
        record.Name = row.Name
        record.Size   = row.Size

        record.Source = row.Source
        record.Target = row.Target
        stages.push({ Stage: row.Stage, 
          SourceVisibility  : row.SourceVisibility,  
          SourceEvolution   : row.SourceEvolution,
          TargetVisibility  : row.TargetVisibility, 
          TargetEvolution   : row.TargetEvolution,
        
        })

      }
      namePrev = row.Name;
    })

    drawMap(0);
  })

function drawMap() {

  StageLast      = StageCurrent;
  StageCurrent   = StageCurrent + StageIncrement;  
  
  let line = d3.line();

  // const xScale = d3.scaleLinear().domain(d3.extent(mapNodes, d => d.Evolution)).range([margin.left, width]);
  const xScale = d3.scaleLinear().domain([0,100]).range([margin.left, width]);
  const yScale = d3.scaleLinear().domain([0,100]).range([height, margin.top]);
  
  gMapLinks.selectAll('path.line').data(arrLinks, d => { return d.Name })
    .join(
      enter => {
        // console.log('enter links', enter)
        enter.append('path')
          .attr('class', 'line')
          // .attr('id', d => d.Name)
          .attr('d', d => {
            // console.log('enter:', d)
            const p = [];
            p.push([xScale(d.Stages[StageCurrent].SourceEvolution), yScale(d.Stages[StageCurrent].SourceVisibility)]);
            p.push([xScale(d.Stages[StageCurrent].TargetEvolution), yScale(d.Stages[StageCurrent].TargetVisibility)]);
            const l = line(p);
            // console.log('enter l', l)
            return l
          }
          )
          .attr('stroke', 'lightblue')
          
      },
      update => {
        // console.log('update links', update);
        update
          .transition()
          .duration(TransitionDuration)
          .attrTween('d', d => {
            // console.log('update', d, update, update.attr('d'))
            const p = [];

            p.push([xScale(d.Stages[StageLast].SourceEvolution), yScale(d.Stages[StageLast].SourceVisibility)]);
            p.push([xScale(d.Stages[StageLast].TargetEvolution), yScale(d.Stages[StageLast].TargetVisibility)]);
            const previous = line(p);
            
            console.log(StageCurrent, d)
            const c = [];
            c.push([xScale(d.Stages[StageCurrent].SourceEvolution), yScale(d.Stages[StageCurrent].SourceVisibility)]);
            c.push([xScale(d.Stages[StageCurrent].TargetEvolution), yScale(d.Stages[StageCurrent].TargetVisibility)]);
            const current = line(c);
            // console.log(previous, current);
            return d3.interpolate(previous, current);
          })
     
      },
      exit => {
        // console.log('exit links')
        exit.remove()
      }
    )
  gMapNodes.selectAll('g.node').data(mapNodes.filter(n => {return n.Stage == StageCurrent}), d => d.Name)
    .join(
      enter => {
        // console.log('enter nodes')
        const gEnter = enter.append('g')
          .attr('class', 'node')
          .attr('id', d => d.Name)
          .attr('transform', d => `translate(${xScale(d.Evolution)},${yScale(d.Visibility)})`);
        gEnter.append('circle').attr('class', 'node').attr('id', d => d.Name).attr('r', d => d.Size).style("fill", "white");
        gEnter.append('text').text(d => d.Name).attr('class', 'nodeText').attr("dx", 5);

      },
      update => {
        // console.log('update nodes')
        update.transition().duration(TransitionDuration).attr('transform', d => `translate(${xScale(d.Evolution)},${yScale(d.Visibility)})`)
          .select('circle.node').style("fill", "white")
          .attr('r', d => d.Size)
      },
      exit => {
        // console.log('exit nodes');
        exit.remove()
      }

    )
}

