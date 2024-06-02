const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, adminService } = require("../services");

const getRegistrationRequests = catchAsync(async (req, res) => {
  const instituteName =
    req.params &&
    req.params.instituteName &&
    req.params.instituteName !== "null"
      ? req.params.instituteName
      : null;
  const registration_requests = await adminService.getRegistrationRequests(
    instituteName
  );
  res.status(httpStatus.OK).send(registration_requests);
});

const getUploadRequests = catchAsync(async (req, res) => {
  const instituteName =
    req.params &&
    req.params.instituteName &&
    req.params.instituteName !== "null"
      ? req.params.instituteName
      : null;
  const upload_requests = await adminService.getUploadRequests(instituteName);
  res.status(httpStatus.OK).send(upload_requests);
});

const approveRegistration = catchAsync(async (req, res) => {
  await adminService.approveRegistration(req.body.user, req.body.admin);
  res.status(httpStatus.OK).send("Approved registration");
});

const rejectRegistration = catchAsync(async (req, res) => {
  // TODO emails service
  await adminService.rejectRegistration(req.body.user, req.body.admin);
  res.status(httpStatus.OK).send("Rejected registration");
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
  await adminService.rejectUpload(fileId);
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
  getAllInstitutions,
};
