const httpStatus = require("http-status");
const { Role } = require("../models");
// const { getPreferences } = require('../utils/createPreferences');

const createRole = async (roleBody) => {
  console.log("Hi from role service createRole", roleBody);
  if (await Role.isRoleTaken(roleBody.role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Role already taken");
  }
  const role = await Role.create(roleBody);
  return role;
};

const getAllRoles = async () => {
  console.log("Hi from role service getAllRoles");
  const roles = await Role.find();
  return roles;
};

const getRole = async (roleId) => {
  console.log("Hi from role service getRole, with roleId: ", roleId);
  try {
    let role;
    if (roleId.match(/^[a-zA-Z]+$/)) {
      role = await Role.findOne({ role: roleId });
    } else {
      role = await Role.findOne({ _id: roleId });
    }
    if (!role) {
      throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
    }
    console.log("Role found in role service: ", role);
    return role;
  } catch (error) {
    console.error("Error in getRole:", error);
    throw error;
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRole,
};
