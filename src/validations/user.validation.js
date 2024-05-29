const Joi = require("@hapi/joi");
const { objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    role: Joi.string().custom(objectId),
    password: Joi.string().required(),
    is_verified: Joi.boolean().allow(null),
    phone_number: Joi.string().allow(null),
    institution_name: Joi.string().allow(null),
    institution_type: Joi.string().allow(null),
    institution_address: Joi.string().allow(null),
    position: Joi.string().allow(null),
    field_of_study: Joi.string().allow(null),
    highest_degree_earned: Joi.string().allow(null),
    graduation_date: Joi.string().allow(null),
    industry_sector: Joi.string().allow(null),
    company: Joi.string().allow(null),
    job_title: Joi.string().allow(null),
    job_position: Joi.string().allow(null),
    years_of_experience: Joi.number().allow(null),
    areas_of_interest: Joi.array().items(Joi.string()).default([]),
    areas_of_study: Joi.array().items(Joi.string()).default([]),
  }),
};

const getUserByEmailId = {
  body: Joi.object().keys({
    email: Joi.string().required(),
  }),
};

const getUserById = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

// TODO(team): keep this updated

module.exports = {
  createUser,
  getUserById,
  getUserByEmailId,
};
