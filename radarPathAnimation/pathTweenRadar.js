const margin = { top: 0, right: 120, bottom: 10, left: 100 };
const width = 1500;
const height = 1500;


const svg = d3.select('#viz')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr("viewBox", [-width /2, -height /2 , width+100, height])
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top}) scale(0.75)`);



function pathTween(d1, precision) {
  return function() {
    const path0 = this;
    const path1 = path0.cloneNode();
    path1.setAttribute("d", d1);
    const n0 = path0.getTotalLength();
    const n1 = path1.getTotalLength();

    // Uniform sampling of distance based on specified precision.
    const distances = [0];
    const dt = precision / Math.max(n0, n1);
    let i = 0; while ((i += dt) < 1) distances.push(i);
    distances.push(1);

    // Compute point-interpolators at each distance.
    const points = distances.map((t) => {
      const p0 = path0.getPointAtLength(t * n0);
      const p1 = path1.getPointAtLength(t * n1);
      return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
    });

    return (t) => t < 1 ? "M" + points.map((p) => p(t)).join("L") : d1;
  };
}
function main () {
  const d0 = "M0,-405.351L258.02,-258.02L396.386,0L38.229,38.229L0,348.016L-119.02,119.02L-163.377,0L-278.647,-278.647Z";
  const d1 = "M0,-252.338L68.838,-68.838L412.199,0L143.788,143.788L0,213.58L-9.136,9.136L-5.586,0L-24.099,-24.099Z";


  svg.append("path")
    .attr("transform", "translate(180,150)scale(2,2)")
    .attr("fill", "none")
    .attr("stroke", "currentColor")
    .attr("stroke-width", 1.5)
    .attr("d", d0)
    .transition()
    .duration(2000)
    .on("start", function repeat() {
      d3.active(this)
        .attrTween("d", pathTween(d1, 1))
        .transition()
        .attrTween("d", pathTween(d0, 1))
        .transition()
        .on("start", repeat);
    });

  return svg.node();
}


main();