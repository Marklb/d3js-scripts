console.log('Starting: example-2');
var d3 = require('d3');
const mathjs = require('mathjs');
// const MbDNDODatasets = require('mb-dndo-datasets');
// let dndoDatasets = new MbDNDODatasets();
// let datasets = null;
// dndoDatasets.readDatasets(() => {
//   console.log('Done loading datasets');
//   datasets = dndoDatasets.getDatasets();
//   console.log(datasets);
// });
//
//
// // let datasetName = 'Outdoor_C11';
// let datasetName = 'LSI_C_03';
// let datasetsList = dndoDatasets.getDatasets();
// console.log(datasetsList);
// datasetObj = null;
// for(let ds of datasetsList){
//   console.log('Name: '+ds.getName());
//   if(ds.getName() == datasetName){
//     datasetObj = ds;
//     break;
//   }
// }

const RES_DIR = 'I:/Work/Research/dndo/nodejs/detection-scripts';
const MARKER_IMAGE_URLS = {
  // 'DETECTOR_ICON': `${RES_DIR}/res/imgs/detectorIcon.png`
  'DETECTOR_ICON': `${RES_DIR}/res/imgs/detectorIconOrange.png`
};

const MbDNDODatasets = require('mb-dndo-datasets');
let dndoDatasets = new MbDNDODatasets();
let datasetsList = null;
let dsName = 'LSI_C_01';
// let dsName = 'LSI_C_03';
let win_size = 5;
let radius = 100;
const dsPath = `I:/Work/Research/dndo/datasets/canonical-datasets-master/${dsName}`;
var datasetObj = null;
dndoDatasets.readDataset(dsPath, () => {
  console.log('Done loading datasets 2');
  datasetsList = dndoDatasets.getDatasets();
  console.log(datasetsList);
  datasetObj = dndoDatasets.getDatasets()[0];
  start();
});

var start = () => {
let run = 1;

let detectors = datasetObj.getDetectors(run);
// console.log(detectors);
let avgDetectorLocations = {};
for(let key in detectors){
  let det = detectors[key];
  // console.log(det);
  let locs = det.getLocations(run);
  // console.log(locs);
  avgDetectorLocations[det.getId()] = {};
  avgDetectorLocations[det.getId()].detector = det.getId();
  avgDetectorLocations[det.getId()].x = mathjs.mean(locs.x);
  avgDetectorLocations[det.getId()].y = mathjs.mean(locs.y);
}
console.log(avgDetectorLocations);



//
let detectorMarkers = [];
let detectorImgMarkers = [];
let detectorLabels = [];
// for(let i = 0; i < detLocs.length; i++){
for(let i in avgDetectorLocations){
  let det = avgDetectorLocations[i];
  detectorMarkers.push({
    'class': 'detectorMarker',
    'x': det.x,
    'y': det.y,
    'detNum': det.detector,
    'r': 3
  });
  detectorImgMarkers.push({
    'x': det.x,
    'y': det.y,
    'width': 15,
    'height': 15,
    'xlink:href': MARKER_IMAGE_URLS.DETECTOR_ICON,
    'detNum': det.detector,
  });
  detectorLabels.push({
    'class': 'detectorLabel',
    'x': det.x,
    'y': det.y,
    'x-offset': 5,
    'y-offset': 1,
    'label': `${det.detector}`,
    'detNum': det.detector,
    'r': 3
  });
}
console.log(detectorMarkers);

// Set the source markers
let srcLocs = datasetObj.getSourceLocations(run);
let sourceMarkers = [];
if(srcLocs){
  // console.log('Src locs');
  // console.log(srcLocs);
  for(let i = 0; i < srcLocs.x.length; i++){
    sourceMarkers.push({
      'class': 'sourceMarker',
      'x': srcLocs.x[i],
      'y': srcLocs.y[i],
      // 'label': `Source: time: ${srcLocs[i].ts}`,
      // 'timestep': srcLocs[i].ts,
      'label': `Source: time: ${i+1}`,
      'timestep': i+1,
      'r': 3
    });
  }
}
console.log(sourceMarkers);

//
//
//
let xDomain = null;
let yDomain = null;
if(datasetObj.getName() == 'Outdoor_C11--'){
  xDomain = [100, 18800];
  yDomain = [-500, 13000];
}else{
  let xMinVals = [d3.min(detectorImgMarkers, function(d){return d['x'];})];
  let xMaxVals = [d3.max(detectorImgMarkers, function(d){return d['x'];})];

  let yMinVals = [d3.min(detectorImgMarkers, function(d){return d['y'];})];
  let yMaxVals = [d3.max(detectorImgMarkers, function(d){return d['y'];})];

  if(sourceMarkers){
    xMinVals.push(d3.min(sourceMarkers, function(d){return d['x'];}));
    xMaxVals.push(d3.max(sourceMarkers, function(d){return d['x'];}));
    yMinVals.push(d3.min(sourceMarkers, function(d){return d['y'];}));
    yMaxVals.push(d3.max(sourceMarkers, function(d){return d['y'];}));
  }

  xDomain = [d3.min(xMinVals),d3.max(xMaxVals)];
  yDomain = [d3.min(yMinVals),d3.max(yMaxVals)];
}
console.log(xDomain);
console.log(yDomain);





















var things = [
  {name: 'Sensor 1', measurement: 96, x: 10, y: 10, r: 5},
  {name: 'Sensor 2', measurement: 68, x: 20, y: 20, r: 5},
  {name: 'Sensor 3', measurement: 83, x: 10, y: 30, r: 5},
  {name: 'Sensor 4', measurement: 35, x: 50, y: 50, r: 5},
  {name: 'Sensor 5', measurement: 79, x: 30, y: 70, r: 5}
];


var margin = {top: 25, right: 25, bottom: 25, left: 50}

var width = 700 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var fullWidth =  width + margin.left + margin.right;
var fullHeight = height + margin.top + margin.bottom;

var xScale = d3.scaleLinear()
  .domain(xDomain)
  .range([0, width])

var yScale = d3.scaleLinear()
  .domain(yDomain)
  .range([0, height])

var yAxis = d3.axisLeft(yScale);
var xAxis = d3.axisBottom(xScale);
  // .tickSize(-width, 0, 0);

var yGrid = d3.axisLeft(yScale)
  .tickSize(-width, 0, 0)
  .tickFormat('');
var xGrid = d3.axisBottom(xScale)
  .tickSize(-height, 0, 0)
  .tickFormat('');

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
    svg.select(".grid.x").call(xGrid.scale(d3.event.transform.rescaleX(xScale)));
    svg.select(".grid.y").call(yGrid.scale(d3.event.transform.rescaleY(yScale)));
    // svg.select(".grid.y").tickSize(-width, 0, 0);
    svg.select(".data-area").attr("transform", d3.event.transform);
  });

svg.call(zoom);

var rect = svg.append('rect')
  .attr('class', 'figure-area')
  .attr('width', width)
  .attr('height', height);

svg.append('g')
  .attr('class', 'grid x')
  .attr('transform', `translate(0,${height})`)
  .call(xGrid);

svg.append('g')
  .attr('class', 'grid y')
  .call(yGrid);

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




// let line = d3.line()
//     .x(function(d) { return xScale(d['x']); })
//     .y(function(d) { return yScale(d['y']); });

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
  // svg.select('.data-area')
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

  // detectorMarkers
  var detMarkers = svg.select('.data-area')
    .append('g')
    .selectAll('circle')
    .data(detectorMarkers)
    .enter()
      .append('g')
      .attr('transform', function(d, i) { return `translate(${xScale(d.x)},${yScale(d.y)})`});
      // .attr('x', function(d, i) { return xScale(d.x); })
      // .attr('y', function(d, i) { return yScale(d.y); });

        detMarkers.append('circle')
          .attr('class', 'detector-marker')
          .attr('cx', 0)
          .attr('cy', 0)
          // .attr('cx', function(d, i) { return xScale(d.x); })
          // .attr('cy', function(d, i) { return yScale(d.y); })
          .attr('r', function(d, i) { return d.r; })
        detMarkers.append('text')
          .attr('class', 'det-text')
          .attr('x', function(d, i) {return 7; })
          .attr('y', function(d, i) {return -7; })
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'central')
          .style('font-size', `${10}px`)
          .text(function(d, i) {return `${d.detNum}`});
}
render();

function responsivefy(svg) {
  // get container + svg aspect ratio
  var container = d3.select(svg.node().parentNode);
  var width = parseInt(svg.style("width"));
  var height = parseInt(svg.style("height"));
  var aspect = width/height;

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

};
