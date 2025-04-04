const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
// add answers to the database
const addAnswer = async (req, res) => {
  const { question_id,  answer } = req.body;
  
 const user_id= req.user.user_id;
  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please fill the answer field" });
  }
  try {
    await dbConnection.query(
      `INSERT INTO answers (question_id, user_id, answer) VALUES (?, ?, ?) `,
      [question_id, user_id, answer]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "answer added successfully" });
  } catch (error) {
    console.log(error.message)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again" });
  }
};




async function getAnswer(req, res) {
  try {
    const { question_id } = req.params;
    console.log(question_id)

    const [answers] = await dbConnection.query(
      `SELECT answers.answer, users.user_Name FROM answers INNER JOIN users ON answers.user_id = users.user_id
            WHERE answers.question_id = ?`,
      [question_id]
    );
    if (answers.length > 0) {
        console.log(answers)
      return res.status(StatusCodes.OK).json({ answers });
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "no answers found" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong while fetching answers" });
  }
}


module.exports = { addAnswer, getAnswer };