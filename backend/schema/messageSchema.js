const mongoose=require('mongoose');
 const messageSchema=new mongoose.Schema({
    text:{
        type: String,
    },
    atachment:{
        type: String,
    },
    conversation:{
        type:mongoose.Types.ObjectId,
        required: true,
    },
    sender:{
        id: mongoose.Types.ObjectId,
        name:String,
        avater: String,
        roll:{
            type:String,
            enum:["user","admin"],
            default:"user"
        }
    },
    receiver:{
        id: mongoose.Types.ObjectId,
        name:String,
        avater: String,
        roll:{
            type:String,
            enum:["user","admin"],
            default:"user"
        }
    },
    date_time:{
        type:Date,
        default:new Date().toGMTString()
    }
 },{
     timestamps:true
 });


 const messageModel=new mongoose.model("message",messageSchema);

module.exports=messageModel;
