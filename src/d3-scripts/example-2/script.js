console.log('Starting: example-2');
var d3 = require('d3');
const mathjs = require('mathjs');
const $ = require('jquery');

const RES_DIR = 'E:/Work/Research/dndo/nodejs/detection-scripts';
const MARKER_IMAGE_URLS = {
  // 'DETECTOR_ICON': `${RES_DIR}/res/imgs/detectorIcon.png`
  'DETECTOR_ICON': `${RES_DIR}/res/imgs/detectorIconOrange.png`
};

const MbDNDODatasets = require('mb-dndo-datasets');
let dndoDatasets = new MbDNDODatasets();
let datasetsList = null;
// let dsName = 'LSI_A_Background';
// let dsName = 'LSI_C_01';
// let dsName = 'LSI_C_03';
let dsName = 'LSI_C_04';
let run = 1;
// let win_size = 5;
let win_size = 10;
let radius = 50;
const dsPath = `E:/Work/Research/dndo/datasets/canonical-datasets-master/${dsName}`;
var datasetObj = null;
dndoDatasets.readDataset(dsPath, () => {
  // console.log('Done loading datasets 2');
  datasetsList = dndoDatasets.getDatasets();
  // console.log(datasetsList);
  datasetObj = dndoDatasets.getDatasets()[0];
  start();
});

var start = () => {


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
// console.log(avgDetectorLocations);



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
}
// console.log(detectorMarkers);

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
// console.log(sourceMarkers);




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
// console.log(xDomain);
// console.log(yDomain);





















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
  .range([height, 0])

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

svg.append("text")
  .attr('class', 'figure-title')
  .attr("x", (width / 2))
  .attr("y", 5 - (margin.top / 2))
  .attr("text-anchor", "middle")
  // .style("font-size", "18px")
  // .style("text-decoration", "underline")
  .text('');


global.timestep = 20;

// let line = d3.line()
//     .x(function(d) { return xScale(d['x']); })
//     .y(function(d) { return yScale(d['y']); });

let selectText = (element) => {
  if (document.selection) {
      var range = document.body.createTextRange();
      range.moveToElementText(element);
      range.select();
  } else if (window.getSelection) {
      var range = document.createRange();
      range.selectNode(element);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
  }
};

var registeredToggleSelectors = [];
var registeredToggleSelectorsVisibility = {};
var registerToggleSelector = (selector, initialState = true) => {
  if(registeredToggleSelectors.indexOf(selector) != -1) return;
  registeredToggleSelectors.push(selector);
  registeredToggleSelectorsVisibility[selector] = initialState;

  // var visible = initialState;
  var setVisiblilityClass = () => {
    if(registeredToggleSelectorsVisibility[selector] === true){
      elem.classList.add('visible');
      elem.classList.remove('hidden');
    }else{
      elem.classList.add('hidden');
      elem.classList.remove('visible');
    }
  }

  var container = document.querySelector('#figure-toggle-selectors');

  var elem = document.createElement('div');
  container.appendChild(elem);
  elem.classList.add('toggle-selector-item');
  // elem.classList.add('noselect');
  elem.innerHTML = selector;

  setVisiblilityClass();

  elem.addEventListener('mousedown', (e) => {
    if(e.button === 0){ // left click
      registeredToggleSelectorsVisibility[selector] =
        !registeredToggleSelectorsVisibility[selector];
      setVisiblilityClass();
      d3.selectAll(selector)
        .attr('opacity',
          (registeredToggleSelectorsVisibility[selector] === true)? null : 0);
    }else if(e.button === 2){ // right click
      selectText(elem);
      var successful = document.execCommand('copy');
      window.getSelection().removeAllRanges();
    }
  });

};
var updateRegisterToggleSelectors = () => {
  for(let i = 0; i < registeredToggleSelectors.length; i++){
    let selector = registeredToggleSelectors[i];
    d3.selectAll(selector)
      .attr('opacity',
        (registeredToggleSelectorsVisibility[selector] === true)? null : 0);
  }
};

var renderDetectorMarkers = () => {
  var detMarkers = svg.select('.data-area')
    .append('g')
    .selectAll('circle')
    .data(detectorMarkers)
    .enter()
      .append('g')
      .attr('transform', function(d, i) { return `translate(${xScale(d.x)},${yScale(d.y)})`});

  detMarkers.append('circle')
    .attr('class', `detector-marker dot`)
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', function(d, i) { return d.r; })
  detMarkers.append('text')
    .attr('class', 'detector-marker dot det-text')
    .attr('x', function(d, i) {return 7; })
    .attr('y', function(d, i) {return -7; })
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'central')
    .style('font-size', `${10}px`)
    .text(function(d, i) {return `${d.detNum}`});

  // Toggle selectors
  registerToggleSelector('circle.detector-marker.dot', false);
  registerToggleSelector('text.detector-marker.dot.det-text', false);
};

var renderDetectorImgMarkers = () => {
  var detImgMarkers = svg.select('.data-area')
    .append('g')
    .selectAll('image')
    .data(detectorImgMarkers)
    .enter()
      .append('g')
      .attr('transform', function(d, i) { return `translate(${xScale(d.x)},${yScale(d.y)})`});

  detImgMarkers.append('image')
    .attr('class', `detector-marker img`)
    .attr('x', function(d, i) { return 0-(d.width/2); })
    .attr('y', function(d, i) { return 0-(d.height/2); })
    .attr('width', function(d, i) { return d.width; })
    .attr('height', function(d, i) { return d.height; })
    .attr('xlink:href', function(d, i) { return d['xlink:href']; })
  detImgMarkers.append('text')
    .attr('class', 'detector-marker img det-text')
    .attr('x', function(d, i) {return 7; })
    .attr('y', function(d, i) {return -7; })
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'central')
    .style('font-size', `${10}px`)
    .text(function(d, i) {return `${d.detNum}`});

  // Toggle selectors
  registerToggleSelector('image.detector-marker.img');
  registerToggleSelector('text.detector-marker.img.det-text');
};

var renderSourceMarkers = () => {
  var srcMarkers = svg.select('.data-area')
    .append('g')
    .selectAll('circle')
    .data(sourceMarkers)
    .enter()
      .append('g')
      .attr('transform', function(d, i) { return `translate(${xScale(d.x)},${yScale(d.y)})`});

  srcMarkers.append('circle')
    .attr('class', 'source-marker')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', function(d, i) { return d.r; })

  // Toggle selectors
  registerToggleSelector('circle.source-marker');
}

const srdResultsReader = require('./srd-results-reader');
// let srdResults = srdResultsReader.read(`E:/Work/Research/dndo/nodejs/detection-scripts/res/srd/v2/${dsName}/run_${run}/radius_${radius}/win_size_${win_size}/bin_12`);
let srdResults = srdResultsReader.read(`E:/Work/Research/dndo/algorithms/srd/results/v3/${dsName}/run_${run}/radius_${radius}/win_size_${win_size}/bin_12`);
// console.log(srdResults);


var renderDataMarkersInRadiusOriginal = () => {
  var inRadiusOriginalMarkers = svg.select('.data-area')
    .append('g')
    .selectAll('circle')
    .data(srdResults.results_in_radius[timestep])
    .enter()
      .append('g')
      .attr('transform', function(d, i) { return `translate(${xScale(d[7])},${yScale(d[8])})`});

  inRadiusOriginalMarkers.append('circle')
    .attr('class', 'in-radius-original-marker')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 2);

  // Toggle selectors
  registerToggleSelector('circle.in-radius-original-marker');
};

var renderDataMarkersInRadiusShifted = () => {
  var inRadiusShiftedMarkers = svg.select('.data-area')
    .append('g')
    .selectAll('circle')
    .data(srdResults.results_in_radius[timestep])
    .enter()
      .append('g')
      .attr('transform', function(d, i) { return `translate(${xScale(d[9])},${yScale(d[10])})`});

  inRadiusShiftedMarkers.append('circle')
    .attr('class', 'in-radius-shifted-marker')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 2);

  // Toggle selectors
  registerToggleSelector('circle.in-radius-shifted-marker');
};

var renderDataMarkersRadius = () => {
  var radiusMarkers = svg.select('.data-area')
    .append('g')
    .selectAll('ellipse')
    .data([srdResults.results_radius_center[timestep]])
    .enter()
      .append('g')
      .attr('transform', function(d, i) { return `translate(${xScale(d[1])},${yScale(d[2])})`});

  radiusMarkers.append('ellipse')
    .attr('class', 'radius-marker')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('rx', function(d, i) { return (xScale(d[1]+d[3])-xScale(d[1]))})
    .attr('ry', function(d, i) { return (yScale(d[2])-yScale(d[2]+d[3]))});

  // Toggle selectors
  registerToggleSelector('ellipse.radius-marker');
};

var renderDataMarkersOriginal = () => {
  var inRadiusOriginalMarkers = svg.select('.data-area')
    .append('g')
    .selectAll('circle')
    .data(srdResults.results[timestep])
    .enter()
      .append('g')
      .attr('transform', function(d, i) { return `translate(${xScale(d[7])},${yScale(d[8])})`});

  inRadiusOriginalMarkers.append('circle')
    .attr('class', 'results-original-marker')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 2);

  // Toggle selectors
  registerToggleSelector('circle.results-original-marker');
};

var renderDataMarkersShifted = () => {
  resultsShiftedMarkers = svg.select('.data-area')
    .append('g')
    .selectAll('circle')
    .data(srdResults.results[timestep])
    .enter()
      .append('g')
      .attr('transform', function(d, i) { return `translate(${xScale(d[9])},${yScale(d[10])})`});

  resultsShiftedMarkers.append('circle')
    .attr('class', 'results-shifted-marker')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 2);

  // Toggle selectors
  registerToggleSelector('circle.results-shifted-marker');
};

var renderDataMarkersOriginalCentroidInRadius = () => {
  resultsOriginalCentroidsInRadiusMarkers = svg.select('.data-area')
    .append('g')
    .selectAll('circle')
    .data(srdResults.results_original_centroids_in_radius[timestep])
    .enter()
      .append('g')
      .attr('transform', function(d, i) { return `translate(${xScale(d[4])},${yScale(d[5])})`});

  resultsOriginalCentroidsInRadiusMarkers.append('circle')
    .attr('class', 'in-radius-original-centroid-marker')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 2);

  // Toggle selectors
  registerToggleSelector('circle.in-radius-original-centroid-marker');
};



global.render = () => {
  // .exit().remove()  // removes extra
  d3.select('.figure-title').text(`[${dsName}] Timestep: ${timestep}`);

  renderDetectorMarkers();
  renderDetectorImgMarkers();
  renderSourceMarkers();

  //--------------------------------------------------------------
  // Results
  //--------------------------------------------------------------
  renderDataMarkersOriginal();
  renderDataMarkersShifted();

  renderDataMarkersOriginalCentroidInRadius();

  renderDataMarkersInRadiusOriginal();
  renderDataMarkersInRadiusShifted();

  renderDataMarkersRadius();


  //
  updateRegisterToggleSelectors();
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



document.addEventListener('keydown', (e) => {
  // console.log(e);
  if(e.keyCode === 37){
    global.timestep--;
    d3.select('.data-area').selectAll('g').remove();
    global.render();
  }else if(e.keyCode === 39){
    global.timestep++;
    d3.select('.data-area').selectAll('g').remove();
    global.render();
  }
});
