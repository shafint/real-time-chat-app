const conversectionModel = require("../schema/conversetionSchema");

//conversation controller
async function createConversation(req, res) {
  try {

    if(req.body.creator.id==req.body.participant.id){
      throw new Error("You cannot associate contracts with your own ID")
    }
    const isPresentConversetion = await conversectionModel.findOne({
      $or: [
        {
          "creator.id": req.body.creator.id,
          "participant.id": req.body.participant.id,
        },
        {
          "creator.id": req.body.participant.id,
          "participant.id": req.body.creator.id,
        },
      ],
    });

    if(isPresentConversetion){
      throw new Error("This id already added on your contact")
    }else{
      const add_data=await conversectionModel(req.body)
     const dataSaved=await add_data.save();
     res.status(200).json({ data:{msg:dataSaved}})
    }


  } catch (err) {
    res.status(500).json({ errors: { msg: err.message } });
  }
}


async function getConva(req,res){
 try{
  const allConversections=await conversectionModel.find({$or:[{"creator.id":req.body.user._id},{"participant.id":req.body.user._id}]}).sort("-createdAt");

  if(!allConversections.length>0){
    throw new Error("Please create a contact at list")
  }else{
    res.status(200).json({data:allConversections})
  }
 }catch(err){
    res.status(500).json({errors:err.message})
 }

}


module.exports = {
  createConversation,
  getConva
  
};
