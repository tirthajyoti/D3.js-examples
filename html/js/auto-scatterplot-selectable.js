// Data URL
const dataURL = "https://raw.githubusercontent.com/tirthajyoti/D3.js-examples/master/html/data/auto-mpg.csv"; 
// Window info
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
// Chart geometry and location
const width = windowWidth*0.9;
const height = windowHeight*0.9;
const margin = {top: 50, bottom: 100, right: 70, left: 60};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const xTranslate = 80;
const yTranslate = 60;
// Chart parameters
//const chartTitle = "MPG vs. horsepower";
const circleRadius = 10;
const tickPadding = 10;

// Main function
function scatterplot(){
  const xLabel = "horsepower";
  const yLabel = "mpg";

  xvar = 'mpg';
  yvar = 'mpg';

  // Tooltip div
    tooltip = d3.select('#viz').append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

    // Scale definitions (just the range, no domain yet)
    var xScale = d3.scaleLinear().range ([0,innerWidth]);
    var yScale = d3.scaleLinear().range ([innerHeight,0]);

    d3.csv(dataURL, function(error, data) {
      if (error) {
          throw error;
      }         
      variables =  Object.keys(data[0]).slice(0,6);

      d3.select('#xvarselect')
        .selectAll('option')
        .data(variables)
        .enter()
        .append('option')
        .attr('value', function(d){return d.toString()})
        .text(function(d){return d.toString()});

      d3.select('#yvarselect')
        .selectAll('option')
        .data(variables)
        .enter()
        .append('option')
        .attr('value', function(d){return d.toString()})
        .text(function(d){return d.toString()});

      xvarChange = function(){
        xvar = d3.select(this).node().value;
        render(xvar, yvar);
      }

      yvarChange = function(){
        yvar = d3.select(this).node().value;
        render(xvar, yvar);
      }

    render(xvar,yvar);

    function render(xvar,yvar) {

      // Removing the SVG before redrawing
      d3.select("#viz")
        .select("svg")
        .remove()

      svg = d3.select("#viz")
        .append("svg")
        .attr("width",width+"px")
        .attr("height",height+"px")
        .attr("class","svg-container");
      
      var g = svg.append("g")
              .attr("transform", "translate(" + xTranslate + "," + yTranslate + ")");

      // Tooltip div
      tooltip = d3.select('#viz').append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

        xScale.domain([0,d3.max(data, d => +d[xvar])]).nice();
        yScale.domain([0,d3.max(data, d => +d[yvar])]).nice();

        function showData(d){
        // Set the text
        tipText = xvar +': '+ (d[xvar]).toString() + '<br>'+ yvar +': '+ (d[yvar]).toString();
        // Set the tooltip div position and opacity
        tooltip
            .html(tipText)
            .style("left", (d3.event.pageX + 2*circleRadius) + "px")
            .style("top", (d3.event.pageY - 20) + "px")
            .transition()
            .duration(200) // ms
            .style("opacity", .9) // started as 0

        d3.select(this)
          .transition()
          .duration(250)
          .attr('r',circleRadius*2)
          .style('opacity',1.0)
          .style('fill','darkviolet');
      }

      function hideData(d){
        tooltip.transition()
                      .duration(300) // ms
                      .style("opacity", 0);
        
        d3.select(this)
          .transition()
          .duration(250)
          .attr('r',circleRadius)
          .style('fill','red')
          .style('opacity',0.5);
      }

      xScale.domain([0,d3.max(data, d => +d[xvar])]).nice();
      yScale.domain([0,d3.max(data, d => +d[yvar])]).nice();

      const xAxisG = g.append("g")
      .attr("transform", "translate(0," + innerHeight + ")")
      .attr('class','x-Axis')
      .call(d3.axisBottom(xScale)
      .tickPadding(tickPadding)
      .ticks(15));

      // X-axis label
      xAxisG
        .append("text")
          .attr('class','x-Label')
          .attr("y", yTranslate+tickPadding)
          .attr("x", innerWidth/2)
          .attr("text-anchor", "middle")
          .text(xvar);

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
          .text(yvar);
      
      // Adding the circles
      g.selectAll("circle")
         .data(data)
         .enter()
         .append("circle")
            .attr("class", "scatter")
            .attr("cx", function(d) { return xScale(+d[xvar]); })
            .attr("cy", function(d) { return yScale(+d[yvar]); })
            .attr("r", circleRadius)
            .on('mouseover', showData)
            .on('mouseout', hideData);
      
      function changeRadius(){
        c = d3.select(this)
        c.attr('r',20);
      }
      
      // Chart title
      chartTitle = 'Plot of ' + xvar + ' vs. ' + yvar
      svg.append('text')
        .text(chartTitle)
        .attr("class","chart-title")
        .attr("y",yTranslate/2)
        .attr("x",width/2)
        .attr("text-anchor", "middle");

      }; // end 'render'

      d3.select('#xvarselect')
        .on('change',xvarChange);
      d3.select('#yvarselect')
        .on('change',yvarChange);
  }); //End `d3.csv` callback
} //End `scatterplot`
