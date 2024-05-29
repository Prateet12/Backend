const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { roleService } = require("../services");


const getAllRoles = catchAsync(async (req, res) => {
  console.log("Hi from role controller getAllRoles");
  const roles = await roleService.getAllRoles();
  if (!roles) {
    throw new ApiError(httpStatus.NOT_FOUND, "Roles not found");
  }
  res.send(roles);
});

const getRole = catchAsync(async (req, res) => {
  console.log("Hi from role controller getRole");
  const role = await roleService.getRole(req.params.roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }
  res.send(role);
});


module.exports = {
    getAllRoles,
    getRole
}
