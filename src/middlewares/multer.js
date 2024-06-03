const multer = require('multer');
const path = require('path');

// Define storage configuration for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destination = path.join(process.cwd(),'src','public');
    cb(null,destination);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
module.exports = upload;
