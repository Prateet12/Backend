const { File, Admin } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const userService = require("./user.service");

const fs = require("fs");
const util = require("util");
const unlink = util.promisify(fs.unlink);

const validateFileMetadata = async (metadata) => {
  if (
    !metadata.fromUser ||
    !metadata.fileType ||
    !metadata.title ||
    !metadata.author ||
    !metadata.abstract ||
    !metadata.degree_program
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing required fields");
  }

  if (metadata.fileType === "Resume") {
    const existingResume = await File.findOne({
      fromUser: metadata.fromUser,
      fileType: "Resume",
    });
    if (existingResume) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You can only have one resume. Please update your existing one."
      );
    }
  }
};

const createNewFileData = (updatedMetadata, files) => {
  const newFileData = {
    fromUser: updatedMetadata.fromUser,
    fileType: updatedMetadata.fileType,
    fileSize: files[0].size,
    filePath: files[0].path,
    filename: files[0].filename,
    title: updatedMetadata.title,
    author: updatedMetadata.author,
    abstract: updatedMetadata.abstract,
    degree_program: updatedMetadata.degree_program,
    publication_date: updatedMetadata?.publication_date,
    keywords: updatedMetadata?.keywords,
    institution: updatedMetadata?.institution,
    department: updatedMetadata?.department,
    funding_sources: updatedMetadata?.funding_sources,
    acknowledgements: updatedMetadata?.acknowledgements,
    supervisors: updatedMetadata?.supervisors,
  };

  if (files.length > 1) {
    newFileData.synopsisFilePath = files[1].path;
    newFileData.synopsisFileSize = files[1].size;
    newFileData.synopsisFileName = files[1].filePath;
  }
  console.log("newFileData", newFileData);

  return newFileData;
};

// TODO(aadijain): add logic in admin, to get all files and approve them
// or dissaprove them
const createFileAndUpdateAdmin = async (fileData, admin, instituteAdmin) => {
  try {
  const newFile = await File.create(fileData);
  console.log("newFile", newFile);

  admin.file_requests.push(newFile._id);
  await admin.save();

  instituteAdmin.file_requests.push(newFile._id);
  await instituteAdmin.save();

  return newFile;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error creating or saving file record: " + error.message
    );
  }
};

const uploadFile = async (req) => {
  const metadata = req.body;
  await validateFileMetadata(metadata);

  const user = await userService.getUserById(metadata.fromUser);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  console.log("user", user);
  const admin = await Admin.getAdmin();
  const instituteAdmin = await Admin.getInstituteAdmin(user.institution_name);
  console.log("instituteAdmin", instituteAdmin);

  if (!admin || !instituteAdmin) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Not enough admins to approve request"
    );
  }

  const files = req.files;
  if (!files) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No file uploaded");
  }

  try {
    const fileData = createNewFileData(metadata, files);
    return await createFileAndUpdateAdmin(fileData, admin, instituteAdmin);
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error creating file record: " + error.message
    );
  }
};

const deleteFile = async (fileId) => {
  // first checking if file is there
  const file = await File.findById(fileId);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, "File not found");
  }
  console.log("file found", file);
  //delete
  await unlink(file.filePath).catch((err) => {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Error deleting file: ${err}`
    );
  });
  console.log("file deleted");

  // update any and all admins with this file id:
  //remove file entry
  await File.deleteOne({ _id: fileId }); //TODO(aadijain): discuss use file.remove() to trigger pre remove hook
};

const getAllFiles = async () => {
  try {
    const files = await File.find();
    if (!files || files.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, "No files found.");
    }
    return files;
  } catch (error) {
    console.error(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred while retrieving the files." + error.message
    );
  }
};

const getFileById = async (fileId) => {
  const file = await File.findById(fileId);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, "File not found");
  }
  return file;
};

const getUserFiles = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No user id provided");
  }
  const files = await File.find({ fromUser: userId });
  return files;
};

// TODO(aadijain): Update file ruins the point of a RAG + Logic to replace file locally
const updateFile = async (req) => {
  const updatedMetadata = req.body;
  const files = req.files;
  await validateFileMetadata(updatedMetadata);
  if (!updatedMetadata.fileId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No file id provided");
  }

  if (!files || files.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No file uploaded");
  }

  const file = await File.findById(updatedMetadata.fileId);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, "File not found");
  }

  await unlink(file.filePath).catch((err) => {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Error deleting file: ${err}`
    );
  });

  if (files.length > 1) {
    await unlink(file.synopsisFilePath).catch((err) => {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Error deleting second file: ${err}`
      );
    });
  }

  const newFileData = createNewFileData(updatedMetadata, files);

  // Need to locally also update data
  const updatedFile = await File.findByIdAndUpdate(
    updatedMetadata.fileId,
    newFileData,
    {
      new: true,
    }
  );
  if (!updatedFile) {
    throw new ApiError(httpStatus.NOT_FOUND, "File does not exist");
  }
  return updatedFile;
};

const countAllFiles = async () => {
  console.log("getFileCount service");
  return await File.countDocuments();
};

module.exports = {
  uploadFile,
  deleteFile,
  getAllFiles,
  getFileById,
  getUserFiles,
  updateFile,
  countAllFiles,
};
