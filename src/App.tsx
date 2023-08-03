import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./App.css";

interface DataItem {
  name: string;
  value: number;
}

interface DataVisualizationProps {
  data: DataItem[];
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Define the dimensions of the chart
  const width = 500;
  const height = 300;
  const margin = { top: 60, right: 80, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    // D3 code for creating the bar chart
    const svg = d3.select(svgRef.current);

    // Create x and y scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)!])
      .range([innerHeight, 0]);

    // Create axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).ticks(5);

    svg
      .select<SVGGElement>(".x-axis")
      .attr("transform", `translate(40, ${innerHeight})`)
      .call(xAxis);

    // Add a little bottom padding to the y-axis text
    svg
      .select<SVGGElement>(".y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    // Create and update bars with transitions
    const bars = svg.selectAll<SVGRectElement, DataItem>(".bar").data(data);

    bars.exit().remove();

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => margin.left + x(d.name)!)
      .attr("y", innerHeight)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", "url(#gradient)")
      .attr("rx", 8)
      .merge(bars)
      .transition()
      .duration(600)
      .attr("x", (d) => margin.left + x(d.name)!)
      .attr("y", (d) => y(d.value)!)
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.value)!);
  }, [data, innerHeight, margin.left, innerWidth]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      <defs>
        <linearGradient id="gradient" gradientTransform="rotate(90)">
          <stop offset="0%" stopColor="#4682B4" />
          <stop offset="100%" stopColor="#1E90FF" />
        </linearGradient>
      </defs>
      <g className="y-axis" />
      <g className="x-axis" />
    </svg>
  );
};

export default function App() {
  const data: DataItem[] = [
    { name: "A", value: 130 },
    { name: "B", value: 235 },
    { name: "C", value: 135 },
    { name: "D", value: 34 },
    { name: "E", value: 246 },
  ];
  return (
    <div className="App">
      <h1>Data Visualization</h1>
      <DataVisualization data={data} />
    </div>
  );
}
