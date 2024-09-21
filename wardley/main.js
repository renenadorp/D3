
const margin = { top: 10, right: 120, bottom: 100, left: 100 };
const width = 1000;
const height = 1000;

const line = d3.line();
const svg = d3.select('#viz')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

    let data=[
      {Stage: 1, Name:  "Y#Dashboard", from:{x:850, y:350}, to : {x:400, y:150}},
      {Stage: 1, Name:  "Customer#Dashboard", from:{x:5, y:30},   to : {x:10, y:370}},
      {Stage: 2, Name:  "Customer#Dashboard", from:{x:350, y:50}, to : {x:40, y:10}},
      {Stage: 2, Name:  "X#Dashboard", from:{x:450, y:50}, to : {x:40, y:100}},
      {Stage: 2, Name:  "Y#Dashboard", from:{x:450, y:650}, to : {x:340, y:100}},
      {Stage: 3, Name:  "X#Dashboard", from:{x:500, y:30}, to : {x:10, y:800}},

]

var color = d3.scaleOrdinal()
  .domain(d3.extent(data))
   .range(['black', 'red', 'blue', 'green']);

function foo(data) {
  console.log('foo data:', data)
  svg
    .selectAll("path.line")
    .data(data, d => d.Name)
    .join(
      enter => {
            console.log('enter')
               enter.append("path")
               .attr("class","line")
                .attr('d', d=> {
                  console.log(d)
                  const p = [];
                  p.push([ d.from.x, d.from.y]);
                  p.push([ d.to.x, d.to.y]);         
                  return line(p)
                })
                .attr('stroke', 'black')
      }
    ,update => {
        console.log('update')
        update.transition().duration(3000).attrTween('d', d=> {
          // console.log('update',d, update)
          let previous = update.attr('d');

          const p = [];
          p.push([ d.from.x, d.from.y]);
          p.push([ d.to.x, d.to.y]);     
          const current = line(p);
          console.log(previous, current);
          return d3.interpolate(previous, current);
        })
        .attr('stroke-width', 10)
        .attr('stroke', 'red')

      }
    
    ,exit => { exit.remove()}
    );
};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

sleep(2000).then(() => { foo(data.filter(r => r.Stage==1)) });
sleep(3000).then(() => { foo(data.filter(r => r.Stage==2)) });
sleep(4000).then(() => { foo(data.filter(r => r.Stage==3)) });


