const express = require("express");
// const auth = require('../../middlewares/auth');
const validate = require("../../middlewares/validate");
const userController = require("../../controllers/user.controller");
const { userValidation } = require("../../validations");

const router = express.Router();

router
  .route("/")
  // .post(validate(userValidation.createUser), userController.createUser)
  .get(userController.getUsers);
//   .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route("/email")
  .post(
    validate(userValidation.getUserByEmailId),
    userController.getUserByEmailId
  );

router
  .route("/:userId")
  .get(validate(userValidation.getUserById), userController.getUserById);

module.exports = router;
