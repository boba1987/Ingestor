const xlsx = require('node-xlsx');
const formidable = require('formidable');
const async = require('async');
const fs = require('fs');

// Extract files in request
function extractFiles(req) {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = './src/api/tmp';

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }

      resolve(files);
    });
  });
}

function xsl(file) {
  // Parse xls/xlsx file
  const ingestData = xlsx.parse(file)[0].data;
  // Delete file
  fs.unlink(file, (err) => {
    if (err) console.error(err);
  });
  return { ingestData };
}

function mapKeys(parsed) {
  const keys = {};
  let index = 0;
  async.each(parsed[0], (item) => {
    keys[item] = index;
    index += 1;
  });

  return keys;
}

module.exports = {
  extractFiles,
  xsl,
  mapKeys,
};
