const jwt = require("jsonwebtoken");
const userModel=require("../../schema/usersList")
async function auth_gard(req, res, next) {
  try {
    let cookies =
      Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    if (cookies) {
      const token = cookies[process.env.COOKIE_NAME];
      const verifyToken = await jwt.verify(token, process.env.SCETET_TOKEN);
      if (Object.keys(verifyToken).length>0) {

        req.body.user = verifyToken;
        const userData=await userModel.findOne({email:verifyToken.email})
        if(!userData){
          res.clearCookie(process.env.COOKIE_NAME)
          throw new Error("your account hasbeen deleted admin Please Register again")
        }
        next();
      } else {
        
        res.clearCookie(process.env.COOKIE_NAME)
        throw new Error("Invalid user");
      }
    } else {
      
      res.clearCookie(process.env.COOKIE_NAME)
      throw new Error("Invalid user");
    }
  } catch (err) {
    res.status(500).send({ errors: { msg: err.message } });
  }
}

module.exports = {
  auth_gard,
};
