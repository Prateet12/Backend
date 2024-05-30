const express = require("express");
const upload = require("../../middlewares/multer");

const fileController = require("../../controllers/fileHandler.controller");

const router = express.Router();

router.post("/upload", upload.array("files", 2), fileController.uploadFile);
router.delete("/delete/:id", fileController.deleteFile);
router.post("/userFiles", fileController.getUserFiles);
router.get("/fileCount", fileController.getFileCount);
router.get("/all", fileController.getAllFiles);
router.get("/:id", fileController.getFileById);
// TODO(team): Here need to add validation based on filetype -
// if 2 files were there originally we should possibly unlink both --
// Needs to be a transaction
router.put('/updateFile', upload.array("files", 2), fileController.updateFile);

module.exports = router;