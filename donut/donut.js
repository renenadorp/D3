export const  DonutChart = (data, {
  category = ([x]) => x,
  name = ([x]) => x,  // given d in data, returns the (ordinal) label
  value = ([, y]) => y, // given d in data, returns the (quantitative) value
  focus = ([, y]) => y, // given d in data, returns the (quantitative) value
  title, // given d in data, returns the title text
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  innerRadius = Math.min(width, height) / 6, // inner radius of pie, in pixels (non-zero for donut)
  outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
  labelRadius = (outerRadius+innerRadius) / 2, // center radius of labels
  format = ",", // a format specifier for values (in the label)
  names, // array of names (the domain of the color scale)
  settings, // look and feel => colors, borders, ..
  //stroke = innerRadius > 0 ? "#010202" : "#010202", // stroke separating widths
  strokeWidth = 1, // width of stroke separating wedges
  strokeLinejoin = "round", // line join of stroke separating wedges
  // padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
  padAngle = 0
} = {}) => {

  // Stroke
  const  stroke = (d) => { 
    const r = d ? "red" : "#010202";
    // console.log(d, r);
    return r}; 

  // Compute values.
  const C = d3.map(data, category);
  const N = d3.map(data, name);
  const V = d3.map(data, value);
  const F = d3.map(data, focus);
  const I = d3.range(N.length).filter(i => !isNaN(V[i]));
  // console.log("F", F);
  // Unique the names.
  if (names === undefined) names = N;
  names = new d3.InternSet(names);

  
  // Compute titles.
  if (title === undefined) {
    const formatValue = d3.format(format);
    // title = i => `${N[i]}\n${formatValue(V[i])}`;  ORIGINAL
    title = i => `${N[i]}`; //WITHOUT VALUE
  } else {
    const O = d3.map(data, d => d);
    const T = title;
    title = i => T(O[i], i, data);
  }

  // Construct arcs.
  const arcs      = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);//.focus(i => F[i])(F);
  const arc       = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  const arcLabel  = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
  
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width /2, -height /2 , width+100, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
      // .attr("stroke"          , stroke())
      .attr("stroke-width"    , strokeWidth)
      .attr("stroke-linejoin" , strokeLinejoin)
    .selectAll("path")
    .data(arcs)
    .join("path")
      .attr("fill", d => settings.colorScaleFill(F[d.data]))
      .attr("d", arc)
      .attr("stroke", settings.pie.stroke)
      .attr("stroke-width", settings.pie.strokeWidth)
    .append("title")
      .text(d => {
        return title(d.data);
      });

  svg.append("text")
    .text(settings.label.text)
    .attr("font-size", "35px")
    .attr("font-weight", "700")
    .attr("text-anchor", "middle")
      .attr("fill", settings.label.FontColor)
      .attr("y", 30);
  
  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size",28)
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(arcs)
    .join("text")
      .attr("transform", d => {
        const rotation = d.endAngle < Math.PI ? 
          (d.startAngle/2 + d.endAngle/2) * 180/Math.PI : 
          (d.startAngle/2  + d.endAngle/2 + Math.PI) * 180/Math.PI ;
        return `translate(${arcLabel.centroid(d)}), rotate(${rotation-90})`
      }).attr("fill", d=> { 
        // console.log(d,  d.index, F, F[d.index], colorFont(F[d.index])); 
        return settings.colorScaleFont(F[d.index])
      })
    .selectAll("tspan")
    .data(d => {
      const lines = `${title(d.data)}`.split(/\n/);
      // console.log(lines, title);
      return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
    })
    .join("tspan")
      .attr("x", 0)
      .attr("y", (_, i) => `${i * 1.1}em`)
      .attr("font-weight", (_, i) => i ? null : "regular")
      .text(d => {
        // console.log( d);
        return d});

  return Object.assign(svg.node());
}