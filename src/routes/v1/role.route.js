const express = require("express");
const { roleController } = require("../../controllers");


const router = express.Router();

router.get("/", roleController.getAllRoles);
router.get("/:roleId", roleController.getRole);

module.exports = router;