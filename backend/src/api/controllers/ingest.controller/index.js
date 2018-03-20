const formater = require('../../utils/requestFormatter');

/**
 * Create new ingest
 * @public
 */
exports.create = (req, res) => {
  // Parse the request and Extract file sent in the request
  formater.extractFiles(req)
    // Parse the file and extract fields
    .then((file) => {
      if (!file.ingestion) {
        throw new Error('ingestion field is required!');
      }
      return formater.xsl(file.ingestion.path);
    })
    // Format extracted fields before saving to DB
    .then((parsed) => {
      console.log(parsed);
      res.sendStatus(200);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
