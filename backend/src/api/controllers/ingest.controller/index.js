const formater = require('../../utils/requestFormatter');

/**
 * Create new ingest
 * @public
 */
exports.create = (req, res) => {
  // Parse the request and Extract file sent in the request
  formater.extractFiles(req)
    // Parse the file and extract fields
    .then(file => formater.xsl(file.ingestion.path))
    // Format extracted fields before saving to DB
    .then((parsed) => {
      console.log(parsed['Ingest data']);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(err.status).send(err.message);
    });
};
