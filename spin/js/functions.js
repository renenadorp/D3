import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


export const log = ( msg, obj, level) => {
  const DEBUG_LEVEL = 10;

  const log_this = (level != undefined && level < DEBUG_LEVEL) ? 
             true :
             false;
  
  if (log_this) 
    console.log(msg, obj);
};


export function drawLogo(s, props)  {
  const {width, height, scale} = props; //Unpack parameters
  
  // Create dummy data
  var data = [{value:20},{value:20},{value:20},{ value:20},{value:20}]
  
  const rangeColorsInergyRed = [
    
    '#BD0006', //Medium
    '#D70006', //Light
  
    '#A12119',  //Dark
  
    '#BD0006', //Medium
    '#A12119'  //Dark
  
  ]
  
  const gLogo = s.append('g').attr('id', 'logo').attr('transform', `scale(${scale})`)
  
  //OUTER
  var color = d3.scaleOrdinal()
    .domain(d3.extent(data, (d,i) => i))
     .range(rangeColorsInergyRed);
    
  var arcOuter = d3.arc()
     .innerRadius(60)
     .outerRadius(40)
     .cornerRadius(0);
  
  var pie = d3.pie()
     .sort(null)
     .value(d => d.value);
  const arcsOuter = pie(data);
  
  gLogo.append("g")
    .attr("stroke", "none")
    .selectAll("path")
    .data(arcsOuter)
    .enter().append("path")
    .attr("fill", (d,i) => color(i))
    .attr("d", arcOuter)
    ;
  
    // INNER
    const rangeColorsInergyGrey = [
      'grey',
      'lightgrey',
      'lightgrey',
      'grey'  ]
    const dataInner = [0,1,2,3];
    var color = d3.scaleOrdinal()
      .domain(d3.extent(dataInner, (d,i) => i))
       .range(rangeColorsInergyGrey);
      
    var arcInner = d3.arc()
       .innerRadius(40)
       .outerRadius(20)
       .cornerRadius(1);
    
    var pie = d3.pie()
       .sort(null)
       .value(1);
    const arcsInner = pie(dataInner);
    
    gLogo.append("g")
      .attr("stroke", "none")
      .selectAll("path")
      .data(arcsInner)
      .enter().append("path")
      .attr("fill", (d,i) => {log(color(i),i); return color(i)})
      .attr("d", arcInner)
      ;
  
    gLogo.attr("transform", );
  
    var i = 0;
    var timeInterval = 100;
    setInterval(function(){
      i += 1;
      update(i % 360) 
    },timeInterval);
  
  
    var n;
    // update the element
    function update(n) {
      // rotate the text
      gLogo.attr("transform", `scale(${scale}) rotate(${n}) `).transition().duration(1);
    }
    
    return s.node();
  }



export function drawSpin(s, props) {
  const {width, height, scale, mod, radius,fontsize} = props; //Unpack parameters

  const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius - 1);

  const pie = d3.pie()
    // .padAngle(1)
    // .padAngle(1 / radius)
    .sort(null)
    .value(d => d.value);


  const data = [
    {name: '1', value: 25},
    {name: '2', value: 25},
    {name: '3', value:25},
    {name: '4', value: 25},
  ]
  const color = d3.scaleOrdinal()
      .domain(data.map(d => d.value))
      .range(  ['#66686b', '#7ab1ec', '#2671c0','#cacaca']);

  const gSpin = s.append('g').attr('id', 'Spin').attr('transform', `scale(${scale})`)
  // g.append('circle').attr('cx', 150).attr('cy', 150).attr('r', 150).attr('fill', color);
  //g.append('text').attr('class','label').attr('x', 150).attr('y',140).text('1').attr('font-size', 30).attr('text-anchor', 'middle')
  gSpin.selectAll('.stepArc')
    .data( pie(data) )
    .join(
      enter => {
        enter.append("path")
        .attr("fill", d => color(d.data.name))
        .attr("id", (d,i) => `stepArc${i}`)
        .attr("d", arc)
        ;
    // .append("title")
    // .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);
      }
  )


  gSpin.selectAll('.stepText')
    .data( data )
    .join(
      enter => {
            enter
            .append('text')
            .attr("class","stepText")
            .attr("x", 1)
            .attr("dy", 98)
            .append("textPath")
            .attr("xlink:href", (d,i) => { return `#stepArc${i}`})
            .style("text-anchor","middle") //place the text halfway on the arc
            // .attr("startOffset", "50%")
            .text(d=>d.name)
            ;
      }
    )



  gSpin.selectAll('.circle')
      .data([90,210])
      .join(
        enter =>   enter.append('circle')
                        .attr('class', 'spinCircle')
                        .attr('cx', 0)
                        .attr('cy', 0)
                        .attr('r', (d,i) => d)
                        .attr('fill', "none")
                        .attr('stroke', "lightgrey")

      )



      var i = 0;
      var timeInterval = 40;
      setInterval(function(){
        i += 1;
        update(i % 360) 
      },timeInterval);
    
    
      var n;
      // update the element
      function update(n) {
        // rotate the text
        gSpin.attr("transform", `scale(${scale}) rotate(${n}) `).transition().duration(1);
      }

  return gSpin.node()
  




  
  }









  export function drawMedIndicator(s, props)  {
    const {width, height, scale, mod} = props; //Unpack parameters
    //log('drawMedIndicator')
    
    // Create dummy data
    var data = [{value:20},{value:20},{value:20},{ value:20},{value:20}]
    
    const rangeColorsInergyRed = [
      
      '#BD0006', //Medium
      '#D70006', //Light
    
      '#A12119',  //Dark
    
      '#BD0006', //Medium
      '#A12119'  //Dark
    
    ]
    
    const dayOfYear = date =>
      Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
      const currentDate = new Date();
      const currentDateFormatted = currentDate.toDateString();
      const currentDayOfYear = dayOfYear(currentDate);
    const modValue = currentDayOfYear % mod;
    const medIndicatorValue = modValue !=0 ? true : false;
    const medIndicatorMsg = medIndicatorValue ? `Take your meds!` : `No meds today!`
  
    const color = medIndicatorValue ? 'green' :  'red';

    const startY = 140;
    const g = s.append('g').attr('id', 'MedIndicator').attr('transform', `scale(${scale})`)
    g.append('circle').attr('cx', 150).attr('cy', 150).attr('r', 150).attr('fill', color);
    g.append('text').attr('class','label').attr('x', 150).attr('y',startY + 0*20).text(medIndicatorMsg).attr('font-size', 30).attr('text-anchor', 'middle')
    g.append('text').attr('class','label').attr('x', 150).attr('y',startY + 2*20).text(`Date: ${ currentDateFormatted}`).attr('font-size', 20).attr('text-anchor', 'middle')
    g.append('text').attr('class','label').attr('x', 150).attr('y',startY + 3*20).text(`DoY ${currentDayOfYear}`).attr('font-size', 20).attr('text-anchor', 'middle')
    g.append('text').attr('class','label').attr('x', 150).attr('y',startY + 4*20).text(`Skip in ${modValue} days. Mod:${mod}`).attr('font-size', 20).attr('text-anchor', 'middle')
/*
    var i = 0;
    var timeInterval = 10;
    setInterval(function(){
      i += 1;
      update(i % 360) 
    },timeInterval);
  
  
    var n;
    // update the element
    function update(n) {
      // rotate the text
      g.attr("transform", `scale(${scale}) rotate(${n}) `).transition().duration(1);
    }
    */
    
    return s.node();
  }
