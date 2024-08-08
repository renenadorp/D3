const CONSTANTS = { canvas :     { width: 5000, height:4000},
                    data : {
                        FileName: 'Datamodel.xlsx'}, //'processInstance.xlsx'
                        // FileName: 'processInstance.xlsx'},
                        process:     { Node: {  Type: "Circle", CircleSize: 60, RectWidth: 100, RectHeight: 30, 
                                            Charge: {Strength: -80}, Label: {fontSize :10, fontWeight: 600 }}},
                    particle:    {
                        r:4,
                        interval: 7000,
                        duration: 1200
                        }
                }
const SCHEMAS  = 
[
//Sheet 1: Process Nodes
{
    'Id': {
    prop: 'Id',
    type: Number
    },        
    'Name': {
    prop: 'Name',
    type: String
    },
    'Label': {
    prop: 'Label',
    type: String,
    },
    'PosX': {
    prop: 'PosX',
    type: Number,
    },
    'PosY': {
    prop: 'PosY',
    type: String
    },
    'Visible': {
    prop: 'Visible',
    type: Boolean
    }				
},
//Sheet 2: Process Lines
{
    'Id': {
    prop: 'Id',
    type: Number
    },        
    'Name': {
    prop: 'Name',
    type: String
    },
    'Label': {
    prop: 'Label',
    type: String,
    },
    'Color': {
    prop: 'Color',
    type: String,
    },
    'From': {
        prop: 'From',
        type: String
        },    
    'To': {
            prop: 'To',
            type: String
            }
    ,
    'Visible': {
    prop: 'Visible',
    type: Boolean
    }
    ,
    'FromId': {
    prop: 'FromId',
    type: Number
    }				
    ,
    'ToId': {
    prop: 'ToId',
    type: Number
    }				
},
//Sheet 3: Instances
{
    'Id': {
        prop: 'Id',
        type: Number
        },        
    'pId': {
    prop: 'pId',
    type: Number
    },        
        'ts': {
    prop: 'ts',
    type: String
    },
    'processName': {
    prop: 'processName',
    type: String,
    },
    'FromId': {
        prop: 'FromId',
        type: Number,
        },
    'ToId': {
        prop: 'ToId',
        type: Number,
        },
    'From': {
    prop: 'From',
    type: String
    },
    'To': {
    prop: 'To',
    type: String
    }
    ,
    'Value': {
    prop: 'Value',
    type: Number
    }				
}
]
// const processDefinition =
// {   "nodes":
//     [
//         {
//             "name":"Start",
//             "label":"Start",
//             "coords": [390, 100],
//             "visible": true
//         },
//         {
//            "name":"Step1",
//            "label":"Step1",
//            "coords": [170, 300],
//            "visible": true

//        },
//        {
//           "name":"Step2",
//           "label":"Step2",
//           "coords": [300, 350],
//           "visible": true

//       },
//         {
//            "name":"Step10",
//            "label":"Step10",
//            "coords": [500, 300],
//            "visible": true

//        },
//        {
//           "name":"Step20",
//           "label":"Step20",
//           "coords": [700, 350],
//           "visible": true

//       },
//      {
//             "name":"End",
//             "label":"End",
//             "coords": [400, 600],
//             "visible": true

//         },
//     ]
//     ,
//     "lines": 
//     [
//         {
//             "name": "Line 1",
//             "label": "Line 1",
//             "color": "#2B8DBF",
//             "nodes": [
//                 {
//                     "from"  : "Start",
//                     "to"    : "Step1"
//                 },
//                 {
//                     "from"  : "Start",
//                     "to"    : "Step2"
//                 },
//                 {
//                     "from": "Step1",
//                     "to": "End",
//                 },
//                 {
//                     "from": "Step2",
//                     "to": "End",
//                 }
//                 ]
//         },
//         {
//             "name": "Line 2",
//             "label": "Line 2",
//             "color": "red",
//             "nodes": [
//                 {
//                     "from": "Start",
//                     "to": "Step10"
//                 },
//                 {
//                     "from": "Step10",
//                     "to": "Step20"
//                 },
//                 {
//                     "from": "Step20",
//                     "to": "End",
//                 }
//             ]
//         }
//     ]
// }


svg = d3.select('#viz').append('svg')
.attr("width" , CONSTANTS.canvas.width)
.attr("height", CONSTANTS.canvas.height);

let svgParticles;
let svgProcessNodes;
let svgProcessLines;

// console.log(d3.schemeSet3.slice(2,10))
var instanceColor = d3.scaleOrdinal().range(d3.schemeReds[9].slice(2,9)).domain([1, 10])
var nodeFillColor = d3.scaleOrdinal(d3.schemePastel2).domain(["BA", "BV", "IT"])


function nodeJitter(min=-10, max=10) {
    const MIN = min;
    const MAX = max;
    const minCeiled = Math.ceil(MIN);
    const maxFloored = Math.floor(MAX);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  }

function getNodeCoords(d, processDefinitionNodes, fromto, xy, jitter=true, log=false){
    
    const cx=+processDefinitionNodes.filter(n=> n.Name == d[fromto])[0]['x']  + (jitter ? nodeJitter():0); 
    const cy=+processDefinitionNodes.filter(n=> n.Name == d[fromto])[0]['y']  + (jitter ? nodeJitter():0); 
    // log ? console.log(processDefinitionNodes.filter(n=> n.Name == d[fromto])[0], processDefinitionNodes.filter(n=> n.Name == d[fromto])[0]['x']) : 1==1;
    return  xy=='x' ? cx : cy;
}
function play(data, p, processDefinition ) {
    console.log('play data:', data, p, processDefinition)
    svgParticles
        .selectAll('.Particle')
        .data(data,function(d) { return d.Id; })
        .join(
            enter => {
                
                enter
                    .append("circle")
                    .attr('class', 'Particle')
                    .attr('cx', d => getNodeCoords(d, processDefinition.nodes, 'From', 'x'))
                    .attr('cy', d => getNodeCoords(d, processDefinition.nodes, 'From', 'y'))
                    .transition().duration(1000)
                    .attr('r', d => d.Value)
                    .attr('opacity', 1)
                    .attr("stroke-width", .5)
                    .attr("fill",  d=> instanceColor(d.Id))
                    .attr("stroke","silver")
                    .transition().duration(CONSTANTS.particle.duration).delay((d,i) => i*40)
                    .attr('cx', (d,i) => getNodeCoords(d, processDefinition.nodes, 'To', 'x') )
                    .attr('cy', (d,i) => getNodeCoords(d, processDefinition.nodes, 'To', 'y') )

            },
            update => { 
                update 
                    .attr('cx', d => getNodeCoords(d, processDefinition.nodes, 'From', 'x'))
                    .attr('cy', d => getNodeCoords(d, processDefinition.nodes, 'From', 'y'))
                    .attr('opacity', 1)
                    .attr("stroke-width", .5)
                    .attr("fill", d=>instanceColor(d.Id))
                    .attr("stroke", "silver")
                    .transition().duration(CONSTANTS.particle.duration)//.ease(d3.easeCircleInOut(0.1))//.ease(d3.easeBounceOut)

                    .attr('cx', d => getNodeCoords(d, processDefinition.nodes, 'To', 'x') )
                    .attr('cy', d => getNodeCoords(d, processDefinition.nodes, 'To', 'y') )
            }
            ,
            exit => {exit.transition().duration(500).attr('r', 0).transition().duration(500).remove()}
            )       
                
    return svgParticles;
}        



function main() {
    let process = {definition: {"nodes": [], "lines": []}};

    
    fetch(CONSTANTS.data.FileName)
        .then(response => response.blob())
        .then(blob => 
            Promise.all ([
                readXlsxFile(blob, {sheet:1, schema: SCHEMAS[0] }).then((resolve, reject) => process.definition.nodes=resolve.rows),
                readXlsxFile(blob, {sheet:2, schema: SCHEMAS[1] }).then((resolve, reject) => process.definition.lines=resolve.rows),
                readXlsxFile(blob, {sheet:3, schema: SCHEMAS[2] }).then((resolve, reject) => process.instance=resolve.rows),
            ] )
            .then((rows ) => {
                // console.log(process.definition, process.instance)
            
            let maxValue = process.instance.reduce((acc, value) => {
                return (acc = acc > value.ts ? acc : value.ts);
            }, 0);

            //PROCESS DEFINITION            
            //--SVG Groups to ensure correct visibility
            svgProcessLines = svg.append('g');
            svgProcessNodes = svg.append('g');

           
            //--NODES: Setup force simulation to avoid overlap
            var simulation = d3.forceSimulation(process.definition.nodes)
            .force('charge', d3.forceManyBody().strength(CONSTANTS.process.Node.Charge.Strength))

            .force('center', d3.forceCenter(CONSTANTS.canvas.width / 2, CONSTANTS.canvas.height / 2))
            .on('tick', tickedRect);
            

            function tickedRect() {
                svgProcessNodes
                .selectAll('.gNode')
                .data(process.definition.nodes)
                .join(
                    enter => {
                        const gEnter = enter.append('g').attr('class', 'gNode')
                            .attr('transform', (d) => {return `translate (${d.x},${d.y})`});
                        gEnter.append('rect')
                            .attr('x', d => - (d.Label.length*4 ))
                            .attr('y', -(CONSTANTS.process.Node.RectHeight/3)*2 )
 
                            .attr('width', d => d.Label.length * 8)
                            .attr('height', CONSTANTS.process.Node.RectHeight)
                            .attr("stroke-width", 1)
                            .attr("fill", d => nodeFillColor(d.Label.slice(0,2)))
                            .transition().duration(4000)
                            .attr('r', CONSTANTS.process.Node.Size)
                            .attr('opacity', 1)
                            .attr("stroke", "silver")//d => instanceColor(d.Id))
                        gEnter.append('text').text(d=>d.Label).attr('text-anchor', 'middle')
                            .attr('dy', 0)
                            .attr('font-size', CONSTANTS.process.Node.Label.fontSize)
                            .attr('font-weight', CONSTANTS.process.Node.Label.fontWeight)
                    }
                    ,
                    update => {
                            const gUpdate = update
                                .attr('transform', (d) => {return `translate (${d.x},${d.y})`});
                    }
                )
            }

            function tickedCircle() {
                svgProcessNodes
                .selectAll('.gNode')
                .data(process.definition.nodes)
                .join(
                    enter => {
                        const gEnter = enter.append('g').attr('class', 'gNode')
                            .attr('transform', (d) => {return `translate (${d.x},${d.y})`});
                        gEnter.append('circle')
                            .attr('cx', 0)
                            .attr('cy', 0)
                            .attr("stroke-width", 4)
                            .attr("fill", "white")
                            .transition().duration(4000)
                            .attr('r', CONSTANTS.process.Node.CircleSize)
                            .attr('opacity', 1)
                            .attr("stroke", d => instanceColor(d.Id))
                        gEnter.append('text').text(d=>d.Label).attr('text-anchor', 'middle')
                            .attr('dy', -CONSTANTS.process.Node.CircleSize + (CONSTANTS.process.Node.Label.fontSize*2))
                            .attr('font-size', CONSTANTS.process.Node.Label.fontSize)
                            .attr('font-weight', CONSTANTS.process.Node.Label.fontWeight)
                    }
                    ,
                    update => {
                            const gUpdate = update
                                .attr('transform', (d) => {return `translate (${d.x},${d.y})`});
                    }
                )
            }
         
            function ticked() {
                svgProcessNodes
                .selectAll('circle')
                .data(process.definition.nodes)
                .join('circle')

                .attr('cx', function(d) {return d.x})
                            .attr('cy', function(d) {return d.y})
                            .attr("stroke-width", 4)
                            .attr("fill", "white")
                            .transition().duration(1000)
                            .attr('r', CONSTANTS.process.Node.Size)
                            .attr('opacity', 1)
                            .attr("stroke", d => instanceColor(d.Id));
            }
         
            //--LINES      
            //  Delay drawing the lines, bc we need to wait for the force simulation to finish.
            //  Probably a better way to do this, but I am not smart enough          
            var xs = 1;
            x =	d3.interval(() => {
                svgProcessLines.selectAll("line")
                .data(process.definition.lines)
                .join(
                    enter => {           
                        
                        const gEnter = enter.append('g');
    
                                    gEnter.append('line')
                                            .attr('x1', d=> getNodeCoords(d, process.definition.nodes, 'From', 'x', false, true))
                                            .attr('y1', d=> getNodeCoords(d, process.definition.nodes, 'From', 'y', false, true))
                                            .attr('x2', d=> getNodeCoords(d, process.definition.nodes, 'To', 'x', false, true))
                                            .attr('y2', d=> getNodeCoords(d, process.definition.nodes, 'To', 'y', false, true))
                                            .attr('stroke', (d,i) => {return "lightgrey"; return instanceColor(i)})
                                            .attr('stroke-width', 2)
                                            .attr('stroke-opacity', .2)
    
                        
                })

                if (xs >2) {xs=0;
                    x.stop()
                } 
                xs++

            }
            ,5000
            )

            var delay =6000;
            var ts = 1;
            svgParticles = svg.append('g').attr('id', 'gParticle')

            function playTimer() {

                play([process.instance.filter(r => r.ts == ts)][0], ts, process.definition)
                ts ++
                if (ts > maxValue) timer.stop();
                // delay = 5000;
            }

            var timer = d3.timer(playTimer, delay)
            //PROCESS INSTANCES (PARTICLES)
            var ts = 1;
            t =	d3.interval(() => {

                //play([process.instance.filter(r => r.ts == ts)][0], ts, process.definition)
                1==1;

                if (ts > maxValue) {ts=0;
                    // t.stop()
                } 
                ts++

            }
            ,CONSTANTS.particle.interval
            )



            })
 
            )

}



main();


