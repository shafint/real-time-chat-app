const multer = require("multer");
const path = require("path");
const { check, validationResult } = require("express-validator");
const userModal = require("../schema/usersList");
const { unlink } = require("fs");

//fileUpload multer img
async function imgSetup(req, res, next) {
  //file path
  const avaterPath = path.join(__dirname, "../public/avaterPhotos");

  //allowed file types
  const allowedFile = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
  //storage Defiend
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, avaterPath);
    },
    filename: (req, file, cb) => {
      const extName = path.extname(file.originalname);
      const mkAvterName =
        file.originalname
          .replace(extName, "")
          .split(" ")
          .join("-")
          .toLowerCase() +
        "-" +
        Date.now();
      cb(null, mkAvterName + extName);
    },
  });

  //End storage Defiend

  // master file uploader functions
  const Upload = multer({
    storage,
    limits: {
      fileSize: 100000000000000000000000000,
    },
    fileFilter: (req, file, cb) => {
      if (allowedFile.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("only jpg , png , jpge file allow"));
      }
    },
  });

  // End master file uploader functions

  // upload function called and checking is err here?
  Upload.any()(req, res, (err) => {
    if (err===undefined){
      console.log(true)
      next();
    } else {
        console.log(err);
        res.status(500).json({
          errors: { file: err.message },
        });
    }
  });
}
//End upload function called and checking is err here?

// data validations handeller
const dataChecking = [
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({
      min: 1,
    })
    .withMessage("Username is required")
    .trim(),
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .custom(async function (value) {
      try {
        const responce = await userModal.findOne({
          email: value,
        });
        if (responce) {
          throw new Error("This emial is already stored in the database");
        }
      } catch (err) {
        throw new Error(err.message);
      }
    }),
  check("phone")
    .trim()
    .isMobilePhone("bn-BD")
    .withMessage("Mobile number must be a valid Bangladeshi mobile number")
    .custom(async (value) => {
      try {
        const res = await userModal.findOne({
          phone: value,
        });
        if (res) {
          throw new Error(
            "This mobile number is already stored in the database"
          );
        }
      } catch (err) {
        throw new Error(err.message);
      }
    }),
  check("password")
    .trim()
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
];
// End data validations handeller

// Data validationREsult err handeller
const addUserValidationsHandeller = (req, res, next) => {
  const err = validationResult(req);
  const errors = err.mapped();
  if (Object.keys(errors).length === 0) {
    next();
  } else {
    //deletion files
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `../public/avaterPhotos/${filename}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }
    res.status(501).json({
      errors,
    });
  }
};
// Data validationREsult err handeller

module.exports = {
  imgSetup,
  dataChecking,
  addUserValidationsHandeller,
};
