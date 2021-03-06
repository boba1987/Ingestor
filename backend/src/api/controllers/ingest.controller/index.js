const formater = require('../../utils/requestFormatter');
const async = require('async');
const requirementSchema = require('../../models/ingest.requirement.model');
const clientSchema = require('../../models/ingest.client.model');
const fileMetaDataSchema = require('../../models/ingest.fileMetaData.model');
const Mongo = require('mongodb');
const Config = require('../../../config/vars');

let dbConnection;

Mongo.MongoClient.connect(Config.mongo.uri, (err, db) => {
  if (err) console.log(err);
  dbConnection = db;
  console.log('Mongo connected');
});

/**
 * Get ingest
 * @private
 */
function createTextIndex(dbCollection, config) {
  // Get the documents collection
  const collection = dbConnection.collection(dbCollection);

  collection.createIndex(config);
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
        throw Error('ingestion field is required!');
      }
      return formater.xsl(file.ingestion.path);
    })
    // Format extracted fields before saving to DB
    .then((parsed) => {
      async.each(Object.keys(parsed), (key) => {
        let index = 0;
        let keys;
        async.each(parsed[key], (item) => {
          if (index) {
            item.push(index);
          } else {
            parsed[key][0].push('UID');
            // Get the colums/keys
            keys = formater.mapKeys(parsed[key]);
          }
          index += 1;
        });
        // Iterate over parsed .xsl file
        async.parallel({
          schemaObjReq: (callback) => {
            formater.formatBeforeSave(parsed, key, keys, requirementSchema.object)
              .then((requirementSchemaRes) => {
                // Insert in the Data base
                requirementSchema.Model.create(requirementSchemaRes.slice(1), (err) => {
                  if (err) console.error('requirementSchemaRes', err);
                  callback(null, requirementSchemaRes.slice(1));
                });
              });
          },
          schemaObjClient: (callback) => {
            formater.formatBeforeSave(parsed, key, keys, clientSchema.object)
              // Insert in the Data base
              .then((clientSchemaRes) => {
                clientSchema.Model.create(clientSchemaRes.slice(1), (err) => {
                  if (err) console.error('clientSchemaRes', err);
                  callback(null, clientSchemaRes.slice(1));
                  // Create index for text search
                  createTextIndex('clients', { clientName: 'text' });
                });
              });
          },
          schemaObjFileMetaData: (callback) => {
            formater.formatBeforeSave(parsed, key, keys, fileMetaDataSchema.object)
            // Insert in the Data base
              .then((fileMetaDataSchemaRes) => {
                // Insert in the Data base
                fileMetaDataSchema.Model.create(fileMetaDataSchemaRes.slice(1), (err) => {
                  if (err) console.error('fileMetaDataSchemaRes', err);
                  callback(null, fileMetaDataSchemaRes.slice(1));
                  // Create index for text search
                  createTextIndex('filemetadataschemas', { provider: 'text', fileName: 'text' });
                });
              });
          },
        }, (err) => {
          if (err) console.error('Save error: ', err);
          res.sendStatus(200);
        });
      });
    })
    .catch((err) => {
      console.log('err: ', err);
      res.status(400).send('ingestion field is required!');
    });
};

/**
 * Get ingest
 * @public
 */
exports.get = function get(req, res) {
  const collection = dbConnection.collection('clients');
  const skip = parseInt(req.query.page, 10) || 0;
  const limit = parseInt(req.query['page-size'], 10) || 100000000;
  // Join collections
  collection.aggregate([
    {
      $lookup:
       {
         from: 'requirements',
         localField: 'UID',
         foreignField: 'UID',
         as: 'requirementsItems',
       },
    },
    {
      $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$requirementsItems', 0] }, '$$ROOT'] } },
    },
    { $project: { requirementsItems: 0 } },
    {
      $lookup:
       {
         from: 'filemetadataschemas',
         localField: 'UID',
         foreignField: 'UID',
         as: 'filemetadataschemasItems',
       },
    },
    {
      $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$filemetadataschemasItems', 0] }, '$$ROOT'] } },
    },
    { $project: { filemetadataschemasItems: 0 } },
    {
      $match: {
        provider: { $regex: new RegExp(req.query.provider) },
        clientName: { $regex: new RegExp(req.query['client-name']) },
        fileName: { $regex: new RegExp(req.query['file-name']) },
      },
    },
    { $sort: { [req.query.sort]: parseInt(req.query['sort-direction'], 10) } },
  ]).skip(skip * limit).limit(limit).toArray((err, result) => {
    if (err) console.error(err);
    res.send(result);
  });
};
