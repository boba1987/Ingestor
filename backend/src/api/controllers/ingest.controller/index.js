const formater = require('../../utils/requestFormatter');

/**
 * Create new ingest
 * @public
 */
exports.create = (req, res) => {
  formater.extractFiles(req)
    // Parse the request and Extract file sent in the request
    .then(file => formater.xsl(file[''].path))
    // Extract fields in xls
    .then((parsed) => {
      console.log(parsed);
      res.sendStatus(200);
    })
    .catch((err) => {
      const error = JSON.parse(err);
      res.status(error.status).send(error.message);
    });
};
