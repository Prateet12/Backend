const Joi = require("@hapi/joi");
const { password, objectId } = require("./custom.validation");

const schemas = {
  admin: Joi.object({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  institutionAdmin: Joi.object({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      institution: Joi.string().required(),
    }),
  }),
  user: Joi.object({
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
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const register = Joi.object({
  role: Joi.string().required(),  // TODO(team): make this fetched from db
  userDetails: Joi.object({
    details: Joi.alternatives()
      .conditional(Joi.ref('..role'), { is: 'admin', then: schemas.admin })
      .conditional(Joi.ref('..role'), { is: 'institution admin', then: schemas.institutionAdmin })
      .conditional(Joi.ref('..role'), { not: Joi.valid('admin', 'institution admin'), then: schemas.user })
  }).required()
}).required();

module.exports = {
  login,
  refreshTokens,
  register,
};
