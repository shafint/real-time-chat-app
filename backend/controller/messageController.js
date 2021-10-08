const conversationModel = require("../schema/conversetionSchema");
const messageModel = require("../schema/messageSchema");
//message getting

async function messageGet(req, res) {
  try {
    const conversection = await conversationModel.findOne({
      _id: req.params.conversation,
    });
    if (conversection) {
      const gettingMSG = await messageModel.find({
        conversation: req.params.conversation,
      }).sort("-createdAt");
      if (gettingMSG.length > 0) {
        
        res.status(200).json({ data: gettingMSG  });
      } else {
        throw new Error("Start Messages !");
      }
    } else {
      throw new Error("Can't find this conversections and msg");
    }
  } catch (err) {
    res.status(500).json({ errors: err.message });
  }
}



//sendeing messages to the message schema

async function messageSent(req,res){
    try{
            const findConversections=await conversationModel.findOne({_id:req.body.conversation});
            if(findConversections){
                const messageAdd= await messageModel(req.body);
                const messageSaved=await messageAdd.save();
                if(messageSaved){
                    res.status(200).json({data:messageSaved});

                }else{
                    throw new Error("something wrong on your data")
                }
            }else{
                throw new Error('No conversation found')
            }
    }catch(err){
        res.status(500).json({ errors: err.message });
    }
}






//SingleMessage getting 

async function messageGetsingle(req, res) {
  try {
    const conversection = await conversationModel.findOne({
      _id: req.params.conversation,
    });
    if (Object.keys(conversection).length>0) {
      const gettingMSG = await messageModel.find({
        conversation: req.params.conversation,
      }).sort("-createdAt").limit(1);
      if (gettingMSG.length > 0){
        res.status(200).json({ data: gettingMSG  });
      } else {
        throw new Error("Start Messages!");
      }
    } else {
      throw new Error("Can't find this conversections and msg");
    }
  } catch (err) {
    res.status(500).json({ errors: err.message })
  }
}








module.exports = {
  messageGet,
  messageSent,
  messageGetsingle
};
