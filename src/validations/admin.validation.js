const Joi = require("@hapi/joi");
const { objectId } = require("./custom.validation");

const createAdmin = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
  }),
};

const createInstitutionAdmin = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    institution: Joi.string().required(),
  }),
};

const approveRegistration = {
  body: Joi.object().keys({
    user: Joi.string().custom(objectId).required(),
    admin: Joi.string().custom(objectId).required(),
    instituteName: Joi.string().allow(null),
  }),
};

module.exports = {
    createAdmin,
    createInstitutionAdmin,
    approveRegistration
}
