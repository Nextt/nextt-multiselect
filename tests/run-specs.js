global.jasmine = require('jasmine-node');
var sys = require('sys');

//add jasmine functions to the globals scope
for(var key in jasmine) {
  global[key] = jasmine[key];
}

var jasmineJquery = require("jasmine-jquery");

global.window = require('jsdom').jsdom().createWindow();
global.jQuery = global.$ = require("jquery");
//set fixtures paths
jasmine.getFixtures().fixturesPath = __dirname + '/fixtures';


//define exec params and overwrite whith user params
var isVerbose = true;
var showColors = true;
process.argv.forEach(function(arg){
    switch(arg) {
          case '--color': showColors = true; break;
          case '--noColor': showColors = false; break;
          case '--verbose': isVerbose = true; break;
      }
});

//exec specs
jasmine.executeSpecsInFolder(__dirname + '/specs', function(runner, log){
  if (runner.results().failedCount == 0) {
    process.exit(0);
  }
  else {
    process.exit(1);
  }

}, isVerbose, showColors, null, null, null, {report:false});