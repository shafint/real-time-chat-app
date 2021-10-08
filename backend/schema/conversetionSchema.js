const mongoose = require("mongoose");

const conversectionSchema = new mongoose.Schema(
  {
    creator:{
      id:mongoose.Types.ObjectId,
      name:String,
      avater:String,
      roll:{
        type:String,
        enum:["user","admin"],
        default:"user"
      }
    },
    participant:{
      id:mongoose.Types.ObjectId,
      name:String,
      avater:String,
      roll:{
        type:String,
        enum:["user","admin"],
        default:"user"
      }
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamp: true,
  }
);

const conversectionModel = new mongoose.model(
  "Conversation",
  conversectionSchema
);

module.exports = conversectionModel;
