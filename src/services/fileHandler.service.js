const { File, User } =  require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

// TODO(Sid): fill these functions
const uploadFile = async (file) => {};

const updateFile = async (file) => {};

const deleteFile = async (req, res) => {};
// Only superadmin can delete requests 

const getAllFiles = catchAsync(async (req, res) => {
  
});

const getFileById = catchAsync(async (req, res) => {

});

const getUserFiles = catchAsync(async (req, res) => {});

module.exports = {
    uploadFile,
    deleteFile,
    getAllFiles,
    getFileById,
};



