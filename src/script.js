var fs = require('fs-extra')

var srcDir = './src';
var scriptsDir = './d3-scripts';
var dirs = fs.readdirSync(srcDir+'/'+scriptsDir);
var examplesList = document.createElement('ul');
document.body.appendChild(examplesList);

for(var i = 0; i < dirs.length; i++){
  var scriptDir = srcDir+'/'+scriptsDir+'/'+dirs[i];
  var st = fs.statSync(srcDir+'/'+scriptsDir);
  var scriptFile = scriptsDir+'/'+dirs[i]+'/'+dirs[i]+'.html';
  if(st.isDirectory() === true){
    var item = document.createElement('li');
    var itemLink = document.createElement('a');
    item.appendChild(itemLink);
    itemLink.href = scriptFile;
    itemLink.innerHTML += dirs[i];
    examplesList.appendChild(item);
  }
}
