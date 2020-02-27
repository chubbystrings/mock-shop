const multer = require('multer');


const storage = multer.diskStorage({
  filename(req, file, cb) {
    cb(null, file.originalname);
  },

});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('file type not acceptable'));
    }
    return cb(undefined, true);
  },
  storage,
}).single('image');

module.exports = upload;
