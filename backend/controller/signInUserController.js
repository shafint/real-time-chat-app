const userModal = require("../schema/usersList");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {sentMail}=require("../middleware/common/sentMail")

async function siginProcess(req, res, next) {
  // console.log(req.body.username)
  try {
    const resPoncess = await userModal.findOne({email: req.body.email})


    const reshash = await bcrypt.compare(
      req.body.password,
      resPoncess.password
    );
    if (!reshash) {
      throw new Error("Userinformation invalid");
    }
    //user info sending with cookie
    const userInfo = {
      _id:resPoncess._id,
      username: resPoncess.username,
      email: resPoncess.email,
      roll: resPoncess.roll,
      phone: resPoncess.phone,
      avater:resPoncess.avater
    };
    // jwt token gen
    const token = await jwt.sign(userInfo, process.env.SCETET_TOKEN, {
      expiresIn: process.env.TOKEN_EXP,
    });
    //sending jwt token to http
    res.cookie(process.env.COOKIE_NAME, token, {
      maxAge: process.env.TOKEN_EXP,
      httpOnly: true,
      signed: true,
    });
    //mail sending
    if(resPoncess.confirm===false){
      sentMail(resPoncess.email,resPoncess.username,token)
    }
    // sending status code to server
    res.status(200).json({
      data: resPoncess
    });
  } catch (err) {
    res.status(500).json({
      errors:{default:err.message} 
    });
  }
}

module.exports = {
  siginProcess,
};
