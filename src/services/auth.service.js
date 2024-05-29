const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const adminService = require("./admin.service");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  // const user = await userService.getUserByEmail(email);
  console.log("hi from auth service loginUserWithEmailAndPassword");
  const user = await userService.getUserByEmailId(email);
  console.log("user", user);
  if (user) {
    if (!user.verified) {
      // send a response with no object specifying user has not been yet approved by admin
      throw new ApiError(httpStatus.UNAUTHORIZED, "User not verified yet");
    }
    if (await user.isPasswordMatch(password)) {
      return user;
    } else {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Incorrect email or password"
      );
    }
  }
  const admin = await adminService.getAdminByEmail(email);
  if (!admin || !(await admin.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  if (!admin.verified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Admin not verified yet");
  }
  return admin;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      "refresh"
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.deleteOne();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  refreshAuth,
};
