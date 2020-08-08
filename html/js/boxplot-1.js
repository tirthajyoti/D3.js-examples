const windowWidth = window.innerWidth
const windowHeight = window.innerHeight

const width = windowWidth*0.9
const height = windowHeight*0.7
const margin = {top: 60, bottom: 60, right: 20, left: 50}
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const xTranslate = 80;
const yTranslate = 40;

const boxWidth = 20;

const boxBttn = document.getElementById("bttn-box")
boxBttn.addEventListener("click",boxplot)

function boxplot(){
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

    var xScale = d3.scaleLinear().range ([0, innerWidth]);
    var yScale = d3.scaleLinear().range ([innerHeight,0]);
    var widthScale = d3.scaleLinear().range([15,45])

    d3.csv("data/tweet-boxplot.csv", function(error, data) {
      if (error) {
          throw error;
      }
      dayMax = d3.max(data.map(d => +d.day))+1
      tweetMax = d3.max(data.map(d => d.max))*1.1
      
      xScale.domain([0,dayMax]);
      yScale.domain([0,tweetMax]).nice();
      widthScale.domain(d3.extent(data.map(d => +d.number)))

      const xAxisG = g.append("g")
      .attr("transform", "translate(0," + innerHeight + ")")
      .attr('class','X-Axis')
      .call(d3.axisBottom(xScale)
        .tickFormat(d =>d)
        .tickValues(d3.range(dayMax)));

      // X-axis label
      xAxisG
      .append("text")
      .attr('class','x-Label')
        .attr("y", 45)
        .attr("x", innerWidth/2)
        .attr("text-anchor", "middle")
        .text("Days")

      const yAxisG = g.append("g")
        .attr('class','y-Axis')
        .call(d3.axisLeft(yScale)
          .tickFormat(d => d)
          .tickSize(-innerWidth)
          .ticks(10));

        // Y-axis label
        yAxisG
          .append("text")
          .attr('class','y-Label')
            .attr("transform", "rotate(-90)")
            .attr("y", -xTranslate/2)
            .attr("x",-innerHeight/2)
            .attr("text-anchor", "middle")
            .text("Tweets")
            .style("font-family","verdana")
            
      
      g.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(+d.day)-10; })
         .attr("y", function(d) {
            return (yScale(d.q3));
          })
         .attr("width", boxWidth)
         .attr("height", function(d) { 
           return yScale(d.q1)-yScale(d.q3);})
            .exit()
            .data(data)
            .enter()
        .append("line")
          .attr("class", "median-line")
          .attr("x1",function(d) { return xScale(+d.day)-12; })
          .attr("x2",function(d) { return xScale(+d.day)+12; })
          .attr("y1", d => yScale(d.median))
          .attr("y2", d => yScale(d.median))
            .exit()
            .data(data)
            .enter()
          .append("line")
          .attr("class", "range-line")
          .attr("x1",function(d) { return xScale(+d.day); })
          .attr("x2",function(d) { return xScale(+d.day); })
          .attr("y1", d => yScale(d.q3))
          .attr("y2", d => yScale(d.max))
            .exit()
            .data(data)
            .enter()
          .append("line")
          .attr("class", "range-line")
          .attr("x1",function(d) { return xScale(+d.day); })
          .attr("x2",function(d) { return xScale(+d.day); })
          .attr("y1", d => yScale(d.q1))
          .attr("y2", d => yScale(d.min))
     
      // Chart title
      svg.append('text')
      .text("Boxplot of Tweets")
      .attr("class","chart-title")
      .attr("y",20)
      .attr("x",width/2)
      .attr("text-anchor", "middle")
  });
}