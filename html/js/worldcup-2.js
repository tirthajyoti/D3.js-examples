/*
`createSoccerViz()` loads with the page, pulls the data,
and calls the  `loadData` function.

The `loadData` functions simply stores the data 
in a local variable `incomingData`.

Then the individual button click event loads respective functions,
which work on that `incomingData`.
*/

var incomingData = []

let winBttn = document.getElementById("bttn-wins")
let lossBttn = document.getElementById("bttn-loss")

winBttn.addEventListener("click",showWins)
lossBttn.addEventListener("click",showLoss)

function createSoccerViz() {

    d3.csv("data/worldcup.csv", data =>
    {loadData(data)})} // End `createSoccerViz`

function loadData(data){
    incomingData = data
}

function showWins() {
    
    // Removing the SVG before redrawing
    d3.select("#viz")
    .select("svg")
    .remove()
    
    // (Re)draw the SVG
    d3.select("#viz")
    .append("svg")
    .attr("width","800px")
    .attr("height","150px")
    .style("border","1px")
    .style("border","solid")
    .style("border-color","black")
    .style("background-color","lightgray")
    
    // Append a group `overallG`
    d3.select("svg")
    .append("g")
    .attr("id", "teamsG")
    .attr("transform", "translate(70,70)")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "overallG")
    .attr("transform", (d, i) =>"translate(" + (i * 90) + ", 0)")

// Selecting the 'overallG' group    
var teamG = d3.selectAll("g.overallG");

/* 
Appending circles of radius proportional to the number of wins.
Note the transition, delay, and duration functions to add a pulsating effect.
First, with a delay, we draw a large circle.
Then, we transition into a smaller circle.
The transition duration is 600 ms.
*/
teamG
    .append("circle")
    .attr("r", 0)
    .style("fill","red")
    .transition()
    .delay((d, i) => i * 300)
    .duration(600)
    .attr("r", d => 8*d.win)
    .transition()
    .duration(600)
    .attr("r", d => 5*d.win)
    .style("fill","red")

// Appending text from the team names' data    
teamG
    .append("text")
    .transition()
    .delay((d, i) => 500 + i * 300)
    .attr("y", 50)
    .attr("x", -30)
    .text(d => d.team)

// Appending text from the teams' win    
teamG
    .append("text")
    .transition()
    .delay((d, i) => 500 + i * 300)
    .attr("y", 0)
    .attr("x", -5)
    .text(d => d.win)
    .style('fill', 'yellow')
} // End `showWins`

function showLoss() {
    
    d3.select("#viz")
    .select("svg")
    .remove()
    
    d3.select("#viz")
    .append("svg")
    .attr("width","800px")
    .attr("height","150px")
    .style("border","1px")
    .style("border","solid")
    .style("border-color","black")
    .style("background-color","lightgray")
    
    d3.select("svg")
    .append("g")
    .attr("id", "teamsG")
    .attr("transform", "translate(70,70)")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "overallG")
    .attr("transform", (d, i) =>"translate(" + (i * 90) + ", 0)")

// Selecting the 'overallG' group    
var teamG = d3.selectAll("g.overallG");

teamG
    .append("circle")
    .attr("r", 0)
    .style("fill","red")
    .transition()
    .delay((d, i) => i * 300)
    .duration(600)
    .attr("r", d => 15+8*d.loss)
    .transition()
    .duration(600)
    .attr("r", d => 15+5*d.loss)
    .style("fill","red")

// Appending text from the team names' data    
teamG
    .append("text")
    .transition()
    .delay((d, i) => 500 + i * 300)
    .attr("y", 50)
    .attr("x", -30)
    .text(d => d.team)

// Appending text from the teams' win    
teamG
    .append("text")
    .transition()
    .delay((d, i) => 500 + i * 300)
    .attr("y", 0)
    .attr("x", -5)
    .text(d => d.loss)
    .style('fill', 'yellow')
} // End `showWins`



