const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  from_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ["Resume", "Thesis", "Synopsis"],
    required: true,
  },
  adminApproval: {
    type: Boolean,
    default: false,
  },
  institutionalAdminApproval: {
    type: Boolean,
    default: false,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  path_to_file: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  thesisTitle: {
    type: String,
  },
  authors: {
    type: [String],
  },
  abstract: {
    type: String,
  },

  // TODO(team): consider having a unique key field for customer service issues 
});

const File = mongoose.model("FileStore", fileSchema);

module.exports = File;
