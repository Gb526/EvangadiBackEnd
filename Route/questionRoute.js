const express = require("express");
const router = express.Router();
const {
    askQuestion,
    singleQuestion,
    allQuestion,
} = require("../Controller/questionController");

const authMiddleware = require("../Middleware/authMiddleware");
router.post("/addQuestion",authMiddleware, askQuestion);
router.get("/question", authMiddleware,   allQuestion);
router.get("/question/:question_id", authMiddleware, singleQuestion);

module.exports = router;
