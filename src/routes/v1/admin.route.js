const express = require('express');

const validate = require("../../middlewares/validate");
const { adminValidation } = require("../../validations");
const adminController = require('../../controllers/admin.controller');

const router = express.Router();

router.post('/create', validate(adminValidation.createAdmin), adminController.createAdmin);
router.post('/createInstituteAdmin', validate(adminValidation.createInstitutionAdmin),adminController.createInstituteAdmin);

router.post('/registrationRequests', adminController.getRegistrationRequests);
router.get('/uploadRequests', adminController.getUploadRequests);

router.post('/approveRegistration',  validate(adminValidation.approveRegistration),adminController.approveRegistration);
router.post('/rejectRegistration', adminController.rejectRegistration); // TODO(team): Discuss 

router.post('/approveUpload', adminController.approveUpload);
router.post('/rejectUpload', adminController.rejectUpload); // TODO(team): Discuss 


module.exports = router;