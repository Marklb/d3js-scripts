console.log('Starting: example-3');
var d3 = require('d3');
const mathjs = require('mathjs');
const $ = require('jquery');


global.timestep = 20;

// const RES_DIR = 'E:/Work/Research/dndo/nodejs/detection-scripts';
// const MARKER_IMAGE_URLS = {
//   // 'DETECTOR_ICON': `${RES_DIR}/res/imgs/detectorIcon.png`
//   'DETECTOR_ICON': `${RES_DIR}/res/imgs/detectorIconOrange.png`
// };
//
// const MbDNDODatasets = require('mb-dndo-datasets');
// let dndoDatasets = new MbDNDODatasets();
// let datasetsList = null;
// let dsName = 'LSI_A_04';
// let dsName = 'LSI_C_01';
// let dsName = 'LSI_C_02';
// let dsName = 'LSI_C_03';
// let dsName = 'LSI_C_04';
let dsName = 'LSI_A_Background';
let run = 1;
let win_size = 5;
let radius = 50;
// const dsPath = `E:/Work/Research/dndo/datasets/canonical-datasets-master/${dsName}`;
// var datasetObj = null;
// dndoDatasets.readDataset(dsPath, () => {
//   // console.log('Done loading datasets 2');
//   datasetsList = dndoDatasets.getDatasets();
//   // console.log(datasetsList);
//   datasetObj = dndoDatasets.getDatasets()[0];
//   start();
// });
//
// var start = () => {
//
//
// let detectors = datasetObj.getDetectors(run);
// // console.log(detectors);
// let avgDetectorLocations = {};
// for(let key in detectors){
//   let det = detectors[key];
//   // console.log(det);
//   let locs = det.getLocations(run);
//   // console.log(locs);
//   avgDetectorLocations[det.getId()] = {};
//   avgDetectorLocations[det.getId()].detector = det.getId();
//   avgDetectorLocations[det.getId()].x = mathjs.mean(locs.x);
//   avgDetectorLocations[det.getId()].y = mathjs.mean(locs.y);
// }
// // console.log(avgDetectorLocations);
//
//
//
// //
// let detectorMarkers = [];
// let detectorImgMarkers = [];
// let detectorLabels = [];
// // for(let i = 0; i < detLocs.length; i++){
// for(let i in avgDetectorLocations){
//   let det = avgDetectorLocations[i];
//   detectorMarkers.push({
//     'class': 'detectorMarker',
//     'x': det.x,
//     'y': det.y,
//     'detNum': det.detector,
//     'r': 3
//   });
//   detectorImgMarkers.push({
//     'x': det.x,
//     'y': det.y,
//     'width': 15,
//     'height': 15,
//     'xlink:href': MARKER_IMAGE_URLS.DETECTOR_ICON,
//     'detNum': det.detector,
//   });
// }
// // console.log(detectorMarkers);
//
// // Set the source markers
// let srcLocs = datasetObj.getSourceLocations(run);
// let sourceMarkers = [];
// if(srcLocs){
//   // console.log('Src locs');
//   // console.log(srcLocs);
//   for(let i = 0; i < srcLocs.x.length; i++){
//     sourceMarkers.push({
//       'class': 'sourceMarker',
//       'x': srcLocs.x[i],
//       'y': srcLocs.y[i],
//       // 'label': `Source: time: ${srcLocs[i].ts}`,
//       // 'timestep': srcLocs[i].ts,
//       'label': `Source: time: ${i+1}`,
//       'timestep': i+1,
//       'r': 3
//     });
//   }
// }
// // console.log(sourceMarkers);

const srdResultsReader = require('./srd-results-reader');
// let srdResults = srdResultsReader.read(`E:/Work/Research/dndo/nodejs/detection-scripts/res/srd/v2/${dsName}/run_${run}/radius_${radius}/win_size_${win_size}/bin_12`);
let srdResults = srdResultsReader.read(`E:/Work/Research/dndo/algorithms/srd/results/v3/${dsName}/run_${run}/radius_${radius}/win_size_${win_size}/bin_12`);
// console.log(srdResults);


let dataMarkers = [];
for(let i = 0; i < srdResults.timesteps; i++){
  var res1 = srdResults.results_original_centroids_in_radius[i+1];
  var res2 = srdResults.results_in_radius[i+1];
  // console.log(res1);
  // console.log(res2);
  // console.log('');
  dataMarkers.push({
    'x': i+1,
    'y': res1.length-res2.length
  });
};
console.log(dataMarkers);

let switchDataset = (dn) => {
  dsName = dn;
  srdResults = srdResultsReader.read(`E:/Work/Research/dndo/algorithms/srd/results/v3/${dsName}/run_${run}/radius_${radius}/win_size_${win_size}/bin_12`);
  dataMarkers = [];
  for(let i = 0; i < srdResults.timesteps; i++){
    var res1 = srdResults.results_original_centroids_in_radius[i+1];
    var res2 = srdResults.results_in_radius[i+1];
    // console.log(res1);
    // console.log(res2);
    // console.log('');
    dataMarkers.push({
      'x': i+1,
      'y': res1.length-res2.length
    });
  };
  d3.select('.data-area').selectAll('g').remove();
  global.render();
};


//
//
//
let xDomain = [0,srdResults.timesteps];
let yDomain = [500,-500];
// if(datasetObj.getName() == 'Outdoor_C11--'){
//   xDomain = [100, 18800];
//   yDomain = [-500, 13000];
// }else{
//   let xMinVals = [d3.min(detectorImgMarkers, function(d){return d['x'];})];
//   let xMaxVals = [d3.max(detectorImgMarkers, function(d){return d['x'];})];
//
//   let yMinVals = [d3.min(detectorImgMarkers, function(d){return d['y'];})];
//   let yMaxVals = [d3.max(detectorImgMarkers, function(d){return d['y'];})];
//
//   if(sourceMarkers){
//     xMinVals.push(d3.min(sourceMarkers, function(d){return d['x'];}));
//     xMaxVals.push(d3.max(sourceMarkers, function(d){return d['x'];}));
//     yMinVals.push(d3.min(sourceMarkers, function(d){return d['y'];}));
//     yMaxVals.push(d3.max(sourceMarkers, function(d){return d['y'];}));
//   }
//
//   xDomain = [d3.min(xMinVals),d3.max(xMaxVals)];
//   yDomain = [d3.min(yMinVals),d3.max(yMaxVals)];
// }
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




let line = d3.line()
    .x(function(d) { return xScale(d['x']); })
    .y(function(d) { return yScale(d['y']); });

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

var renderData = () => {
  let lineDataNodes = svg.select('.data-area')
    .append('g')
    .append("path")
    .datum(dataMarkers)
    .attr("class", "line")
    .attr("d", line);

  // Toggle selectors
  registerToggleSelector('path.line');
};


global.render = () => {
  // .exit().remove()  // removes extra
  // d3.select('.figure-title').text(`[${dsName}] Timestep: ${timestep}`);
  d3.select('.figure-title').text(`[${dsName}]`);


  //--------------------------------------------------------------
  // Results
  //--------------------------------------------------------------
  renderData();


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
