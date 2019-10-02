/* eslint-disable */

var fs = require('fs'),
  parseString = require('xml2js').parseString,
  xml2js = require('xml2js');
const path = require('path');
//joining path of directory
const directoryPath = path.join(__dirname);
//passsing directoryPath and callback function
fs.readdir(directoryPath, function(err, files) {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  //listing all files using forEach
  files.forEach(function(file) {
    if (['index.js', 'process.js', '.DS_Store'].includes(file)) {
      return;
    }

    
    fs.readFile(file, 'utf-8', function(err, data) {
      if (err) console.log(err);
      
      console.log(`Processing: ${file}`);
      
      // we log out the readFile results
      // console.log(data);
      // we then pass the data to our method here
      parseString(data, function(err, result) {
        if (err) console.log(err);
        // here we log the results of our xml string conversion
        // console.log();
        result.svg.g[0].g[0] = result.svg.g[0].g[1];
        result.svg.g[0].g.pop();
        // var json = result;

        // json.svg.graph[0].node[0].weight = "99";

        // // create a new builder object and then convert
        // // our json back to xml.
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(result);

        fs.writeFile(file, xml, function(err, data) {
          if (err) console.log(err);

          console.log('successfully written our update xml to file');
        });
      });
    });
  });
});
