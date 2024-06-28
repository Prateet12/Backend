const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { User, Role, Admin } = require("../models");

// const emailService = require('./email.service');
// const randomPwdService = require('./random.service');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  console.log("Hi from user service createUser, with userBody: ", userBody);
  if (userBody.email !== "") {
    if (await User.isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is required");
  }
  // Create the user but don't activate them yet
  let user = await User.create(userBody);

  const instituteAdmin = await Admin.getInstituteAdmin(userBody.institution_name);
  if (instituteAdmin) {
    instituteAdmin.registration_requests.push(user._id);
    await instituteAdmin.save();
  }
  const admin = await Admin.getAdmin();
  if (admin) {
    admin.registration_requests.push(user._id);
    await admin.save();
  }
  return user;
};

const getUsers = async () => {
  console.log("Hi from user service getUsers");
  // TODO(aadijain): paginate and query commands add here
  const users = await User.find({ verified: true });
  return users;
};

const getUserByEmailId = async (email) => {
  // let body = userBody;
  console.log("Hi from user service getUserByEmailId, with email: ", email);
  const user = await User.findOne({ email: email });
  if (!user) {
    console.log("User not found, trying admin login");
    // throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

const getUserById = async (userId) => {
  console.log("Hi from user service getUserById, with userId: ", userId);
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

module.exports = {
  createUser,
  getUsers,
  getUserByEmailId,
  getUserById,
  updateUserById
};
