const {check,validationResult}=require("express-validator")
const userModal=require("../schema/usersList")

//signIn validations
const signInDataValidation=[
    check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({min:1})
    .withMessage("Email is required")
    .custom(async(value)=>{
        try{    
            const valueFind=await userModal.findOne({email:value});
            if(!valueFind){
                throw new Error("user information invalid");
            }
        }catch(err){
            throw new Error(err.message);
        }
    })
    ,
    check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({min:8})
    .withMessage("password must be longer than 8 characters")
]

// End signIn validations

async function handleSigninValidation(req,res,next){
        const err=validationResult(req)
        const mappedError=err.mapped();
        if(Object.keys(mappedError).length===0){
            next()
        }else{
            res.status(500).json({
                errors:mappedError,
                
            })
        }
}


module.exports={signInDataValidation,handleSigninValidation}