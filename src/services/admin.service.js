const httpStatus = require("http-status");
const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const { User, Admin, Role, File } = require("../models");
const fileHandlerService = require("./fileHandler.service");

const getRegistrationRequests = async (instituteName) => {
  const admin = await Admin.findOne({ institution: instituteName });

  let requests = [];

  const users = await User.find({
    _id: { $in: admin.registration_requests },
    verified: false,
  });
  users.forEach((user) => {
    console.log("user: ", user);
    requests.push({
      id: user._id,
      user: user.name,
      created_at: user.createdAt,
      request_type: "User Registration",
      userDetails: user,
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
        request_type: "Admin Registration",
        userDetails: admin,
      });
    });
  }

  return { requests };
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
    admin.registration_requests = admin.registration_requests.filter(
      (id) => String(id) !== userId
    );
    const user = await User.findOne({ _id: userId });
    user.verified = true;
    user.status = "Approved";
    user.joinDate = new Date();
    await user.save();
    await admin.save();
    return;
  }
  if (
    admin.admin_registration_requests &&
    admin.admin_registration_requests.map(String).includes(userId)
  ) {
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

const rejectRegistration = async (userId, adminId) => {
  // TODO(team):email service to reject and send invitation
  // For now just reject by removing the current user id from the registration requests
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
    const user = await User.findOne({ _id: userId });
    const instituteAdmin = await Admin.getInstituteAdmin(user.institution_name);
    if (instituteAdmin) {
      instituteAdmin.registration_requests =
        instituteAdmin.registration_requests.filter(
          (id) => String(id) !== userId
        );
      await instituteAdmin.save();
    }
    user.verified = false;
    admin.registration_requests = admin.registration_requests.filter(
      (id) => String(id) !== userId
    );
    await user.save();
    await admin.save();
    return;
  }

  if (
    admin.admin_registration_requests &&
    admin.admin_registration_requests.map(String).includes(userId)
  ) {
    admin.admin_registration_requests =
      admin.admin_registration_requests.filter((id) => String(id) !== req);
    await admin.save();
    return;
  }

  throw new ApiError(
    httpStatus.NOT_FOUND,
    "User not found in registration requests"
  );
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
    const role = await Role.findOne({ role: adminData.role });
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

const getUploadRequests = async (instituteName) => {
  // Your code here
  const admin = instituteName
    ? await Admin.getInstituteAdmin(instituteName)
    : await Admin.getAdmin();
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }

  let query;
  if (instituteName) {
    query = {
      _id: { $in: admin.file_requests },
      $or: [{ institutionalAdminApproval: false }],
    };
  } else {
    query = {
      _id: { $in: admin.file_requests },
      adminApproval: false,
    };
  }

  const file_requests = await File.find(query).populate("fromUser");
  if (!file_requests) {
    throw new ApiError(httpStatus.NOT_FOUND, "No file requests found");
  }
  return file_requests;
};

const approveUpload = async (fileId, instituteName) => {
  try {
    console.log("approveUpload: ", fileId, instituteName);
    const file = await fileHandlerService.getFileById(fileId);
    console.log("File: ", file);
    if (!file) {
      throw new ApiError(httpStatus.NOT_FOUND, "File not found");
    }
    if (instituteName) {
      file.institutionalAdminApproval = true;
      file.status = "Approved by Institute Admin";
    } else {
      file.adminApproval = true;
      file.status = "Approved by Admin";
    }

    if (file.adminApproval && file.institutionalAdminApproval) {
      file.status = "Approved";
    }
    const admin = instituteName
      ? await Admin.getInstituteAdmin(instituteName)
      : await Admin.getAdmin();
    console.log("Admin: ", admin);
    if (!admin) {
      throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
    }
    admin.file_requests = admin.file_requests.filter(
      (id) => String(id) !== fileId
    );
    await admin.save();
    await file.save();
    return;
  } catch (error) {
    console.error("Error: ", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const rejectUpload = async (fileId) => {
  // Your code here
  if (!fileId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "File ID is required");
  }
  const file = await File.findOne({ _id: fileId }).populate("fromUser");
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, "File not found");
  }
  file.status = "Rejected";
  let instName = file.fromUser.institute_name;

  const instAdmin = await Admin.getInstituteAdmin(instName);
  if (!instAdmin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
  instAdmin.file_requests = instAdmin.file_requests.filter(
    (id) => String(id) !== fileId
  );

  const admin = await Admin.getAdmin();
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
  admin.file_requests = admin.file_requests.filter(
    (id) => String(id) !== fileId
  );

  await instAdmin.save();
  await admin.save();
  await file.save();
  return;
};

const getAllInstitutions = async () => {
  const admins = await Admin.find({});
  const institutions = admins.map((admin) => admin.institution).filter(Boolean);
  console.log("institutions: ", institutions);
  return institutions;
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
  getAllInstitutions,
};
