const formidable = require('formidable');
const xlsParse = require('xls-parse');
const async = require('async');

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
  return xlsParse.formatXls2Obj(file);
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
