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
  const upload_requests = await adminService.getUploadRequests();
  res.status(httpStatus.OK).send(upload_requests);
});

const approveRegistration = catchAsync(async (req, res) => {
  await adminService.approveRegistration(req.body.user, req.body.admin);
  res.status(httpStatus.OK).send("Approved registration");
});

const rejectRegistration = catchAsync(async (req, res) => {
  // TODO emails service
});

const approveUpload = catchAsync(async (req, res) => {
  const fileId = req.body.fileId;
  const instituteName = req.body.instituteName;
  await adminService.approveUpload(fileId, instituteName);
  res.status(httpStatus.OK).send("Approved upload");
});

const rejectUpload = catchAsync(async (req, res) => {
  const fileId = req.body.fileId;
  const instituteName = req.body.instituteName;
  await adminService.rejectUpload(fileId, instituteName);
  res.status(httpStatus.OK).send("Rejected upload");
});

const createAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.createAdmin(req.body);
  res.status(httpStatus.CREATED).send(admin);
});

const createInstituteAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.createInstituteAdmin(req.body);
  res.status(httpStatus.CREATED).send(admin);
});

const updateRegistrationRequests = catchAsync(async (req, res) => {
  await adminService.updateRegistrationRequests(req.body);
  res.status(httpStatus.OK).send("Updated registration requests");
});


const getAllInstitutions = catchAsync(async (req, res) => {
  const institutions = await adminService.getAllInstitutions();
  res.status(httpStatus.OK).send(institutions);
});

module.exports = {
  getRegistrationRequests,
  getUploadRequests,
  approveRegistration,
  rejectRegistration,
  approveUpload,
  rejectUpload,
  updateRegistrationRequests,
  createAdmin,
  createInstituteAdmin,
  getAllInstitutions
};
