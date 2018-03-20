const xlsx = require('node-xlsx');
const formidable = require('formidable');
const async = require('async');
const fs = require('fs');

/**
* Extract files in request
* @public
*/
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

/**
* Parse xls/xlsx file
* @public
*/
function xsl(file) {
  const ingestData = xlsx.parse(file)[0].data;
  // Delete file
  fs.unlink(file, (err) => {
    if (err) console.error(err);
  });
  return { ingestData };
}

/**
* Map keys to fields
* @public
*/
function mapKeys(parsed) {
  const keys = {};
  let index = 0;
  async.each(parsed[0], (item) => {
    keys[item] = index;
    index += 1;
  });

  return keys;
}

/**
* Prepare models to save according to DB schemas
* @public
*/
function formatBeforeSave(parsedData, currKey, keys, schema) {
  return new Promise((resolve) => {
    const schemaObj = [];
    async.each(parsedData[currKey], (item) => {
      const currObj = {};
      // Iterate over required keys
      async.each(Object.keys(schema), (objKey) => {
        currObj[objKey] = item[keys[objKey]];
      });

      schemaObj.push(currObj);
    });

    resolve(schemaObj);
  });
}

module.exports = {
  extractFiles,
  xsl,
  mapKeys,
  formatBeforeSave,
};
