const express = require("express");
// const auth = require('../../middlewares/auth');
const validate = require("../../middlewares/validate");
const statsController = require("../../controllers/stats.controller");
const { userValidation } = require("../../validations");

const router = express.Router();

router
  .route("/")
  // .post(validate(userValidation.createUser), userController.createUser)
  .get(statsController.getStats);
//   .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);


module.exports = router;
