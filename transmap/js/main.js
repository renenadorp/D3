//MARGIN CONVENTION
var MARGIN = {  LEFT  : 100, RIGHT: 100, TOP: 10, BOTTOM: 100 }
var CANVAS = {  WIDTH : 1300  - MARGIN.LEFT - MARGIN.RIGHT,
                HEIGHT: 1200  - MARGIN.TOP  - MARGIN.BOTTOM}

var W2H    = +(CANVAS.WIDTH/CANVAS.HEIGHT)
var H2W    = +(CANVAS.HEIGHT/CANVAS.WIDTH)
var TMAP;
const STATE    = { RX: 50, RY: 50 }
const YEARBOX  = {HEIGHT: 40, WIDTH:CANVAS.WIDTH}
const DIM      = {WIDTH: 160, HEIGHT: 40}
const svgDummy = d3.select("#nonviz").append("svg")
const svg      = d3.select("#viz-area").append("svg")
  					.attr("width" , CANVAS.WIDTH  + MARGIN.LEFT + MARGIN.RIGHT)
  					.attr("height", CANVAS.HEIGHT + MARGIN.TOP  + MARGIN.BOTTOM)
                    .attr("version", "1.1")
                    
svg.append("defs").append("marker").attr('id',"arrowhead")
    .attr('markerWidth', "10")
    .attr('markerHeight', "7")
    .attr("refX", "11")
    .attr("refY", "2")
    .attr("orient", "auto")
    .append("polygon").attr("points","0 0, 4 2, 0 4")
/*
svg.append("filter").attr("id","dropshadow").attr("height", "120%")
        .append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation","3")
        .append("feOffset").attr("dx", "2").attr("dy","2").attr("result","offsetblur")
        .append("feComponentTransfer")
        .append("feFuncA").attr("type","linear").attr("slope","0.5")
        .append("feMerge")
        .append("feMergeNode").attr("in", "SourceGraphic")

*/



svg.append("filter").attr("id","dropshadow").attr("x","0").attr("y","0").attr("width","200%").attr("height","200%")
  .append("feDropShadow").attr("dx","2").attr("dy","2").attr("stdDeviation","3")
  .attr("floodxxxxxx-color","#A12119") // should be flood-color 
  .attr("flood-opacity","1");




const svgCanvas = svg.append("g")
  					.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
const gYearBox  = svgCanvas.append('g').attr('id', 'gYearBox')

var gMap        = svgCanvas.append("g")
                        .attr("class", "gMap")
                        .attr("transform", `translate(${0},${YEARBOX.HEIGHT})`)

const gCurve = gMap.append('g').attr('class', 'gCurve')
const gMaturityLines = gMap.append("g").attr("id", "gMaturityLines");                      
const gMaturityLevels = gMap.append("g").attr("id", "gMaturityLevels");                      
//TIP
var tip = d3.tip().attr('class', 'd3-tip').html((EVENT,d)=> {
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
    globalThis.updatedData = data;
    updateTMap(updatedData);
    //updateProjects(updatedData);
    //pdateProjectList(updatedData);

  })
function updateTMap(data){
    const DIMCOUNT        = data.dims.length
    const YEARCOUNT       = data.years.length
    const TLINESMIDDLE    = []
    const TLINES          = []
    const YEARLINESMIDDLE = [] //Vertical Aux Lines to compute centroids for each YEAR - DIM combination 
    const TCURVESMIDDLE   = [] //Transformation curves in the middle of each year. Used to compute centroids for ambition maturity level    
    const YEARPAD         = 2
    const YEARWIDTH       = (YEARBOX.WIDTH / YEARCOUNT)-YEARPAD 

    //YEARS
    const gYear     = gYearBox.selectAll().data(data.years)
    const gYearEnter= gYear.enter()
                            .append('g')
                            .attr('transform', (d,i)=> {
                                X=i*(YEARWIDTH+YEARPAD);
                                Y=0;
                                X1_MIDDLE = X + (YEARWIDTH/2) + YEARPAD;
                                Y1_MIDDLE = Y;
                                X2_MIDDLE = X1_MIDDLE;
                                Y2_MIDDLE = CANVAS.HEIGHT;
                                YEARLINESMIDDLE.push({x1: X1_MIDDLE, y1: Y1_MIDDLE, x2: X2_MIDDLE, y2:Y2_MIDDLE})
                                return `translate(${X},${Y  })`})

    gYearEnter.append('rect')
                .attr('width' , YEARWIDTH)
                .attr('height', YEARBOX.HEIGHT)
                .attr('rx', 5)
                .attr('ry', 5)
                
    gYearEnter.append('text')
                .text(d=> d)
                .attr('dx', YEARWIDTH/2)
                .attr('dy', (YEARBOX.HEIGHT/2) +2)
                .attr('text-anchor', 'middle')    
            
    //TMAP
    TMAP = {    HEIGHT: CANVAS.HEIGHT-YEARBOX.HEIGHT, 
                WIDTH : CANVAS.WIDTH}

    gMap.append("rect")
        .attr("width" , TMAP.WIDTH)
        .attr("height", TMAP.HEIGHT)

    //TRANSFORMATION CURVES      
 
    const sCurve = gCurve.selectAll('TCurve').data(data.years)
    sCurveEnter = sCurve.enter()
    sCurveEnter.append('path')
        .attr('d', (d,i)=>{const c= TCurve(d,i,YEARCOUNT);return c.Curve;})
        .attr('id', (d,i)=> `TCurve-${i}`)
        .attr('class', (d,i) => {return `TCurve-${i+1}`})
        
    sCurveEnter.append('path')
        .attr('d', (d,i)=>{const c= TCurve(d,i,YEARCOUNT); ;return c.CurveMiddle;})
        .attr('id', (d,i) => `${String(i).padStart(2, '000')}-${d}`)
        .attr("data-level", (d,i) => i)
        .attr('class', (d,i) => {return `TCurveMiddle`})

    var Angle = 90 / DIMCOUNT //Divide 90 degree angle by number of dimensions
    var AngleMiddle = Angle / 2 //Angle of middle transformation line is half the angle of the actual transformation line
    function r2d(radians){
        return (180/Math.PI)*radians
    }
    function d2r(degrees){
        return (Math.PI/180)*degrees
    }

    for (var i = 0; i < DIMCOUNT; i++) {
        var sumAngle = (Angle*(i+1))
        var sumAngleMiddle = sumAngle - AngleMiddle
        var A, O, X1, X2, Y1, Y2, C

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
                    Name  : data.dims[i].name, //VERY UGLY! I KNOW.
                    x1    : X1, 
                    y1    : Y1, 
                    x2    : X2, 
                    y2    : Y2
                    })  

        gMaturityLines.append("line")
                .attr("x1", X1)
                .attr("y1", Y1)
                .attr("x2", X2)
                .attr("y2", Y2)
                .attr('class', 'dimension')
                .attr('id', `${String(i).padStart(2, '0')}-${data.dims[i].name}`)

        //COMPUTE TLINES MIDDLE
        if (sumAngleMiddle <= CutoverAngle) {
            A_MIDDLE  = TMAP.WIDTH
            O_MIDDLE  = TMAP.WIDTH*Math.tan(d2r(sumAngleMiddle))
            X1_MIDDLE = TMAP.WIDTH
            Y1_MIDDLE = 0
            X2_MIDDLE = 0
            Y2_MIDDLE = O_MIDDLE
        }
        else {            
            A_MIDDLE  = TMAP.HEIGHT
            O_MIDDLE  = TMAP.HEIGHT*Math.tan(d2r(90-sumAngleMiddle))
            X1_MIDDLE = TMAP.WIDTH
            Y1_MIDDLE = 0
            X2_MIDDLE = TMAP.WIDTH - O_MIDDLE
            Y2_MIDDLE = TMAP.HEIGHT
        }
        TLINESMIDDLE.push({
            Number:  i, 
            Name  : `TLINESMIDDLE-${data.dims[i].name}`, 
            x1    : X1_MIDDLE, 
            y1    : Y1_MIDDLE, 
            x2    : X2_MIDDLE, 
            y2    : Y2_MIDDLE
            })
            
        
        gMap.append("line")
            .attr("x1", X1_MIDDLE)
            .attr("y1", Y1_MIDDLE)
            .attr("x2", X2_MIDDLE)
            .attr("y2", Y2_MIDDLE)
            .attr('class', 'TLineMiddle')
            .attr('id',`${data.dims[i].name}`)
    }

    //AXIS
    const sAxisDim = gMap.selectAll('.gAxisDim').data(TLINES)
    const gAxisDim = sAxisDim.enter().append('g')
        .attr('class','gAxisDim')
        .attr('transform', (d,i,n) => transformDim(d,i,n))
    gAxisDim.append('rect')
        .attr('width' , (d,i,n) => DIM.WIDTH)
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
        .text('Huidig')
        .attr('class', 'State')
        .attr('dy', 5)

    gFuture.append('ellipse')
        .attr('rx', STATE.RX)
        .attr('ry', STATE.RY)
        .attr('class', 'FutureState')

    gFuture.append('text')
        .attr('text-anchor', 'middle') 
        .text('Toekomst')
        .attr('class', 'State')
        .attr('dy', 5)

    //LOGO
    gLogo = gMap.append('g').attr('id', 'logo').attr('transform',`translate(${TMAP.WIDTH +2},${TMAP.HEIGHT}) rotate(-90) scale(0.5)`)
    gLogo.append('image')
        .attr('href', 'assets/logo.jpg')
        .attr('width', 145)

    //PROJECTS

    globalThis.gProjects = gMap.append('g').attr('id', 'gProjects');

    //MATURITY
    globalThis.gMaturityLevels = gMap.append('g').attr('id', 'gMaturityLevels');
    var dims = calculateCentroids(data.dims);
    //updateMaturity(dims)


    return;
    }

// ***************************************************************************************
// PROJECTS
// ***************************************************************************************

function updateProjects(data){
    //console.log('data:', data);

    const t = d3.transition()
    .duration(4000)
    .ease(d3.easeLinear);

    var Projects = gProjects.selectAll('.gProject').data(data.projects)
    Projects
        .join(
            function(enter) {
                gProjectEnter = enter.append('g').attr('class', 'gProject').call(drag());

                gProjectEnter
                    .attr('id', d => {return 'Project-' + String(d.number).padStart(2, '0')})
                    .attr( 'transform', d=>{ //console.log('here'); 
                        return `translate(${d.cx },${d.cy})`})//.transition(t)
                gProjectEnterRect = 
                    gProjectEnter.append('rect')
                    .attr('class', d => `Project ${d.status}`)
                    .attr('id', d => `Project-${String(d.number).padStart(2, '0')}`)
                    //.attr('width', d=>{console.log(d.name.length); return d.name.length *7 + 40})
                    .attr('height', 30)
                    .attr('x', d => -20)
                    .attr('y', d => - 15)
                    ;
                gProjectEnterText = 
                gProjectEnter.append('text')
                    .attr('class', 'Project')
                    .text(d=>{return `${d.number}.${d.name}`})
                    .attr('fill', 'white').attr('dx', -5).attr('dy', 5)
                    .attr('text-anchor', 'start');

                gProjectEnterRect.attr('width',  d=>BrowserText.getWidth(`${d.number}.${d.name}`, '14', 'Arial')+25)
                //console.log('textlength:', gProjectEnterText.node().getComputedTextLength());

/*
                gProjectEnterCircle = 
                gProjectEnter.append('circle')
                .attr('cx', -10)
                .attr('cy', -15)
                .attr('r', 3)
                .attr('class', 'project-hinge')
                
              gProjectEnterPushPin = 
                gProjectEnter.append('image')
                .attr('class', 'project-hinge')
                .attr( 'x', -200)
                .attr('y', -200)
                .attr('href', "assets/pushpin.svg" )
                .attr("transform",   'scale(.15)');
*/
       

                Projects = gProjectEnter.merge(Projects)


            },
            function(update){
                gProjectUpdate = update
                 .attr( 'transform', d=>{
                    return `translate(${d.cx },${d.cy})`}).transition(t)
                update.select('text.Project').text(d=>{return `${d.number}.${d.name}`})
                .attr('fill', 'white').attr('dx', -5).attr('dy', 5)
                .attr('text-anchor', 'start')
            },
            function(exit) {
                return exit.remove();
              }
        )
}

function moveProject(id, x, y){
    
    const projectArrayIndex = +id.substring(8,10)-1
    updatedData.projects[projectArrayIndex].cx = x;
    updatedData.projects[projectArrayIndex].cy = y;
    
}

function changeProject(what, e){
    projectSelector = `rect#${e.id.substring(0, 10)}`; //
    projectArrayIndex = +e.id.substring(9,10)-1 //    Project-01-Name
    //console.log(what, ' ' , e, updatedData, 'id:', e.id, 'number:', projectArrayIndex )

    if (what=="Name") {
        updatedData.projects[projectArrayIndex].name = e.value;
        updateProjects(updatedData)

    }
    if (what=="Status") {
        updatedData.projects[projectArrayIndex].status = e.value;
        //console.log( projectSelector)
        var SelectedStatus = document.getElementById( e.id );
        var SelectedStatusValue = SelectedStatus.options[ SelectedStatus.selectedIndex ].value
        var SelectedProject =document.querySelector(projectSelector)
        SelectedProject.className.baseVal = 'Project ' + SelectedStatusValue;
        //console.log('Status:' ,SelectedStatus, SelectedStatusValue, SelectedProject)

    }

    return;
}
function updateProjectList(data)  {
    const tableStringStart = 
    `
   
    <details>     
        <summary>Click here to update Projects</summary>                

    <table class="table table-sm table-light" id="project-list">
                    <thead>
                        <tr>
                        <th scope="col" class="text-right">Nbr</th>
                        <th scope="col" class="text-left">Name</th>
                        <th scope="col" class="text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    var tableStringRows = '';
    data.projects.map(row=> {
    tableStringRows += `
    <tr>
    <th scope="row" class="text-right">${row.number}</th>
    <td><input type="text" id="Project-${String(row.number).padStart(2, '0')}-Name" class="form-control project-name" value="${row.name}"></input></td>    
    <td><select name="status" id="Project-${String(row.number).padStart(2, '0')}-Status" class="form-control form-select-lg project-status" aria-label=".form-select-sm form-control project-status" value="${row.status}">
            <option name="completed" value="completed" ${row.status=='completed' ? "selected" : null }>Completed</option>
            <option name="inprogress" value="inprogress" ${row.status=='inprogress' ? "selected" : null }>In Progress</option>
            <option name="future" value="future" ${row.status=='future' ? "selected" : null }>Future</option>
        
        </select></td>    
    

    </tr>
    `});
    
    const tableStringEnd =
        `
        <tr><td></td><td><a href="" id="a"></a>
        <button type="button" class="btn btn-primary" onclick="saveMap()" id="saveMap" >Save Map</button>
       </td></tr>
        </tbody>
        </table>
        </details>
    

        `;

    const html = tableStringStart + tableStringRows + tableStringEnd;
    d3.select("#project-list").html(html);
    //console.log( d3.select("#project-list"))
       
    d3.selectAll(".move-project").on("click", function() {
        moveProject(this.id);
    });

    d3.selectAll(".project-name").on("change", function() {
        changeProject("Name", this);
    });
    d3.selectAll(".project-status").on("change", function() {
        changeProject("Status", this);
    });
    d3.selectAll("button#saveMap").on("click", function(){
        saveMap(data)
    });

    return ;

}

function saveMap (data) {
    var json = JSON.stringify(data)
    //console.log('saveMap:', json)
    //alert('savemap ')
// Function to download data to a file
    var type ="application/json";
    var filename = "data.json";
    var jsonBlob = new Blob([json], {type: type});

    //var jsonBlob = new Blob([JSON.stringify("kiki")], { type: 'application/javascript;charset=utf-8' });
    var link=window.URL.createObjectURL(jsonBlob);
    //window.location=link;
    saveAs(jsonBlob, filename);

    


    
   return; 
}

function drag () {
    
    function dragstarted(event, d) {
      d3.select(this).raise().attr("stroke", "black");
    }
  
    function dragged(event, d) {
        //d3.select(this).attr("x", d.x = event.x).attr("y", d.y = event.y);
      d3.select(this).attr("transform", `translate(${event.x},${event.y})`);

    }
  
    function dragended(event, d) {
      d3.select(this).attr("stroke", null);
      moveProject(this.id, event.x, event.y);

    }
  
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }

var BrowserText = (function () {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');
    /**
     * Measures the rendered width of arbitrary text given the font size and font face
     * @param {string} text The text to measure
     * @param {number} fontSize The font size in pixels
     * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
     * @returns {number} The width of the text
     **/
    function getWidth(text, fontSize, fontFace) {
        context.font = fontSize + 'px ' + fontFace;
        //console.log('width:', context.measureText(text).width)

        return context.measureText(text).width;
    }

    return {
        getWidth: getWidth
    };
})();


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

function path_line_intersections(pathEl, line, n_segments) {
    pathLength = pathEl.getTotalLength();
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


// ***************************************************************************************
// TRANSFORMATION CURVES   
// ***************************************************************************************
function TCurve(d,i,c) {
    //console.log('called')
    pts = []
    p1  = {}
    p1.x1  = (TMAP.WIDTH/c)*(i+1);
    p1.y1  = 0
    p1.cpx = p1.x1
    p1.cpy = (TMAP.HEIGHT/c)*(c-(i+1))
    p1.x2 = TMAP.WIDTH
    p1.y2 = p1.cpy
    curve = bezierCurve(p1)

    p2 = {}
    p2.x1 = (TMAP.WIDTH/c)*(i+1) - ((TMAP.WIDTH/c) / 2)
    p2.y1 = 0
    p2.cpx = p2.x1;
    p2.cpy = (TMAP.HEIGHT/c)*(c-(i+1)) + ((TMAP.HEIGHT/c) / 2)
    p2.x2  = TMAP.WIDTH;
    p2.y2  = p2.cpy;
    curveMiddle = bezierCurve(p2)

    curves = {}
    curves.Curve = curve;
    curves.CurveMiddle = curveMiddle;
    return curves;
    }

function bezierCurve(p) {
    // p : object with attributes:x0, y0, cpx, cpy, x1
    // 
    const path = d3.path();
    path.moveTo(TMAP.WIDTH, 0)
    path.lineTo(p.x1, p.y1)
    path.quadraticCurveTo(p.cpx, p.cpy, p.x2, p.y2);
    path.lineTo(TMAP.WIDTH, 0)
    const curve = `${path}Z`       
    //console.log('p:', p)
    return curve
}

// ***************************************************************************************
// MATURITY    
// ***************************************************************************************
function calculateCentroids(dims) {

    // Calculates intersection between transformation lines and transformation curves
    // Credits: https://bl.ocks.org/bricof, https://bl.ocks.org/bricof/f1f5b4d4bc02cad4dea454a3c5ff8ad7
    
    sTCurveMiddle = gMap.selectAll('path.TCurveMiddle')//.node(t=>console.log('t:', t));//.nodes()
    //console.log('sTCurveMiddle:', sTCurveMiddle)

    sTLineMiddle = gMap.selectAll('.TLineMiddle');

    CENTROIDS = []
    sTCurveMiddle.each(function (p, j) {
        pathObject = d3.select(this);
        //console.log('pathObject:', pathObject)
        sTLineMiddle.each(function (q,k) {
            lineObject = d3.select(this)
            //console.log('lineObject:', lineObject)
            pts_i = path_line_intersections(pathObject.node(), lineObject, 100)
            //console.log(pts_i)
            for (i=0;i<pts_i.length;i++){
                if (pts_i[i].x !== 0 && pts_i[i].x !== TMAP.WIDTH && pts_i[i].y !== 0 && pts_i[i].y !== TMAP.HEIGHT)
                    CENTROIDS.push({maturityLevel: +pathObject.attr('data-level'), maturityId: pathObject.attr('id'), dimensionId: lineObject.attr('id'), centroid: pts_i[i]})
            }
        })
    })

    //console.log('CENTROIDS:', CENTROIDS)
    //filter = CENTROIDS.filter(r=>r.maturityIndex==1 )

    dims.map(d=>{

        d.centroidCurrent=CENTROIDS.filter(c=>c.maturityLevel==d.maturityCurrent && c.dimensionId == d.name)[0].centroid
        d.centroidAmbition=CENTROIDS.filter(c=>c.maturityLevel==d.maturityAmbition && c.dimensionId == d.name)[0].centroid
    })


    return dims
}

function updateMaturity(dims){
    //console.log('data:', data);
    // Purpose: draw a circle for current maturity and ambition maturity level with a arrow in between
    // Input  : data, with current and ambition maturity level for each dimension
    // Output : 2 circles and an arrow, animated

    const t = d3.transition()
    .duration(4000)
    .ease(d3.easeLinear);

    var MaturityLevels = gMaturityLevels.selectAll('.gMaturityLevel').data(dims)
    MaturityLevels
        .join(
            function(enter) {
                console.log('Maturity Enter')
                gMaturityLevelsEnter = enter.append('g').attr('class', 'gMaturityLevel');//.call(drag());

                gMaturityLevelsEnter
                    .attr('id', d => {return 'MaturityLevel-' + d.name})
                    gMaturityLevelsEnter.append('line')
                    .attr('x1', d=> d.centroidCurrent.x)
                    .attr('y1', d=> d.centroidCurrent.y)
                    .attr('x2', d=> d.centroidAmbition.x)
                    .attr('y2', d=> d.centroidAmbition.y)
                    .attr('class', 'maturityLine')
                    .attr("style", "filter:url(#dropshadow)")
                    
                gMaturityLevelsEnter.append('circle')
                    .attr('cx', d=>  d.centroidCurrent.x)
                    .attr('cy',d=>  d.centroidCurrent.y).attr('r', 10).attr('class', 'maturityLevelCurrent').attr("style", "filter:url(#dropshadow)")
                gMaturityLevelsEnter.append('circle')
                    .attr('cx', d=> d.centroidAmbition.x)
                    .attr('cy',d=>  d.centroidAmbition.y).attr('r', 10).attr('class', 'maturityLevelAmbition').attr("style", "filter:url(#dropshadow)")

             
                //gMaturityLevelsEnterRect.attr('width',  d=>BrowserText.getWidth(`${d.number}.${d.name}`, '14', 'Arial')+25)
                MaturityLevels = gMaturityLevelsEnter.merge(MaturityLevels)


            },
            function(update){
                console.log('Maturity Update')
                // gMaturityLevelsUpdate = update
                //  .attr( 'transform', d=>{
                //     return `translate(${d.cx },${d.cy})`}).transition(t)
                // update.select('text.MaturityLevels').text(d=>{return `${d.number}.${d.name}`})
                // .attr('fill', 'white').attr('dx', -5).attr('dy', 5)
                // .attr('text-anchor', 'start')
            },

            function(exit) {
                console.log('Maturity Exit')
                return exit.remove();
              }
        )
}

function selectMaturityCentroid(d,centroids){
    console.log('d,i:', d)

    return
}