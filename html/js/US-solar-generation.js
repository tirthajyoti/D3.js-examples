const windowWidth = window.innerWidth
const windowHeight = window.innerHeight

const width = windowWidth*0.9
const height = windowHeight*0.7
const margin = {top: 60, bottom: 60, right: 20, left: 50}
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const xTranslate = 70;
const yTranslate = 40;

const barBttn = document.getElementById("bttn-bar")
barBttn.addEventListener("click",barchart)

function barchart(){
  // Checking X-label, Y-label inputs
  xLabel = document.getElementById("x-label").value
  yLabel = document.getElementById("y-label").value

  if (xLabel.length===0){
    xLabel = "Year"
  }
  if (yLabel.length===0){
    yLabel = "Solar generation (Billion kWh)"
  }
  
  // Removing the SVG before redrawing
    d3.select("#viz")
      .select("svg")
      .remove()

    d3.select("#viz")
      .append("svg")
      .attr("width",width+"px")
      .attr("height",height+"px")
      .attr("class","svg-container");
    
    var svg = d3.select("svg")
  
    var g = svg.append("g")
    .attr("transform", "translate(" + xTranslate + "," + yTranslate + ")");

    var xScale = d3.scaleBand().range ([innerWidth,0]).padding(0.25);
    // Here the yScale range is reversed because the data is itself reversed 
    var yScale = d3.scaleLinear().range ([innerHeight, 0]);

    d3.csv("data/US-solar-data-by-year.csv", function(error, data) {
      if (error) {
          throw error;
      }
      xScale.domain(data.map(function(d) { return d.Year; }));
      yScale.domain([0, d3.max(data, function(d) { return +d.Quantity; })]);

      const xAxisG = g.append("g")
      .attr("transform", "translate(0," + innerHeight + ")")
      .style("font-size","14px")
      .call(d3.axisBottom(xScale));

      // X-axis label
      xAxisG
      .append("text")
        .attr("y", 40)
        .attr("x", innerWidth/2)
        .attr("text-anchor", "middle")
        .attr("stroke", "black")
        .text(xLabel)
        .style("font-family","verdana")
        .style("fill",'black');

      const yAxisG = g.append("g")
        .style("font-size","14px")
        .call(d3.axisLeft(yScale)
          .tickFormat(d =>d/1000)
          .tickSize(-innerWidth)
          .ticks(15));

        // Y-axis label
        yAxisG
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -xTranslate/2)
            .attr("x",-innerHeight/2)
            .attr("text-anchor", "middle")
            .attr("stroke", "black")
            .text(yLabel)
            .style("font-family","verdana")
            .style("fill",'black')
      
      g.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.Year); })
         .attr("y", function(d) { return yScale(+d.Quantity); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return innerHeight - yScale(+d.Quantity);});

      // Min and Max year for the chart title
      minYear = d3.min(data.map(d => +d.Year))
      maxYear = d3.max(data.map(d => +d.Year))
      
      // Chart title
      svg.append('text')
      .text("US solar generation by year ("+minYear+" - "+ maxYear + ")")
      .attr("class","chart-title")
      .attr("y",20)
      .attr("x",width/2)
      .attr("text-anchor", "middle")
  });
}



