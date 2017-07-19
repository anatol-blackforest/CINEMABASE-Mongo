//загрузка нового изображения

const multer = require('multer');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/tmp/')
  },
  filename: function (req, file, cb) {
    cb(null, `cinemabase_${Date.now()}_${file.originalname}`);
  }
})

module.exports = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    let mime = file.mimetype;
    if (mime.indexOf('image') == -1) {
      cb(null, false);
    }else{
      cb(null, true);
    }
  }
}).single('preview');