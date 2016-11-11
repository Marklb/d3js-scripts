const fs = require('fs');

let srd_rr_read = (resDir) => {
  console.log('srd_rr_read');
  let res = {};
  let lines;

  let paramsFileStr = fs.readFileSync(resDir+'/params.txt', 'UTF-8');
  // console.log(paramsFileStr);
  res.timesteps = parseInt(paramsFileStr.split(' ')[1]);

  let results_in_radiusFileStr = fs.readFileSync(resDir+'/results_in_radius.txt', 'UTF-8');
  // console.log(results_in_radiusFileStr);
  res.results_in_radius = {};
  lines = results_in_radiusFileStr.split('\n');
  // console.log(lines.length);
  for(let i = 0; i < lines.length; i++){
    let a = lines[i].split(' ');
    let ts = parseInt(a[0]);
    if(res.results_in_radius[ts] === undefined){
      res.results_in_radius[ts] = [];
    }
    res.results_in_radius[ts].push([
      parseInt(a[0]), parseInt(a[1]), parseInt(a[2]), parseInt(a[3]),
      parseFloat(a[4]), parseFloat(a[5]), parseFloat(a[6]), parseFloat(a[7]),
      parseFloat(a[8]), parseFloat(a[9]), parseFloat(a[10]), parseFloat(a[11])
    ]);
  }

  let results_original_centroids_in_radiusFileStr = fs.readFileSync(resDir+'/results_original_centroids_in_radius.txt', 'UTF-8');
  // console.log(results_original_centroids_in_radiusFileStr);
  res.results_original_centroids_in_radius = {};
  lines = results_original_centroids_in_radiusFileStr.split('\n');
  // console.log(lines.length);
  for(let i = 0; i < lines.length; i++){
    let a = lines[i].split(' ');
    let ts = parseInt(a[0]);
    if(res.results_original_centroids_in_radius[ts] === undefined){
      res.results_original_centroids_in_radius[ts] = [];
    }
    res.results_original_centroids_in_radius[ts].push([
      parseInt(a[0]), parseInt(a[1]), parseInt(a[2]), parseInt(a[3]),
      parseFloat(a[4]), parseFloat(a[5]), parseFloat(a[6]), parseFloat(a[7]),
      parseFloat(a[8])
    ]);
  }

  let results_radius_centerFileStr = fs.readFileSync(resDir+'/results_radius_center.txt', 'UTF-8');
  // console.log(results_radius_centerFileStr);
  res.results_radius_center = {};
  lines = results_radius_centerFileStr.split('\n');
  // console.log(lines.length);
  for(let i = 0; i < lines.length; i++){
    let a = lines[i].split(' ');
    let ts = parseInt(a[0]);
    // if(res.results_radius_center[ts] === undefined){
    //   res.results_radius_center[ts] = [];
    // }
    res.results_radius_center[ts] = [
      parseInt(a[0]), parseFloat(a[1]), parseFloat(a[2]),  parseFloat(a[3])
    ];
  }

  let resultsFileStr = fs.readFileSync(resDir+'/results.txt', 'UTF-8');
  // console.log(resultsFileStr);
  res.results = {};
  lines = resultsFileStr.split('\n');
  // console.log(lines.length);
  for(let i = 0; i < lines.length; i++){
    let a = lines[i].split(' ');
    let ts = parseInt(a[0]);
    if(res.results[ts] === undefined){
      res.results[ts] = [];
    }
    res.results[ts].push([
      parseInt(a[0]), parseInt(a[1]), parseInt(a[2]), parseInt(a[3]),
      parseFloat(a[4]), parseFloat(a[5]), parseFloat(a[6]), parseFloat(a[7]),
      parseFloat(a[8]), parseFloat(a[9]), parseFloat(a[10]), parseFloat(a[11])
    ]);
  }


  // console.log(res);
  return res;
};


module.exports = {
  read: srd_rr_read
};
