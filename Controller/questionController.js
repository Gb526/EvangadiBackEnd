const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

async function askQuestion(req, res) {
  const { title, description } = req.body;
  const question_id = uuidv4();
  //  console.log(questionid);
  //user id extracted from authMiddleware
  const user_id = req.user.user_id;
  //   console.log(userid);
  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please enter all the required fields" });
  }
  try {
    await dbConnection.query(
      "INSERT INTO questions(question_id,user_id,title,description) VALUES(?,?,?,?)",
      [question_id, user_id, title, description]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "question posted successfully" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, please try again later" });
  }
}
async function allQuestion(req, res) {
  try {
    const [questions] = await dbConnection.query(`SELECT q.*, u.user_Name 
    FROM questions q 
    INNER JOIN users u ON q.user_id = u.user_id 
    ORDER BY q.id DESC `);
    if (questions.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "please enter all the required fields" });
    }
    return res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, please try again later" });
  }
}
async function singleQuestion(req, res) {
  const { question_id } = req.params;
  try {
    const query = `SELECT * FROM questions  WHERE  question_id = ?`;
    const [question] = await dbConnection.query(query, [question_id]);

    if (question.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "please enter all the required fields" });
    }
    return res.status(StatusCodes.OK).json({question});
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, please try again later" });
  }
}

module.exports = { askQuestion, allQuestion, singleQuestion };