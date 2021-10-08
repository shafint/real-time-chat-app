const express=require('express');
const router=express.Router();
const {auth_gard}=require("../middleware/common/auth_gard")
const {messageSent,messageGet,messageGetsingle}=require("../controller/messageController")


//creating messages
router.post("/sent",auth_gard,messageSent)
//message getting
router.get("/get/:conversation",auth_gard, messageGet)
router.get("/getsingle/:conversation",auth_gard, messageGetsingle)

module.exports =router