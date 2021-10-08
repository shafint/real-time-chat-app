const express=require('express');
const router=express.Router();
const {auth_gard}= require("../middleware/common/auth_gard")
const {dashboard,removeUser}=require("../controller/adminDashboard")

router.get("/users",auth_gard,dashboard)
router.delete("/removeuser",auth_gard,removeUser)

module.exports=router