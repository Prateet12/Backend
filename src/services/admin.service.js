const httpStatus = require("http-status");
const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const { User, Admin, Role } = require("../models");
const { roleService } = require("./role.service");

const getRegistrationRequests = async (instituteName) => {
  const admin = await Admin.findOne({ institution: instituteName });
  console.log("getRegistrationRequests service " + " admin: ", admin);

  let requests = [];

  const users = await User.find({ _id: { $in: admin.registration_requests }, verified: false });
  users.forEach((user) => {
    console.log("user: ", user);
    requests.push({
      id: user._id,
      user: user.name,
      created_at: user.createdAt,
      request_type: "User Registration"
    });
  });
  if (instituteName == null) {
    // ie. is super admin
    const admins = await Admin.find({
      _id: { $in: admin.admin_registration_requests },
      verified: false,
    });
    admins.forEach((admin) => {
      console.log("admin: ", admin);
      requests.push({
        id: admin._id,
        user: admin.name,
        created_at: admin.createdAt,
        request_type: "Admin Registration"
      });
    });
  }

  return { requests };
};

const getUploadRequests = async (req, res) => {
  // Your code here
};

const approveRegistration = async (userId, adminId) => {
  console.log(
    "approveRegistration " + " adminId: " + adminId + " userData: ",
    userId
  );
  const admin = await Admin.findOne({ _id: adminId });
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
  if (!admin.verified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Admin not verified");
  }

  if (
    admin.registration_requests &&
    admin.registration_requests.map(String).includes(userId)
  ) {
    console.log("user found in registration requests");
    admin.registration_requests = admin.registration_requests.filter(
      (id) => String(id) !== userId
    );
    const user = await User.findOne({ _id: userId });
    user.verified = true;
    await user.save();
    await admin.save();
    return;
  }
  if (
    admin.admin_registration_requests &&
    admin.admin_registration_requests.map(String).includes(userId)
  ) {
    console.log("admin found in registration requests");
    admin.admin_registration_requests =
      admin.admin_registration_requests.filter((id) => String(id) !== userId);
    const newAdmin = await Admin.findOne({ _id: userId });
    newAdmin.verified = true;
    await newAdmin.save();
    await admin.save();
    return;
  }

  throw new ApiError(
    httpStatus.NOT_FOUND,
    "User not found in registration requests"
  );
};

const rejectRegistration = async (req, res) => {
  // TODO(team): Discuss what to do in this case and also for rejecting files
};

const approveUpload = async (req, res) => {
  // Your code here
};

const rejectUpload = async (req, res) => {
  // Your code here
};

const getAdminByEmail = async (email) => {
  console.log("getAdminByEmail service");
  const admin = await Admin.findOne({ email: email });
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
  return admin;
};

const createAdmin = async (adminData) => {
  console.log("createAdmin service: " + adminData);
  if (await Admin.getAdmin()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin already exists");
  } else {
    const admin = await new Admin(adminData);
    admin.verified = true;
    const role = await Role.findOne({ _id: adminData.role });
    console.log("role: ", role);
    if (!role) {
      throw new Error("Admin role not found");
    }
    admin.role = role._id;
    console.log("admin: ", admin);
    await admin.save();
    return admin;
  }
};

const createInstituteAdmin = async (adminData) => {
  // Only sends registration request to existing admin -- updates the admin obj
  // We can currently only have 1 institution admin per institution
  const admin = await Admin.getAdmin();
  if (!admin) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No Admin found to approve the request"
    );
  }
  const existingInstituteAdmin = await Admin.getInstituteAdmin(
    adminData.instituteName
  );
  if (existingInstituteAdmin && existingInstituteAdmin._id != admin._id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Institution admin already exists for this institution ${adminData.institution}`
    );
  } else {
    const registerInfo = {
      name: adminData.name,
      email: adminData.email,
      role: adminData.role,
      password: adminData.password,
      institution: adminData.instituteName,
    };
    const instituteAdmin = await new Admin(registerInfo);
    // send request to the current admin for approval
    admin.admin_registration_requests.push(instituteAdmin._id);
    await admin.save();
    await instituteAdmin.save(); // Save the new admin first to get an _id
    return instituteAdmin;
  }
};

// These will just update the admin or specified institutional admin objects
// requests
const updateRegistrationRequests = async (userData) => {
  const admin = !userData.institution_name
    ? await Admin.getAdmin()
    : Admin.getInstituteAdmin(userData.institution_name);
  if (!admin) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin not found");
  }
  // Check if user_id is provided before pushing to registration_request
  if (userData && userData._id) {
    admin.registration_request.push(userData._id);
    await admin.save();
  } else {
    // TODO(aadijain): just add validation instead at the route js level
    // updateRegistrationRequests should be called with atleast user_id
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");
  }
};

const updateUploadRequests = async (req, res) => {
  const admin = !req.body.institution
    ? await Admin.getAdmin()
    : Admin.getInstituteAdmin(req.body.institution);
  if (!admin) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin not found");
  }
};

module.exports = {
  getRegistrationRequests,
  getUploadRequests,
  approveRegistration,
  rejectRegistration,
  approveUpload,
  rejectUpload,
  createAdmin,
  createInstituteAdmin,
  updateRegistrationRequests,
  getAdminByEmail,
};
