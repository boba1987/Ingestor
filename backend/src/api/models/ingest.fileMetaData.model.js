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

fileMetaDataSchema.pre('save', (next) => {
  // Format schmea before saving
  // eslint-disable-next-line
  this.sourceId = this.source.split(':')[0];
  // eslint-disable-next-line
  this.provider = this.source.split(':')[1];
  next();
});

/**
 * @typedef Client
 */
exports.model = mongoose.model('FileMetaDataSchema', fileMetaDataSchema);

// Export schema keys object
exports.object = schema;
