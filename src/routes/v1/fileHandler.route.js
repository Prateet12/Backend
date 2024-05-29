const express = require('express');

const fileController = require('../../controllers/fileHandler.controller');

const router = express.Router();

// TODO(Sid): work on validation if possible, lowest priority
router.post('/upload', fileController.uploadFile);
router.post('/delete', fileController.deleteFile);
router.post('/userFiles', fileController.getUserFiles);

router.get('/all', fileController.getAllFiles);
router.get('/:id', fileController.getFileById);


module.exports = router;