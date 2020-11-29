// set the dimensions and margins of the graph
var margin = {
    top: 10,
    right: 30,
    bottom: 80,
    left: 60
  },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("../book2.csv", function (data) {

  // group the data: I want to draw one line per group
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function (d) {
      return d.Country;
    })
    .entries(data);


  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function (d) {
      return d.Year;
    }))
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));
  // text label for the x axis
  svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top + 40) + ")")
    .style("text-anchor", "middle")
    .text("Année");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([16, 4 + Math.ceil(d3.max(data, function (d) {
      return +d.AverageTemperature;
    }))])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 5)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Temperature");

  // color palette
  var res = sumstat.map(function (d) {
    return d.key
  }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'])

  // Draw the line
  svg.selectAll(".line")
    .data(sumstat)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", function (d) {
      return color(d.key)
    })
    .attr("stroke-width", 1.5)
    .attr("d", function (d) {
      return d3.line()
        .x(function (d) {
          return x(d.Year);
        })
        .y(function (d) {
          return y(+d.AverageTemperature);
        })
        (d.values)
    })
  var legend_keys = [sumstat[0].key, sumstat[1].key, sumstat[2].key, sumstat[3].key, sumstat[4].key]
  var lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
    .enter().append("g")
    .attr("class", "lineLegend")
    .attr("transform", function (d, i) {
      return "translate(" + (width - 50) + "," + (i * 20) + ")";
    });

  lineLegend.append("text").text(function (d) {
      return d;
    })
    .attr("transform", "translate(15,9)"); //align texts with boxes

  lineLegend.append("rect")
    .attr("fill", function (d, i) {
      return color(d);
    })
    .attr("width", 10).attr("height", 10);

})