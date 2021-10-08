const express=require('express');
const router=express.Router();
const {signUp}=require("../controller/signupUserController")
const {imgSetup,dataChecking,addUserValidationsHandeller}=require("../middleware/signUpuser")
const {signInDataValidation,handleSigninValidation}=require("../middleware/signInUser")
const {siginProcess}=require("../controller/signInUserController")
const {veryfyUserToken}=require("../controller/veryfyUserToken")
const {findUser,adminFindUser,islogin,signOut,contactList}=require("../controller/userController")
const {auth_gard}=require("../middleware/common/auth_gard")
//user Add route
router.post("/signup",imgSetup,dataChecking,addUserValidationsHandeller,signUp);
//end user Add route

// signin user 
router.post("/signin",signInDataValidation,handleSigninValidation,siginProcess)

// veryfy user
router.get("/veryfy",veryfyUserToken)


// user finding
router.get("/find/:number",auth_gard,findUser)

// admin find alluser users
router.get("/findadmin",auth_gard,adminFindUser)
router.get("/issign",auth_gard,islogin)

router.get("/signout",auth_gard,signOut)
module.exports=router



