const formater = require('../../utils/requestFormatter');
const async = require('async');
const requirementSchema = require('../../models/ingest.requirement.model');
const clientSchema = require('../../models/ingest.client.model');

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
      async.each(Object.keys(parsed), (key) => {
        // Get the colums/keys
        const keys = formater.mapKeys(parsed[key]);
        const schemaObjReq = [];
        const schemaObjClient = [];
        // Iterate over parsed .xsl file
        async.each(parsed[key], (item) => {
          const currObjReq = {};
          const currObjClient = {};
          // Iterate over required keys
          async.each(Object.keys(requirementSchema.object), (objKey) => {
            currObjReq[objKey] = item[keys[objKey]];
          });

          async.each(Object.keys(clientSchema.object), (objKey) => {
            currObjClient[objKey] = item[keys[objKey]];
          });

          schemaObjReq.push(currObjReq);
          schemaObjClient.push(currObjClient);

          console.log(schemaObjClient);
        });
      });
      res.sendStatus(200);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
