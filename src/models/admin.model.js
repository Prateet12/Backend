const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { toJSON, paginate } = require("./plugins");

// Admin is a type of user with excess permissions and responsibilities
const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      private: true, // used by the toJSON plugin
    },
    role: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Role", // TODO(aadijain): make this required
      required: true,
    },
    file_requests: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "FileStore",
      default: [],
    },
    registration_requests: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "User",
      default: [],
    },
    admin_registration_requests: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "Admin",
      default: [],
    },
    institution: {
      type: String,
      default: null, // SUPERADMIN
      unique: true, // consider making this required
      trim: true,
      lowercase: true, // This will automatically convert the institution to lowercase
    },
    tell_me_about_yourself:{
      type:String,
      trim:true
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
adminSchema.plugin(toJSON);
adminSchema.plugin(paginate);

adminSchema.pre("save", function (next) {
  if (this.institution) {
    this.institution = this.institution.toLowerCase();
  }
  next();
});

// THERE CAN ONLY BE 1 Admin == IDFC foundation for now
// If the admin with NO institution is already created, return that
// else returns null
adminSchema.statics.getAdmin = async function () {
  try {
    const admin = await this.findOne({ institution: null });
    return admin;
  } catch (error) {
    console.error("Error getting admin:", error);
    throw error;
  }
};
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
adminSchema.methods.isPasswordMatch = async function (password) {
  const admin = this;
  return bcrypt.compare(password, admin.password);
};

// Returns the admin object if it exists,
// each institution can have only 1 admin
adminSchema.statics.getInstituteAdmin = async function (institution) {
  if (!institution) {
    return null;
  }
  const admin = await this.findOne({ institution: institution });
  return admin;
};

adminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

/**
 * @typedef Admin
 */
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
