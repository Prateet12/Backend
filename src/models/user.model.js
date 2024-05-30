const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const { toJSON, paginate } = require("./plugins");
const { Timestamp } = require("mongodb");
const { required } = require("@hapi/joi");

const userSchema = mongoose.Schema(
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
    role: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Role", // TODO(aadijain): make this required
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      private: true, // used by the toJSON plugin
    },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
    // OPTIONAL FIELDS:
    phone_number: {
      type: String,
      trim: true,
    },
    institution_name: {
      type: String,
      trim: true,
    },
    institution_type: {
      type: String,
      trim: true,
    },
    institution_address: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    field_of_study: {
      type: String,
      trim: true,
    },
    highest_degree_earned: {
      type: String,
      trim: true,
    },
    graduation_date: {
      // This will only have month and year
      type: String,
      trim: true,
    },
    industry_sector: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    job_title: {
      type: String,
      trim: true,
    },
    job_position: {
      type: String,
      trim: true,
    },
    years_of_experience: {
      type: Number,
    },
    areas_of_interest: {
      type: [String],
      default: [],
    },
    areas_of_study: {
      type: [String],
      default: [],
    },
    // TODO(aadijain): double check this
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
