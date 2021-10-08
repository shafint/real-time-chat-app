const bcrypt = require("bcrypt");
const userModal = require("../schema/usersList");
const { unlink } = require("fs");
const path = require("path");

//signup Process

async function signUp(req, res, next) {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 12);
    if (req.files.length === 0) {
      const data = new userModal({ ...req.body, password: hashPassword });
      const createdData = await data.save();

      if (Object.keys(createdData).length === 0) {
        throw new Error("Error saving");
      }

      res.status(200).json({ success: createdData });
    } else if (req.files.length > 0) {
      const { filename } = req.files[0];
      const data = await new userModal({
        ...req.body,
        password: hashPassword,
        avater: req.files[0].filename,
      });
      const savedData = await data.save();
      if (Object.keys(savedData).length === 0) {
        unlink(
          path.join(__dirname,`../public/avaterPhotos/${filename}`),
          (err) => {
            if (err) console.log(err);
          }
        );
        throw new Error("Error saving");
      }
      //sent res
      res.status(200).json({ success: savedData });
    }
  } catch (err) {
    res.status(500).json({ errors: err.message });
  }
}

//End signup process

module.exports = {
  signUp,
};
