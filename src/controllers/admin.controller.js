const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, adminService } = require("../services");

// TODO(team): fill these functions

// Requires institutionName, otherwise uses Admin's institution
const getRegistrationRequests = catchAsync(async (req, res) => {
  // Your code here
  console.log("getRegistrationRequests");
  const institutionName =
    req.body && req.body.institutionName ? req.body.institutionName : null;
  const registration_requests = await adminService.getRegistrationRequests(
    institutionName
  );
  console.log("Registration requests: ", registration_requests);
  res.status(httpStatus.OK).send(registration_requests);
});

const getUploadRequests = catchAsync(async (req, res) => {
  // Your code here
});

const approveRegistration = catchAsync(async (req, res) => {
  // Your code here
  await adminService.approveRegistration(req.body.user, req.body.admin);
  res.status(httpStatus.OK).send("Approved registration");
});

const rejectRegistration = catchAsync(async (req, res) => {
  // Your code here
});

const approveUpload = catchAsync(async (req, res) => {
  // Your code here
});

const rejectUpload = catchAsync(async (req, res) => {
  // Your code here
});

const createAdmin = catchAsync(async (req, res) => {
  // Your code here
  const admin = await adminService.createAdmin(req.body);
  res.status(httpStatus.CREATED).send(admin);
});

const createInstituteAdmin = catchAsync(async (req, res) => {
  // Your code here
  const admin = await adminService.createInstituteAdmin(req.body);
  res.status(httpStatus.CREATED).send(admin);
});

// TODO(team): fill these functions - discuss for internal use in login
const updateRegistrationRequests = catchAsync(async (req, res) => {
  await adminService.updateRegistrationRequests(req.body);
  res.status(httpStatus.OK).send("Updated registration requests");
});

const updateUploadRequests = catchAsync(async (req, res) => {});

module.exports = {
  getRegistrationRequests,
  getUploadRequests,
  approveRegistration,
  rejectRegistration,
  approveUpload,
  rejectUpload,
  updateRegistrationRequests,
  updateUploadRequests,
  createAdmin,
  createInstituteAdmin,
};
