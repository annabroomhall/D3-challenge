// @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }

    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = 960;
    var svgHeight = 620;

    var margin = {
      top: 50,
      bottom: 50,
      right: 50,
      left: 50
    };

    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    // Append SVG element
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);

    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var states

    // Read CSV
    d3.csv("/assets/data/data.csv").then(function(data) {
      console.log(data)

        // parse data
        data.forEach(function(data) {
          data.poverty = +data.poverty;
          data.age = +data.age;
          data.income = +data.income;
          data.healthcare = +data.healthcare;
          data.obesity = +data.obesity;
          data.smokes = +data.smokes;
        });

        // create scales
        var xLinearScale = d3.scaleLinear()
          .domain([8, d3.max(data, d => d.poverty)+1])
          .range([0, width]);

        var yLinearScale = d3.scaleLinear()
          .domain([4, d3.max(data, d => d.healthcare)+2])
          .range([height, 0]);

        // create axes
        var xAxis = d3.axisBottom(xLinearScale).ticks(5);
        var yAxis = d3.axisLeft(yLinearScale).ticks(15);

        // append axes
        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis);

        chartGroup.append("g")
          .call(yAxis);

          // append circles
        var circlesGroup = chartGroup.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", d => xLinearScale(d.poverty))
          .attr("cy", d => yLinearScale(d.healthcare))
          .attr("r", "15")
          .attr("opacity", ".5")
          .classed('stateCircle', true)
          
          // append text, apply classes, dy
          var textGroup = chartGroup.selectAll('.stateText')
          .data(data)
          .enter()
          .append('text')
          .classed('stateText', true)
          .attr('x', d => xLinearScale(d.poverty))
          .attr('y', d => yLinearScale(d.healthcare))
          .attr('dy', 3)
          .attr('font-size', '10px')
          .text(function(d){return d.abbr});


          // append y axis
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

        // append x axis
        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .attr("x", 0)
        .attr("y", 10)
        .attr("dy", "1em")
        .classed("active", true)
        .text("In Poverty (%)");

        // Step 1: Initialize Tooltip
         var toolTip = d3.tip()
           .attr("class", "d3-tip")
           .offset([-10, -90])
           .html(function(d) {
             return ("<h5>" + d.state + " (" + d.abbr + ")</h5><p> In Poverty Rate: " + d.poverty + "% </p><p> Lacking Healthcare Rate: " + d.healthcare + "% </p>");
           });

    //     // Step 2: Create the tooltip in chartGroup.
         chartGroup.call(toolTip);

    //     // Step 3: Create "mouseover" event listener to display tooltip - added to text rather than circles themselves
          textGroup.on("mouseover", function(d) {
           toolTip.show(d, this);
         })
    //     // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(d) {
              toolTip.hide(d);
            });
       }).catch(function(error) {
         console.log(error);
      });
  }

  // When the browser loads, makeResponsive() is called.
  makeResponsive();

  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
