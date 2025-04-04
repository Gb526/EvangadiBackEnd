const express = require("express");
const router = express.Router();
const authMiddleWare = require("../Middleware/authMiddleware");

const { addAnswer, getAnswer } = require("../Controller/answerController");

router.post("/addanswer/:question_id", authMiddleWare, addAnswer);
router.get("/getanswer/:question_id",authMiddleWare, getAnswer);

module.exports = router;