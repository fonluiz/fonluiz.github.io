var
  margin = {top: 20, right: 20, bottom: 110, left: 40},
  margin2 = {top: 430, right: 20, bottom: 30, left: 40},
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom,
  height2 = 500 - margin2.top - margin2.bottom;

var svg = d3.select("#pairedBarChart")
  .append("svg")
  .attr('version', '1.1')
  .attr('viewBox', '0 0 '+(width + margin.left + margin.right)+' '+(height + margin.top + margin.bottom))
  .attr('width', '100%');
  g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("#pairedBarChart").append("div")
  .attr("class", "tooltip")
  .style("opacity", 1);

var x = d3.scaleBand()
                .rangeRound([0, width])
                .padding(0.3)
                .align(0.3);

var yUp = d3.scaleLinear()
                .rangeRound([height/2, 0]);

var yDown = d3.scaleLinear()
                .rangeRound([height/2, height]);

var z = d3.scaleOrdinal(["#1BC0A2", "#C01B5A"]);

var xAxis = d3.axisBottom(x)
                      .tickSize(0)
                      .tickPadding(6);

var yUpAxis = d3.axisLeft(yUp);
var yDownAxis = d3.axisLeft(yDown);

d3.csv("frequencia.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.letra; }));
  yUp.domain([0, d3.max(data, function(d) { return d.pt; })]).nice();
  yDown.domain([0, d3.max(data, function(d) { return d.pt; })]).nice();
  z.domain(data.columns.slice(1));

   var bars = g.selectAll(".serie")
    .data(data)
    .enter();

    bars.append("rect")
      .attr("class", "serie")
      .attr("fill", function(d) { return z("pt"); })
      .attr("x", function(d) { return x(d.letra); })
      .attr("y", function(d) { return yUp(d.pt); })
      .attr("height", function(d) { return Math.abs(yUp(d.pt) - yUp(0));  })
      .attr("width", x.bandwidth())
      .on("mouseover", function(d) {
        var frequencia = ('pt-br:</label> <span>' + d.pt);
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(
          '<label>Frequência '+ frequencia +'%</span>'
        )
          .style("left", (d3.event.pageX - 2 * margin.left) + "px")
          .style("top", (d3.event.pageY) + "px");
      });

      bars.append("rect")
      .attr("class", "serie")
      .attr("fill",  function(d) { return z("frequencia"); })
      .attr("x", function(d) { return x(d.letra); })
      .attr("y", function(d) { return yDown(0); })
      .attr("height", function(d) { return Math.abs(yDown(d.frequencia) - yDown(0)); })
      .attr("width", x.bandwidth())
      .on("mouseover", function(d) {
        var frequencia = ('aleatória:</label> <span>'  + d.frequencia);
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(
          '<label>Frequência '+ frequencia +'%</span>'
        )
          .style("left", (d3.event.pageX - 2 * margin.left) + "px")
          .style("top", (d3.event.pageY) + "px");
      });

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + yUp(0) + ")")
      .style("font", "14px sans-serif")
      .call(xAxis)

  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," + (height + margin.bottom - 55) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "#000")
      .text("Letra");

  g.append("g")
      .attr("class", "axis axis--y")
      .style("font", "14px sans-serif")
      .call(yUpAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("font-size", "14")
      .attr("dy", "0.01em")
      .attr("text-anchor", "middle")
      .attr("fill", "#000")
      .text("Frequência relativa");

  g.append("g")
      .attr("class", "axis axis--y")
      .style("font", "14px sans-serif")
      .call(yDownAxis);

  var legend = g.selectAll(".legend")
    .data(["Textos Aleatórios", "Língua Portuguesa"])
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(-" + margin.right * 10 + ", " + i * 20 + ")"; })
      .style("font", "14px sans-serif");

  legend.append("rect")
      .attr("x", width + 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width + 44)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .text(function(d) { return d; });
});

function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}