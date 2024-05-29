const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const fileHandlerService = require("../services/fileHandler.service");

// TODO(Sid): Implement the following functions using multer 
// to simply upload, delete, download files.
// 1. Upload locally -
// to the computer eg. store everything to your downloads folder 
// and save the path to the file in the database
// 2. Download locally - 

// When calling getFile, we should fetch from the path in the database
// from the local downloads folder -- let us know if this is
// unclear or easier to do in the frontend

const uploadFile = catchAsync(async (req, res) => {

});

const getAllFiles = catchAsync(async (req, res) => {

});

const getFileById = catchAsync(async (req, res) => {

});

const getUserFiles = catchAsync(async (req, res) => {

});





const deleteFile = catchAsync(async (req, res) => {});

module.exports = {
  uploadFile,
  deleteFile,
  getAllFiles,
  getFileById,
  getUserFiles
};
