const mongoose = require('mongoose');

const schema = {
  fileMetaDataId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  fileName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  source: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    lowercase: true,
  },
  sourceId: {
    type: String,
    required: false,
    unique: false,
    trim: true,
    lowercase: true,
  },
  provider: {
    type: String,
    required: false,
    unique: false,
    trim: true,
    lowercase: true,
  },
  UID: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    lowercase: true,
  },
};

/**
 * Requirement collection Schema
 * @private
 */
const fileMetaDataSchema = new mongoose.Schema(
  schema,
  {
    timestamps: true,
  },
);

fileMetaDataSchema.pre('save', function format(next) {
  // Format schema before saving
  // eslint-disable-next-line
  this.sourceId = this.source.split(':')[0];
  // eslint-disable-next-line
  this.provider = this.source.split(':')[1];
  next();
});

/**
 * @typedef FileMetaDataSchema
 */
exports.Model = mongoose.model('FileMetaDataSchema', fileMetaDataSchema);

// Export schema keys object
exports.object = schema;
