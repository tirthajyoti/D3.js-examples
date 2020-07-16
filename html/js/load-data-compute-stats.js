// Variables
    localStorage.clear()
    var numList = []
    var readingDone = false
    var bttnText = "Click to compute stats...";
    // An object of stats
    var statsArr = {
                    Min: 0, 
                    Max:0, 
                    Mean:0,
                    Median: 0,
                    Range: 0,
                    Var: 0, 
                    StdDev: 0
                    }
   
    // Data reading function (click event)
    function readData()
    {
        numList = []
        dataurl = "https://raw.githubusercontent.com/tirthajyoti/D3.js-examples/master/data/data-1.csv"

        data = d3.csv(dataurl, loadData);
        readingDone = true
    }

    // Actual data loading function
    function loadData(data)
    {
        for (var i = 0; i < data.length; i++) 
        {
            numList.push(parseFloat(data[i].num))
        }

        d3.select("#loadDataStatus")
            .style("background-color", "orange")
            .text("Loading...(this artificial delay is just for fun, of course!)")
        
        setTimeout(printLoadStatus, 2000);
    }

    function printLoadStatus()
    {
        // Print a loading finished message
        d3.select("#loadDataStatus")
            .style("background-color", "lightgreen")
            .text("Loading finished. The file had " + numList.length + " data points.")
    }

    // Compute stats function
    function computeStats()
    {
        // Check if the data loading is done
        if (readingDone!== true){
            alert("Please load the data first!")
            return;
        }

        statsArr['Min'] = d3.min(numList)
        statsArr['Max'] = d3.max(numList)
        statsArr['Mean'] = d3.mean(numList).toFixed(3)
        statsArr['Median'] = d3.median(numList)
        statsArr['Range'] = d3.range(numList)
        statsArr['Var'] = parseFloat(d3.variance(numList)).toFixed(3)
        statsArr['StdDev'] = Math.sqrt(d3.variance(numList)).toFixed(3)
        
        // Remove the ul tag if there is any
        d3.select("ul")
        .remove()
        
        // Add an ul tag
        d3.select(".items")
        .append("ul")
        .attr("id","the-list")
        .style("font-family","Times")

        // Add li elements to the ul with various stats
        d3.select("#the-list")
        .append("li")
        .text("Minimum: "+ statsArr['Min'])

        d3.select("#the-list")
        .append("li")
        .text("Maximum: "+ statsArr['Max'])

        d3.select("#the-list")
        .append("li")
        .text("Mean: "+ statsArr['Mean'])

        d3.select("#the-list")
        .append("li")
        .text("Median: "+ statsArr['Median'])

        d3.select("#the-list")
        .append("li")
        .text("Range: "+ statsArr['Range'])

        d3.select("#the-list")
        .append("li")
        .text("Variance: "+ statsArr['Var'])

        d3.select("#the-list")
        .append("li")
        .text("Std. deviation: "+ statsArr['StdDev'])
     
        /* 
        Selecting the 'Clean up' button by first selecting the div class 
        and then selecting the button tag. No special class or id 
        is used for this 'Clean up' button.
        */
        d3.select(".items")
        .select("button")
        .remove()

        /* 
        Add the 'Clean up' button.
        Note it also sets the attribute `onclick` to `cleanUp()` function.
        */
        d3.select(".items")
        .append("button")
        .text("Clean up the list")
        .attr("onclick","cleanUp()")
    }

    // Reset (clean up) function
    function cleanUp()
    {
        // Remove the whole ul element
        d3.select("#the-list")
        .remove()
        
        // Remove the clean up button
        d3.select(".items")
        .select("button")
        .remove()

        // Change the top text
        d3.select("#header-p")
        .text("Stats cleaned up! Click on the button below to compute again.")
        .style("background-color","#FFFFFF")

        // Reset the main button text
        d3.select("#mainBttn")
        .text(bttnText)
    }