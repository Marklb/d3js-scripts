console.log('Starting: example-1');
var d3 = require('d3');

var things = [
  {name: 'Sensor 1', measurement: 96, x: 10, y: 10, r: 5},
  {name: 'Sensor 2', measurement: 68, x: 20, y: 20, r: 5},
  {name: 'Sensor 3', measurement: 83, x: 10, y: 30, r: 5},
  {name: 'Sensor 4', measurement: 35, x: 50, y: 50, r: 5},
  {name: 'Sensor 5', measurement: 79, x: 30, y: 70, r: 5}
];


var margin = {top: 25, right: 25, bottom: 25, left: 50}

var width = 800 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var fullWidth =  width + margin.left + margin.right;
var fullHeight = height + margin.top + margin.bottom;

var xScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, width])

var yScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, height])

var yAxis = d3.axisLeft(yScale);
var xAxis = d3.axisBottom(xScale);

var svg = d3.select('#figure-container')
  .append('svg')
  .attr('width', fullWidth)
  .attr('height', fullHeight)
  .call(responsivefy)
  // .attr('viewBox', `0 0 ${fullWidth}, ${fullHeight}`)
  .append('g')
  .attr('class', 'figure-area')
  .attr('transform', `translate(${margin.left},${margin.top})`);

let zoom = d3.zoom()
  .on('zoom', function(){
    svg.select(".axis.x").call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
    svg.select(".axis.y").call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
    svg.select(".data-area").attr("transform", d3.event.transform);
  });

svg.call(zoom);

var rect = svg.append('rect')
  .attr('class', 'figure-area')
  .attr('width', width)
  .attr('height', height);

svg.append("defs").append("svg:clipPath")
  .attr("id", "clip")
  .append("svg:rect")
  .attr("id", "clip-rect")
  .attr("x", 1)
  .attr("y", 1)
  .attr("width", width-1)
  .attr("height", height-1);

svg.append("g")
  .attr("clip-path", "url(#clip)")
  .append("g")
  .attr("class", "data-area");

svg.append('g')
  .attr('class', 'axis x')
  .attr('transform', `translate(0,${height})`)
  .call(xAxis);

svg.append('g')
  .attr('class', 'axis y')
  .call(yAxis);


// var ellipse = svg.select('.data-area')
//   .append('g')
//   .selectAll('ellipse')
//   .data(things)
//   .enter()
//     .append('ellipse')
//     .attr('class', 'sensor-marker')
//     .attr('cx', function(d, i) { return xScale(d.x); })
//     .attr('cy', function(d, i) { return yScale(d.y); })
//     .attr('rx', function(d, i) { return xScale(d.r); })
//     .attr('ry', function(d, i) { return yScale(d.r); });


var render = () => {
  // .exit().remove()  // removes extra
  svg.select('.data-area')
    .append('g')
    .selectAll('ellipse')
    .data(things)
    .enter()
      .append('ellipse')
      .attr('class', 'sensor-marker')
      .attr('cx', function(d, i) { return xScale(d.x); })
      .attr('cy', function(d, i) { return yScale(d.y); })
      .attr('rx', function(d, i) { return xScale(d.r); })
      .attr('ry', function(d, i) { return yScale(d.r); });
}
render();

function responsivefy(svg) {
  // get container + svg aspect ratio
  var container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style("width")),
    height = parseInt(svg.style("height")),
    aspect = width/height;

  // add viewBox and preserveAspectRatio properties,
  // and call resize so that svg resizes on inital page load
  svg.attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMid")
    .call(resize);

  // to register multiple listeners for same event type,
  // you need to add namespace, i.e., 'click.foo'
  // necessary if you invokde this function for multiple svgs
  // api docs: https://github.com/mbostock/d3/wiki/Selection#on
  d3.select(window).on("resize." + container.attr("id"), resize);

  // get width of container and resize svg to fit it
  function resize() {
    var targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspect));
  }
}
