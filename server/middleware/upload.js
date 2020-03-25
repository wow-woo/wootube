const upload = async (req, res, next) => {
  const multer = require("multer");
  // const path = require("path");

  try {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/video/");
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
      }
    });

    // const fileFilter = (req, file, cb) => {
    //   const ext = path.extname(file.originalname);
    //   if (
    //     ext === ".mp4" ||
    //     ext === ".avi" ||
    //     ext === ".wmv" ||
    //     ext === ".mkv"
    //   ) {
    //     return cb(null, true);
    //   } else {
    //     return cb(null, false);
    //   }
    // };

    const setupload = await multer({ storage /*fileFilter*/ }).single("file");
    await setupload(req, res, next);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = upload;
