const formater = require('../../utils/requestFormatter');
const async = require('async');
const requirementSchema = require('../../models/ingest.requirement.model');
const clientSchema = require('../../models/ingest.client.model');
const fileMetaDataSchema = require('../../models/ingest.fileMetaData.model');

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
        // Iterate over parsed .xsl file
        async.parallel({
          schemaObjReq: (callback) => {
            formatBeforeSave(parsed, key, keys, requirementSchema.object)
              .then(requirementSchemaRes => callback(null, requirementSchemaRes.slice(1)));
          },
          schemaObjClient: (callback) => {
            formatBeforeSave(parsed, key, keys, clientSchema.object)
              .then(clientSchemaRes => callback(null, clientSchemaRes.slice(1)));
          },
          schemaObjFileMetaData: (callback) => {
            formatBeforeSave(parsed, key, keys, fileMetaDataSchema.object)
              .then(fileMetaDataSchemaRes => callback(null, fileMetaDataSchemaRes.slice(1)));
          },
        }, (err, result) => {
          console.log(result.schemaObjReq[0]);
        });
      });
      res.sendStatus(200);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
