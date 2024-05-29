const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

const createUser = catchAsync(async (req, res) => {
  console.log(req.body);
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUserByEmailId = catchAsync(async (req, res) => {
  console.log("Hi from user controller getUserByEmailId", req.body);
  const user = await userService.getUserByEmailId(req.body.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

// Gets all users in the database
const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers();
  res.send(users);
});

module.exports = {
  createUser,
  getUsers,
  getUserByEmailId,
  getUserById,
};