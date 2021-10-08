const mongoose=require("mongoose");

mongoose.connect(process.env.DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then((e)=>{
    console.log("Database connection succesfully")
}).catch((e)=>{
    console.log(e)
})