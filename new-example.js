#!/usr/bin/env node

var fs = require('fs-extra');

var D3_SCRIPTS_DIR = './src/d3-scripts'

var args = process.argv.slice(2);
var exName = args[0];
console.log(exName);

// Check if script exists
try{
  var stat = fs.statSync(D3_SCRIPTS_DIR+'/'+exName);
  console.log('Example ['+exName+'] already exists');
}catch(e){}


// Make the templates file
var TPL_FNAME_BASE = 'templates.js';
var TPL_FNAME_FULL = D3_SCRIPTS_DIR+'/'+exName+'/'+TPL_FNAME_BASE;
var TPL_CONTENT =
'<template id="productrow">'+
  '<tr>'+
    '<td class="record"></td>'+
    '<td></td>'+
  '</tr>'+
'</template>';

fs.outputFileSync(TPL_FNAME_FULL, TPL_CONTENT);

// Make the css file
var CSS_FNAME_BASE = 'styles.css';
var CSS_FNAME_FULL = D3_SCRIPTS_DIR+'/'+exName+'/'+CSS_FNAME_BASE;
var CSS_CONTENT = '';

fs.outputFileSync(CSS_FNAME_FULL, CSS_CONTENT);

// Make the script file
var SCRIPT_FNAME_BASE = 'script.js';
var SCRIPT_FNAME_FULL = D3_SCRIPTS_DIR+'/'+exName+'/'+SCRIPT_FNAME_BASE;
var SCRIPT_CONTENT = 'console.log(\'Starting: '+exName+'\');';

fs.outputFileSync(SCRIPT_FNAME_FULL, SCRIPT_CONTENT);

// Make the html file
var HTML_FNAME_BASE = exName+'.html';
var HTML_FNAME_FULL = D3_SCRIPTS_DIR+'/'+exName+'/'+HTML_FNAME_BASE;
var HTML_CONTENT =
'<!DOCTYPE html>'+
'<html>'+
  '<head>'+
    '<meta charset="utf-8">'+
    '<title>'+exName+'</title>'+
    '<link rel=\'stylesheet\' href=\'./'+CSS_FNAME_BASE+'\'></link>'+
    '<link href=\'./'+TPL_FNAME_BASE+'\'></link>'+
  '</head>'+
  '<body>'+
    '<script src=\'./'+SCRIPT_FNAME_BASE+'\'></script>'+
  '</body>'+
'</html>';
fs.outputFileSync(HTML_FNAME_FULL, HTML_CONTENT);
