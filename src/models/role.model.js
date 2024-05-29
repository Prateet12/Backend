const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const navPermissionSchema = new mongoose.Schema({
  route: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
}, { _id: false });

const rolesSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  permissions: {
    type: [String],
    default: [],
  },
  navPermissions: {
    type: [navPermissionSchema],
    default: [],
  },
});

// add plugin that converts mongoose to json
rolesSchema.plugin(toJSON);
rolesSchema.plugin(paginate);

/**
 * Check if role is taken
 * @param {string} role - The role to check
 * @returns {Promise<boolean>}
 */
rolesSchema.statics.isRoleTaken = async function (role) {
  const roleCount = await this.countDocuments({ role });
  return roleCount > 0;
};

/**
 * @typedef Role
 */
const Role = mongoose.model("Role", rolesSchema);

module.exports = Role;
