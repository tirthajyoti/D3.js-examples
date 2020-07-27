// Data URL
const dataURL = "data/temperature-in-san-francisco.csv"; 
// Window info
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
// Chart geometry and location
const width = windowWidth*0.9;
const height = windowHeight*0.7;
const margin = {top: 60, bottom: 70, right: 40, left: 70};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const xTranslate = 80;
const yTranslate = 50;
// Chart parameters
const chartTitle = "San Francisco temperature over a week";
const circleRadius = 7;
const tickPadding = 10;

// Button message
const bttnMessage = "Display the line chart";

// Button event
const lineBttn = document.getElementById("bttn-line");
lineBttn.addEventListener("click",linechart);

const smoothCurve = document.getElementById('smooth-curve');
const showMarker = document.getElementById('show-marker');

smoothCurve.addEventListener("click",bttnDisplayChange)
showMarker.addEventListener("click",bttnDisplayChange)

function bttnDisplayChange(){
  lineBttn.innerHTML= "Redraw the plot?";
}

// Main function
function linechart(){
  // Checking X-label, Y-label inputs
  let xLabel = document.getElementById("x-label").value;
  let yLabel = document.getElementById("y-label").value;

  if (xLabel.length===0){
    xLabel = "Day/Time";
  }
  if (yLabel.length===0){
    yLabel = "Temperature (C)";
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
    
    var svg = d3.select("svg");
  
    var g = svg.append("g")
    .attr("transform", 
    "translate(" + xTranslate + "," + yTranslate + ")");

    // Scale definitions (just the range, no domain yet)
    var xScale = d3.scaleTime().range ([0,innerWidth]);
    var yScale = d3.scaleLinear().range ([innerHeight,0]);

    // Value-mappings definition (from the dataset)
    const xValue = d => new Date(d.timestamp);
    const yValue = d => +d.temperature;

    d3.csv(dataURL, function(error, data) {
      if (error) {
          throw error;
      }     
      // Extra margins beyond the min/max range of data
      let minMargin = 1;
      let maxMargin = 1;
      // Adding domain to the scales
      
      xScale.domain(d3.extent(data, xValue)).nice();
      yScale.domain(d3.extent(data, yValue)).nice();

      const xAxisG = g.append("g")
      .attr("transform", "translate(0," + innerHeight + ")")
      .attr('class','y-Axis')
      .call(d3.axisBottom(xScale)
      .tickPadding(tickPadding)
      .ticks(15));

      // X-axis label
      xAxisG
      .append("text")
      .attr('class','x-Label')
        .attr("y", yTranslate+10+tickPadding)
        .attr("x", innerWidth/2)
        .attr("text-anchor", "middle")
        .text(xLabel);

      const yAxisG = g.append("g")
        .attr('class','y-Axis')
        .call(d3.axisLeft(yScale)
          .tickFormat(d =>d)
          .tickPadding(tickPadding)
          .tickSize(-innerWidth)
          .ticks(10));

        // Y-axis label
        yAxisG
          .append("text")
          .attr('class','y-Label')
            .attr("transform", "rotate(-90)")
            .attr("y", -xTranslate/2-tickPadding)
            .attr("x",-innerHeight/2)
            .attr("text-anchor", "middle")
            .text(yLabel)
            .style("font-family","verdana");
      
      // The line generator
      // Add d3.curveBasis if 'smooth-curve' is checked      
      if (smoothCurve.checked){
        lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(d3.curveBasis);
      } else {
        lineGenerator = d3.line()
          .x(d => xScale(xValue(d)))
          .y(d => yScale(yValue(d)));}

        g.append('path')
          .attr('class', 'line-path')
          .attr('d', lineGenerator(data));
      
    // Turning on the markers
      if (showMarker.checked){
        g.selectAll(".scatter")
          .data(data)
          .enter().append("circle")
          .attr("class", "markers")
          .attr("cx", function(d) { return xScale(new Date(d.timestamp)); })
          .attr("cy", function(d) { return yScale(+d.temperature); })
          .attr("r", circleRadius);
      }

      // Chart title
      svg.append('text')
      .text(chartTitle)
      .attr("class","chart-title")
      .attr("y",yTranslate/2)
      .attr("x",width/2)
      .attr("text-anchor", "middle");
  }); //End `d3.csv` callback

  lineBttn.innerHTML= bttnMessage;
} //End `scatterplot`