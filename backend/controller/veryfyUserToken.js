const jwt = require("jsonwebtoken");
const userModal = require("../schema/usersList");
async function veryfyUserToken(req, res, next) {
  try {
    if (!req.query.token) {
      throw new Error("invalid user token");
    } else {
      const compareToken = await jwt.verify(
        req.query.token,
        process.env.SCETET_TOKEN
      );


      const updateVal = await userModal.findByIdAndUpdate(compareToken._id, {
        confirm: true,
      });
      if (updateVal) {
        res.status(200).send("Successfull");
      }else{
          throw new Error("can't find user ")
      }
    }
  } catch (err) {
    res.status(500).json({ error: { msg: err.message } });
  }
}

module.exports = { veryfyUserToken };
