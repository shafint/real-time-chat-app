const mongoose=require("mongoose");


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min: [1, 'Too few word']
    },
    phone:{
        type:Number,
        required:true,
        min:[11,"Wrong Number write"],
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    avater:{
        type:String,
        unique:true,
    },
    roll:{
        type:String,
        enum:["admin","user"],
        default:"user",
    },
    confirm:{
        type:Boolean,
        enum:[true,false],
        default:false
    }
},{
    timestamps:true
});

const userModal=new mongoose.model("User",userSchema);
 
module.exports=userModal;