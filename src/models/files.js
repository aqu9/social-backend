const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    file: {
      type: Buffer,
      required: false,
    },
    url:{
        type: String,
        required: false,
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const FileModel = mongoose.model('files', fileSchema);

module.exports = FileModel;
