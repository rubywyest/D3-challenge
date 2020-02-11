// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
  
// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      // console.log("here is the data:", data);
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.spokes = +data.smokes;
      data.abbr = data.abbr;
      data.income = +data.income;
    });
    healthData2 = [];
    var test = 'Y';
    healthData.forEach(function(data) {
      if (test == 'Y') {
        healthData2.push(data);  
        test = 'N'
      } else {
        test = 'Y'
      }
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, (d3.max(healthData, d => d.poverty) + 1)])
      .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, (d3.max(healthData, d => d.healthcare) + 1)])
      .range([chartHeight, 0]);

    // Step 3: Create axis functions

    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    // Step 4: Append Axes to the chart
    // ==============================
     chartGroup.append("g")
       .attr("transform", `translate(0, ${chartHeight})`)
       .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "green")
      .attr("opacity", ".5");

      chartGroup.select("g")
      .selectAll("circle")
      .data(healthData)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .attr('dy', -415)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "black");
 
    console.log("Step 1", healthData);
    console.log("Step 1", healthData2);
    
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Poverty: ${d.poverty}<br>Health Care: ${d.healthcare}`);
      });

    // // Step 7: Create tooltip in the chart
    // // ==============================
    chartGroup.call(toolTip);

    // // Step 8: Create event listeners to display and hide the tooltip
    // // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    // console.log("Step 1", healthData);

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare(%)");

     chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty(%)");
    
      
  }).catch(function(error) {
    console.log(error);
  });


     //circlesGroup
    //.on('mouseover', function(data) {
     // toolTip.text(d=> d.abbr);