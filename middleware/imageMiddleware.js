const multer = require("multer");
const path = require("path");

const storage = (tipeUpload) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadPath;
      if (tipeUpload === "ktp") {
        uploadPath = path.join(__dirname, "../storage/ktp");
      } else if (tipeUpload === "photo") {
        uploadPath = path.join(__dirname, "../storage/postJob");
      } else if (tipeUpload === "bukti") {
        uploadPath = path.join(__dirname, "../storage/bukti");
      } else {
        return cb("Error: Tipe upload tidak valid!");
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const originalname = file.originalname.toLowerCase().split(" ").join("_");
      cb(null, originalname);
    },
  });

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|svg/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Hanya file gambar (jpeg, jpg, png) yang diizinkan!");
  }
};

const uploadImage = (tipeUpload) =>
  multer({
    storage: storage(tipeUpload),
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });

module.exports = uploadImage;
