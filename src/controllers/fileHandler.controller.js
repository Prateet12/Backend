const httpStatus = require("http-status");
// const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const fileHandlerService = require("../services/fileHandler.service");

const uploadFile = catchAsync(async (req, res) => {
  console.log("uploadFile");
  if (!req.files || req.files.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No file uploaded");
  }
  console.log("controller");
  const fileData = await fileHandlerService.uploadFile(req);
  res.status(httpStatus.CREATED).send(fileData);
});

const getAllFiles = catchAsync(async (req, res) => {
  console.log("getAllFiles");
  const files = await fileHandlerService.getAllFiles();
  res.status(httpStatus.OK).send(files);
});

const getFileById = catchAsync(async (req, res) => {
  const fileId = req.params.id;
  const file = await fileHandlerService.getFileById(fileId);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, "File not found");
  }
  res.status(httpStatus.OK).send(file);
});

const getUserFiles = catchAsync(async (req, res) => {
  const userId = req.params.id;
  console.log("userId", userId);
  const files = await fileHandlerService.getUserFiles(userId);
  if (!files || files.length === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No files have been found for user. Either user does not exist or user has not uploaded any files."
    );
  }
  res.status(httpStatus.OK).send(files);
});

const updateFile = catchAsync(async (req, res) => {
  const file = await fileHandlerService.updateFile(req);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, "File does not exist");
  }
  res.status(httpStatus.OK).send(file);
});

const deleteFile = catchAsync(async (req, res) => {
  // first checking if file is there
  const fileId = req.params.id;
  await fileHandlerService.deleteFile(fileId);
  res.status(httpStatus.OK).send("File has been deleted successfully.");
});

const getFileCount = catchAsync(async (req, res) => {
  console.log("getFileCount controller");
  const count = await fileHandlerService.countAllFiles();
  console.log("count", count);
  res.status(httpStatus.OK).send({ count });
});

module.exports = {
  uploadFile,
  deleteFile,
  getAllFiles,
  getFileById,
  getUserFiles,
  updateFile,
  getFileCount,
};