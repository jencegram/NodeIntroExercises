// Import modules
const fs = require('fs');
const process = require('process');
const axios = require('axios');

// Functions
function cat(path, callback) {
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) {
      console.error(`Error reading ${path}: ${err}`);
      process.exit(1);
    } else {
      callback(data);
    }
  });
}

function webCat(url, callback) {
  axios.get(url)
    .then(function (resp) {
      callback(resp.data);
    })
    .catch(function (err) {
      console.error(`Error fetching ${url}: ${err}`);
      process.exit(1);
    });
}

function handleOutput(content) {
  if (writeToFile) {
    fs.writeFile(outputFile, content, 'utf8', function (err) {
      if (err) {
        console.error(`Couldn't write ${outputFile}: ${err}`);
        process.exit(1);
      }
    });
  } else {
    console.log(content);
  }
}

// Setup & Execution
let writeToFile = false;
let outputFile = "";
let path;

// Check for --out argument
if (process.argv[2] === '--out') {
  writeToFile = true;
  outputFile = process.argv[3];
  path = process.argv[4];
} else {
  path = process.argv[2];
}

if (path.slice(0, 4) === 'http') {
  webCat(path, handleOutput);
} else {
  cat(path, handleOutput);
}
