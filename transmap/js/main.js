//MARGIN CONVENTION
var MARGIN = {  LEFT  : 100, RIGHT: 100, TOP: 100, BOTTOM: 100 }
var CANVAS = {  WIDTH : 1200  - MARGIN.LEFT - MARGIN.RIGHT,
                HEIGHT: 1000  - MARGIN.TOP  - MARGIN.BOTTOM}

var W2H    = +(CANVAS.WIDTH/CANVAS.HEIGHT)
var H2W    = +(CANVAS.HEIGHT/CANVAS.WIDTH)

const STATE   = { RX: 50, RY: 50 }
const YEARBOX = {HEIGHT: 40, WIDTH:CANVAS.WIDTH}
const DIM     = {WIDTH: 160, HEIGHT: 40}
const svg     = d3.select("#viz-area").append("svg")
  					.attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
  					.attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
const svgCanvas = svg.append("g")
  					.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

//TIP
var tip = d3.tip().attr('class', 'd3-tip').html(d=>{ 
                let text =`
                
                <div class="container">
                <div class="row"><div class="col-sm"> ${d.dim}</div></div>
                <div class="row"><div class="col-sm"> ${d.number}.${d.name}</div></div>
                <div class="row"><div class="col-sm"> ${d.descr}</div></div>
                </div>                        
                        
                        `
                
                
                
                
                return text;      })
svgCanvas.call(tip)

//DATA
const myRequest = new Request('data/data.json');

fetch(myRequest, {method: 'GET',  
                  mode: 'no-cors', 
                  headers: {"Content-type": "application/json" } })
  .then((response) => response.json())
  .then((data) => {
      updateTMap(data)
  })

function updateTMap(data){

    const DIMCOUNT  = data.dims.names.length
    const YEARCOUNT = data.years.length
    const TLINES    = []
    const YEARPAD   = 2
    const YEARWIDTH = (YEARBOX.WIDTH / YEARCOUNT)-YEARPAD 

    //YEARS
    const gYearBox  = svgCanvas.append('g').attr('id', 'gYearBox')
    const gYear     = gYearBox.selectAll().data(data.years)
    const gYearEnter= gYear.enter().append('g').attr('transform', (d,i)=> {return `translate(${(i*(YEARWIDTH+YEARPAD))},${5   })`})

    gYearEnter.append('rect')
                .attr('width', YEARWIDTH)
                .attr('height', YEARBOX.HEIGHT)
                .attr('rx', 5)
                .attr('ry', 5)
                
    gYearEnter.append('text')
                .text(d=> d)
                .attr('dx', YEARWIDTH/2)
                .attr('dy', (YEARBOX.HEIGHT/2) +2)
                .attr('text-anchor', 'middle')    
            
    //TMAP
    const TMAP = {    HEIGHT: CANVAS.HEIGHT-YEARBOX.HEIGHT, 
                    WIDTH : CANVAS.WIDTH}

    const gMap = svgCanvas.append("g").attr("id", "gMap")
                .attr("transform", `translate(${0},${YEARBOX.HEIGHT})`)

    gMap.append("rect")
        .attr("width" , TMAP.WIDTH)
        .attr("height", TMAP.HEIGHT)

    //TRANSFORMATION CURVES      
    const gCurve = gMap.append('g').attr('class', 'gCurve')

    const sCurve = gCurve.selectAll('TCurve').data(data.years)
    sCurve.enter().append('path')
        .attr('d', (d,i)=>TCurve(d,i,YEARCOUNT))
        .attr('id', (d,i)=> `TCurve-${i}`)
        //.attr('class', (d,i) => {return `TCurve-${i+1}`})
        
    var Angle = 90 / DIMCOUNT //Divide 90 degree angle by number of dimensions

    function r2d(radians){
        return (180/Math.PI)*radians
    }
    function d2r(degrees){
        return (Math.PI/180)*degrees
    }

    //console.log(Math.tan(d2r(45))*WIDTH) // [VERIFIED] Using 45 degrees, the HEIGHT should be the same as WIDTH
    //console.log(r2d(Math.atan(1)))       // [VERIFIED] 1 is the value when both sides have the same length. The angle should be 45 


    //TODO: This loop needs to be rewritten to a form using d3.selectAll().data().append..... 
    for (var i = 1; i <= DIMCOUNT; i++) {
        var sumAngle = (Angle*i)
        var radian, A, O, X1, X2, Y1, Y2, C

        CutoverAngle = r2d(Math.atan(H2W))
        //console.log(`Dims:${Dims} i:${i}, Angle:${Angle}, SumAngle:${sumAngle}, CutoverAngle: ${CutoverAngle}`)

        if (sumAngle <= CutoverAngle) {
                A  = TMAP.WIDTH
                O  = TMAP.WIDTH*Math.tan(d2r(sumAngle))
                X1 = TMAP.WIDTH
                Y1 = 0
                X2 = 0
                Y2 = O
        }
        else {            
                A  = TMAP.HEIGHT
                O  = TMAP.HEIGHT*Math.tan(d2r(90-sumAngle))
                X1 = TMAP.WIDTH
                Y1 = 0
                X2 = TMAP.WIDTH - O
                Y2 = TMAP.HEIGHT
        }
        //Store coordinates to use for axis Dimension
        TLINES.push({Number:  i, 
                    Name  : data.dims.names[i-1], //VERY UGLY! I KNOW.
                    x1    : X1, 
                    y1    : Y1, 
                    x2    : X2, 
                    y2    : Y2
                    })  
        //}, Y1:${Y1}, X2:${X2}, Y2:${Y2}`)
        //console.log(`Angle: ${r2d(Math.atan(O/A))}`)
        gMap.append("line")
                .attr("x1", X1)
                .attr("y1", Y1)
                .attr("x2", X2)
                .attr("y2", Y2)
                .attr('class', 'dimension')
                .attr('id', `TLine-${i}`)
        }


    //TRANSFORMATION CURVES      
    function TCurve(d,i,c) {
        //console.log('called')
        const x0  = (TMAP.WIDTH/c) * (i+1),
                y0  = 0,
                cpx = (TMAP.WIDTH/c)*(i+1),
                cpy = (TMAP.HEIGHT/c)*(c-(i+1)),
                x   = TMAP.WIDTH,
                y   = (TMAP.HEIGHT/c)*(c-(i+1));
        
        const path = d3.path();
        path.moveTo(TMAP.WIDTH, 0)
        path.lineTo(x0, y0)
        path.quadraticCurveTo(cpx, cpy, x, y);
        path.lineTo(TMAP.WIDTH, 0)
        const curve = `${path}Z`
        
        return curve;
        }

    //AXIS
    //console.log(TLINES)
    const sAxisDim = gMap.selectAll('.gAxisDim').data(TLINES)
    const gAxisDim = sAxisDim.enter().append('g')
        .attr('class','gAxisDim')
        .attr('transform', (d,i,n) => transformDim(d,i,n))
    gAxisDim.append('rect')
        .attr('width', (d,i,n) => DIM.WIDTH)
        .attr('height', (d,i,n) => DIM.HEIGHT)
        .attr('rx', 20)
        .attr('ry', 20)

    gAxisDim.append('text').text(d=>d.Name)
        .attr('text-anchor', 'middle')//.attr('transform', (d,i,n) => transformDim(d,i,n))
        .attr('dy', DIM.HEIGHT/2 +5)
        .attr('dx', DIM.WIDTH/2)

    //Function to calculate location and rotation of Dimension
    function transformDim(d,i,n){
        var X = undefined
        var Y = undefined
        var svg =''
        if (i==0) {
                X = d.x2 == 0 ? -DIM.HEIGHT-5                   : 0
                Y = d.x2 == 0 ? (d.y2 / 2) + (DIM.WIDTH/2)      : CANVAS.HEIGHT
                R = d.x2 == 0 ? -90                             : 0
        }
        else
        {
                X = d.x2 == 0 ? -DIM.HEIGHT -5                  :  TLINES[i-1].x2 + ((d.x2 - TLINES[i-1].x2 ) /2) - (DIM.WIDTH/2)
                Y = d.x2 == 0 ? TLINES[i-1].y2 + 
                                ((d.y2-TLINES[i-1].y2)/2) + 
                                (DIM.WIDTH/2)                 : CANVAS.HEIGHT - DIM.HEIGHT+5 
                R = d.x2 == 0 ? -90                             : 0
        }
        //console.log(i, TLINES[i].y2, d.y2)
        svg = `translate (${X},${Y}) rotate(${R})`
        return svg
    }

    //CURRENT - FUTURE 
    const gCurrent=gMap.append('g').attr('class','gState').attr('transform', `translate(${0},${TMAP.HEIGHT})`)
    const gFuture =gMap.append('g').attr('class','gState').attr('transform', `translate(${TMAP.WIDTH},${0})`)

    gCurrent.append('ellipse')
        .attr('rx', STATE.RX)
        .attr('ry', STATE.RY)
        .attr('class', 'CurrentState')

    gCurrent.append('text')
        .attr('text-anchor', 'middle') 
        .text('CURRENT')
        .attr('class', 'State')
        .attr('dy', 5)

    gFuture.append('ellipse')
        .attr('rx', STATE.RX)
        .attr('ry', STATE.RY)
        .attr('class', 'FutureState')

    gFuture.append('text')
        .attr('text-anchor', 'middle') 
        .text('FUTURE')
        .attr('class', 'State')
        .attr('dy', 5)


  
    //console.log(data.dims.details)

    //HSO LOGO
    gHSO = gMap.append('g').attr('id', 'HSO').attr('transform',`translate(${TMAP.WIDTH +2},${TMAP.HEIGHT}) rotate(-90)`)
    gHSO.append('image')
        .attr('href', 'assets/hso.png')
        .attr('width', 145)

    const gProjects = gMap.append('g').attr('class', 'gProjects')
    const sProjects = gProjects.selectAll('.gProject').data(data.projects)
    sProjects.exit().remove()

    gProject = sProjects.enter().append('g').attr('class', 'gProject').attr( 'transform', d=>`translate(${d.cx},${d.cy})`)
    gProject.append('circle')
        .attr('class', 'Project')
        .attr( 'r', 20)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        
    gProject.append('text').text(d=>d.number).attr('fill', 'white').attr('dx', -5).attr('dy', 5)
        

    
    //******************************************************************************************************************* */
    // INTERSECTIONS: LINE-CURVE
    // Credits: https://bl.ocks.org/bricof
    // Link: https://bl.ocks.org/bricof/f1f5b4d4bc02cad4dea454a3c5ff8ad7
    
    var n_segments = 100;
    var path = svg.select("path#TCurve-0");
    var pathEl = path.node();
    //console.log(pathEl)

    var pathLength = pathEl.getTotalLength();
    var line = gMap.select("line#TLine-1");

    // console.log(line.attr('x1'), line.attr('y1'), line.attr('x2'), line.attr('y2') )
    // console.log(pathLength)
    // console.log(TLINES)

    pts_i = path_line_intersections(pathEl,line)
    console.log(pts_i)
    for (i=0; i< pts_i.length; i++){
        if (pts_i[i].x!==1000){
            gMap.append('circle')
                .attr('r', 5)
                .attr('cx', pts_i[i].x)
                .attr('cy', pts_i[i].y).attr('stroke', 'none').attr('fill', 'none')
        }
    }
    function positionLine(line) {
        line
            .attr("x1", function(d) { return d[0][0]; })
            .attr("y1", function(d) { return d[0][1]; })
            .attr("x2", function(d) { return d[1][0]; })
            .attr("y2", function(d) { return d[1][1]; });
    }
    
    function btwn(a, b1, b2) {
        if ((a >= b1) && (a <= b2)) { return true; }
        if ((a >= b2) && (a <= b1)) { return true; }
        return false;
    }
    
    function line_line_intersect(line1, line2) {
        var x1 = line1.x1, x2 = line1.x2, x3 = line2.x1, x4 = line2.x2;
        var y1 = line1.y1, y2 = line1.y2, y3 = line2.y1, y4 = line2.y2;
        var pt_denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        var pt_x_num = (x1*y2 - y1*x2) * (x3 - x4) - (x1 - x2) * (x3*y4 - y3*x4);
        var pt_y_num = (x1*y2 - y1*x2) * (y3 - y4) - (y1 - y2) * (x3*y4 - y3*x4);
        if (pt_denom == 0) { return "parallel"; }
        else { 
        var pt = {'x': pt_x_num / pt_denom, 'y': pt_y_num / pt_denom}; 
        if (btwn(pt.x, x1, x2) && btwn(pt.y, y1, y2) && btwn(pt.x, x3, x4) && btwn(pt.y, y3, y4)) { return pt; }
        else { return "not in range"; }
        }
    }
  
    function path_line_intersections(pathEl, line) {

        var pts = []
        for (var i=0; i<n_segments; i++) {
          var pos1 = pathEl.getPointAtLength(pathLength * i / n_segments);
          var pos2 = pathEl.getPointAtLength(pathLength * (i+1) / n_segments);
          var line1 = {x1: pos1.x, x2: pos2.x, y1: pos1.y, y2: pos2.y};
          var line2 = {x1: line.attr('x1'), x2: line.attr('x2'), 
                       y1: line.attr('y1'), y2: line.attr('y2')};
          var pt = line_line_intersect(line1, line2);
          if (typeof(pt) != "string") {
            pts.push(pt);
          }
        }
        
        return pts;
      
      }




}