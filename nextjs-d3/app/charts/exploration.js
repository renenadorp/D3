import { useD3 } from "../useD3";

// import {Swatches} from "d3/color-legend"
// import {howto, altplot} from "d3/example-components"
import React, { useContext, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useContainerSize } from "../useContainerSize";
import { MyContext } from "../context";

function Streamgraph(
  data,
  {
    x = ([x]) => x, // given d in data, returns the (ordinal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 20, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xType = d3.scaleUtc, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    zDomain, // array of z-values
    offset = d3.stackOffsetWiggle, // stack offset method
    order = d3.stackOrderInsideOut, // stack order method
    xFormat, // a format specifier string for the x-axis
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    colors = d3.schemeTableau10,
    svg,
  } = {}
) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);

  // Compute default x- and z-domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter((i) => zDomain.has(Z[i]));

  // Compute a nested array of series where each series is [[y1, y2], [y1, y2],
  // [y1, y2], …] representing the y-extent of each stacked rect. In addition,
  // each tuple has an i (index) property so that we can refer back to the
  // original data point (data[i]). This code assumes that there is only one
  // data point for a given unique x- and z-value.
  const series = d3
    .stack()
    .keys(zDomain)
    .value(([x, I], z) => Y[I.get(z)])
    .order(order)
    .offset(offset)(
      d3.rollup(
        I,
        ([i]) => i,
        (i) => X[i],
        (i) => Z[i]
      )
    )
    .map((s) => s.map((d) => Object.assign(d, { i: d.data[1].get(s.key) })));

  // Compute the default y-domain. Note: diverging stacks can be negative.
  if (yDomain === undefined) yDomain = d3.extent(series.flat(2));

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const color = d3.scaleOrdinal(zDomain, colors);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(width / 80, xFormat)
    .tickSizeOuter(0);

  const area = d3
    .area()
    .x(({ i }) => xScale(X[i]))
    .y0(([y1]) => yScale(y1))
    .y1(([, y2]) => yScale(y2));

  svg
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg
    .append("g")
    .selectAll("path")
    .data(series)
    .join("path")
    .attr("fill", ([{ i }]) => color(Z[i]))
    .attr("d", area)
    .append("title")
    .text(([{ i }]) => Z[i]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis)
    .call((g) => g.select(".domain").remove());

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call((g) =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .text(yLabel)
    );

  return Object.assign(svg.node(), { scales: { color } });
}

function Explore() {
  const containerRef = useRef(null);
  const { width, height } = useContainerSize(containerRef);
  const raww = useContext(MyContext);

  const ref = useD3(
    (svg) => {
      svg.selectAll("*").remove();

      if (!raww) return;
      
      
      let raw = raww
      raw = raw.filter(
          (d) =>
            d.country_of_origin !== "" &&
            d.make !== "" &&
            d.model !== "" &&
            d.engine_hp !== "" &&
            d.height_mm !== "" &&
            d.max_speed_km_per_h !== "" &&
            d.max_power_kw !== "" &&
            d.year_from !== ""
        );
        raw.sort(function (a, b) {
          return a.year_from - b.year_from;
        });

        // car company is the category -> scale
        // Get all unique years and car makes
        const years = new Set(raw.map((d) => d.year_from));
        const makes = new Set(raw.map((d) => d.make));

        // Initialize an empty array to hold the data
        let data = [];

        // Loop over all years and car makes
        for (let year of years) {
          for (let make of makes) {
            // Get the count of cars for the current year and make
            const count = raw.filter(
              (d) => d.year_from === year && d.make === make
            ).length;

            // Push the data point to the array
            data.push({
              x: year,
              y: count,
              z: make,
            });
          }
        }
      Streamgraph(data, {
        x: (d) => d.x,
        y: (d) => Math.floor(d.y),
        z: (d) => d.z,
        yLabel: "Models made per year",
        width: width,
        height: height,
        svg: svg,
      });
    },
    [width, height]
  );

  return (
    <div ref={containerRef} className="w-full aspect-square">
      <svg
        ref={ref}
        style={{
          height: height,
          width: width,
          marginRight: "0px",
          marginLeft: "0px",
        }}
      />
    </div>
  );
}

export default Explore;
