const formidable = require('formidable');
const xlsParse = require('xls-parse');

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

module.exports = {
  extractFiles,
  xsl,
};
