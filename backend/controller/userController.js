const userModel=require("../schema/usersList")


//contact findings for user schema

async function findUser(req,res){
    try{
      const findUser=await userModel.findOne({phone:req.params.number})
      if(findUser){
          res.status(200).json({data:{msg:findUser}})
      }else{
          throw new Error("User not found")
      }
    }catch(err){
      res.status(500).json({ errors: { msg: err.message } });
    }
  }


  // admin find users


  async function adminFindUser(req,res){
    try{
        if(req.body.user.roll==="admin"){
            const findAllUsers=await userModel.find({});
            if(findAllUsers.length>0){
                res.status(200).send({data:{msg:findAllUsers}})
            }else{
                throw new Error('Something worng please Try again')
            }
        }else{
       throw new Error("you not an admin");       
        }
  
    }catch(err){
        res.status(500).json({ errors: { msg: err.message } });
    }
}

// is login
async function islogin(req,res){
    if(Object.keys(req.body.user).length>0){
        res.status(200).json({data:req.body.user})
    }else{
        res.status(500).json({errors:false})
    }
}

//user signout functions
async function signOut(req,res){
    if(Object.keys(req.body.user).length>0){
        res.clearCookie(process.env.COOKIE_NAME)
        res.status(200).json({ data:"Logout Successfully"})
    }
}


  module.exports={findUser,adminFindUser,islogin,signOut}