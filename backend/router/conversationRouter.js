const express = require("express");
const router = express.Router();
const { auth_gard } = require("../middleware/common/auth_gard");
const {
  createConversation,
  getConva,
} = require("../controller/conversationController");

router.post("/create", auth_gard, createConversation);

router.get("/get", auth_gard, getConva);

module.exports = router;
