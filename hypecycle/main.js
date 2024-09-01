
const CONST = { canvas : { width : 2548 , height : 2343,
                            margin : { top   : 0, right: 100, bottom:580, left:95}, //margin settings for Axes
                            graph  : { shift : {left: 100, top: 290},
                                        labels: {title: "Hype Cycle for Emerging Tech, 2022",
                                            xAxisLabel: "Time",
                                            yAxisLabel: "Expectations",
                                        },
                                        buttons : {animate:{width : 200, height: 50}},
                                        phases : [620, 910, 1330,1840]
                                    }
                        },

                        data   : {
                            FileName: 'Datamodel.xlsx'}, 
                        process:     { Node: {  Type: "Circle", CircleSize: 60, RectWidth: 100, RectHeight: 30, 
                                        Charge: {Strength: -80}, Label: {fontSize :10, fontWeight: 600 }}},
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

var x, y; document.onmousemove=(e)=>{x=e.clientX;y=e.clientY;}

// The svg canvas contains the graph (including Axes and Title) and the area outside of the graph (for the legend, and other elements)

const svgCanvas = d3.select("#viz").append("svg")
  					.attr("width" , CONST.canvas.width)
  					.attr("height", CONST.canvas.height)
                      .attr("transform",  `scale(${1})`);
const svg = svgCanvas.append("g")
  					.attr("transform", `translate(${CONST.canvas.margin.left}, ${CONST.canvas.margin.top})`)
svgCanvas.append('text').text(CONST.canvas.graph.labels.title)
    .attr('x', 100)
    .attr('y',200)
    .attr('class', 'GraphTitle')


// Set Graph constants
let W = CONST.canvas.width  - CONST.canvas.margin.left - CONST.canvas.margin.right
let H = CONST.canvas.height - CONST.canvas.margin.top  - CONST.canvas.margin.bottom

colorScale = d3.scaleThreshold()
.domain([2, 5, 10, 100000])
.range([  
     "white"
    ,"#179ad7"
    ,"#3a3a3a"
    ,"#f05623"
])
  

let pathHypeCycleCurve = d3.path();
function drawHypeCycleCurve(points) {

    points.forEach(p => {
        // console.log(p);
        let P1 ={} 
        P1.x= p.p1.x - CONST.canvas.graph.shift.left
        P1.y = p.p1.y
        let P2 ={} 
        P2.x= p.p2.x - CONST.canvas.graph.shift.left
        P2.y = p.p2.y

        CP ={}
        CP.x = p.cp.x - CONST.canvas.graph.shift.left
        CP.y = p.cp.y

        pathHypeCycleCurve.moveTo(P1.x, P1.y);
        pathHypeCycleCurve.quadraticCurveTo(CP.x, CP.y, P2.x, P2.y);

        
    });
	

    // Progress Phases
    _x = d3.scaleLinear().domain([0, W]).range([CONST.canvas.margin.left, W]);
    _y = d3.scaleLinear().range([0, H]);

  
    // _y.domain([-1, d3.max(data, function (d) {
    //   return d.Value;
    //   }) + 2]);      

    yAxis = svg.append("g").attr("class", "y-axis")
        .attr("transform", `translate(${80},${0})`);
    yAxis
        .call(d3.axisLeft(_y)
        .tickValues([])
        )  
    yAxis.select(".domain")
        .attr("stroke","black")
        .attr("stroke-width","6")
        .attr("opacity","0") 
    yAxis.append('text')
        .attr('class', 'AxisLabel')
        .attr('y', -20)
        .attr('x', -H/2 + 80)
        .text(CONST.canvas.graph.labels.yAxisLabel)
        .attr("transform", "rotate(-90)")


    xAxis = svg.append("g").attr("class", "x-axis")
        .attr("transform", `translate(0,${H})`);
    
    xAxis
        .call(d3.axisBottom(_x)
        .tickSize(-H+CONST.canvas.graph.shift.top)   
        .tickValues(CONST.canvas.graph.phases)
    )
    xAxis.select(".domain")
        .attr("stroke","black")
        .attr("stroke-width","6")
        .attr("opacity","1")
    xAxis.selectAll("text") 
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .style("fill", "None")
        .attr("transform", "rotate(-90)")
      
        ;
           
    xAxis.append('text')
        .attr('class', 'AxisLabel')
        .attr('y', 90)
        .attr('x', W/2 + 70 )
        .text(CONST.canvas.graph.labels.xAxisLabel)
    
    
    svg.append('path')
        .attr('d', pathHypeCycleCurve)
        .attr('id', 'HypeCycleCurve')


    buttonAnimate = svg.append("g").attr("class", "button")
        .attr("transform", `translate(${W - 305},${H +20})`);
        buttonAnimate.append('rect')
        .attr('width', CONST.canvas.graph.buttons.animate.width )
        .attr('height', CONST.canvas.graph.buttons.animate.height)
        .attr('class', 'button')
        .attr('rx', 10)
        .attr('ry', 10)

    buttonAnimate.append('text')
        .attr('x', CONST.canvas.graph.buttons.animate.width / 2)
        .attr('y', CONST.canvas.graph.buttons.animate.height / 2)
        .text('Animate')
        .attr('class', 'button')
        .attr('dy', 10)
        .on("click", animateHypeCycleCurve)




	return svg.node();
	
}
function drawHypeCycleLegend() {
    let svgLegend=svg.append('g').attr('id', 'Legend').attr('transform', `translate(${110},${H+100})`)
    svgLegend.append('text').text('Plateau will be reached:').attr('class', 'Legend')
    colorScale.domain().map((d,i) =>
    {
        let svgLegendElement = svgLegend.append('g')
        svgLegendElement.append('circle').attr('r', 20)
            .attr('cx', i * 360 + 20)
            .attr('cy', 70)
            .attr('fill',  colorScale(d-0.00000001))
            .attr('stroke', 'grey')
            .attr('stroke-width', 1);
        svgLegendElement.append('text')
            .attr('x', i * 360 + 50)
            .attr('y', 80)
            .text(`<=${d} years`)
            .attr('stroke', 'grey')
            .attr('stroke-width', 1)
            .attr('class', 'Legend')
    }
    )

}
function animateHypeCycleCurve() {
    let nodeHypeCycleCurve = d3.select('#HypeCycleCurve').node()
    function translateAlong(path) {
        const length = path.getTotalLength();
        return function() {
          return function(t) {
            const {x, y} = path.getPointAtLength(t * length);
            return `translate(${x},${y})`;
          }
        }
      }
    function getPoint(path, l, t) {
        point = path.getPointAtLength(t * l)
        //console.log(point)
        return point
    };

     

	var l = nodeHypeCycleCurve.getTotalLength();
    var t=0;
	p0 = getPoint(nodeHypeCycleCurve, l,t);
    // console.log('p0', p0)

	// draw circle at initial location
	const maturityCircle = svg.append('circle')
	.attr('class', 'maturity')
	.attr('r', 10)
    .attr('fill', '#ff8c00')
	.attr('transform', `translate(${p0.x},${p0.y})`);
	
	maturityCircle.transition()
		.ease(d3.easeLinear)
		.duration(10000)
		.attrTween('transform', translateAlong(nodeHypeCycleCurve))
	return;

}
function drawHypeCyclePhases(data) {
    svgPhases = svg.append('g').attr('transform', `translate(${150},${30})`)
    data.map((p,i) =>{
        svgPhases.append('text').text(p).attr('x',(CONST.canvas.graph.phases[i-1]) ).attr('y', H-100).attr('class', 'PhaseLabel')

    }
    
    )
}

function drawHypeCyclePoints(data) {
    let nodeHypeCycleCurve = d3.select('#HypeCycleCurve').node()
    var curveLength = nodeHypeCycleCurve.getTotalLength();

    function getPoint(path, l, t) {
        point = path.getPointAtLength(t * l)
        return point
    };



    data.points.forEach(o => { //o = observation

        let p = getPoint(nodeHypeCycleCurve, curveLength, o.progress);
                
        svg.append('line')
            .attr('x1', p.x)
            .attr('y1', p.y)
            .attr('x2', p.x + o.dx)
            .attr('y2', p.y + o.dy)
            .attr('class', 'callout')

        svg.append('text').text(o.label).attr('x', p.x + o.dx).attr('y', p.y + o.dy)
            .attr('text-anchor', () =>  (o.position == 'left') ? 'end': 'start')
            .attr('class','callout')

            svg.append('circle').attr('r', 15)
            .attr('fill', () => colorScale(o.plateau))
            .attr('stroke', () => (colorScale(o.plateau)=='white')? 'grey':'none' )
            .attr('cx', p.x)
            .attr('cy', p.y)
    })
}
function main() {
    const LINK = "HypeCycleCurve.json"
    d3.json(LINK)
    .then(data => 
        {
            // console.log(data)
            drawHypeCycleCurve(data.Curve)
            drawHypeCyclePhases(data.Phases)
            drawHypeCycleLegend()
            animateHypeCycleCurve()
            drawHypeCyclePoints(data.HypeCycles[0])
        }
    )


}



main();


