const express = require('express');

const authController = require('../../controllers/auth.controller');
const validate = require('../../middlewares/validate');
const { userValidation, authValidation } = require('../../validations');

const router = express.Router();

router.post('/register', authController.register); // create validation for this
router.post('/login', validate(authValidation.login), authController.login);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

// TODO(team): email service - to be implemented for registration agree or disagree


// router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
 router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

module.exports = router;