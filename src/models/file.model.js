const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["Resume", "Thesis", "Synopsis", "Thesis and Synopsis"],
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
    filename: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    synopsisFileName: {
      type: String,
    },
    synopsisFilePath: {
      type: String,
    },
    synopsisFileSize: {
      type: Number,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: String,
      required: true,
    },
    supervisors: {
      type: [String],
    },
    abstract: {
      type: String,
      required: true,
    },
    // TODO(aadijain newly added fields)
    degree_program: {
      type: String,
      required: true,
    },
    publication_date: {
      type: Date,
    },
    keywords: {
      type: [String],
    },
    institution: {
      type: String,
    },
    department: {
      type: String,
    },
    funding_sources: {
      type: String,
    },
    acknowledgements: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Approved by Admin",
        "Approved by Institute Admin",
        "Approved",
        "Rejected",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// If this file is deleted update all admins file_requests

// fileSchema.pre("remove", function (next) {
//   // console.log("Deleting file");
//   try {
//     this.model("Admin").update(
//       {},
//       { $pull: { file_requests: this._id } },
//       { multi: true },
//       next
//     );
//     console.log("Deleted file from admin");
//   } catch (error) {
//     console.log("Error deleting file from admin", error);
//     next(error);
//   }
// });

const File = mongoose.model("FileStore", fileSchema);

module.exports = File;
