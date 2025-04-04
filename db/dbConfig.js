const mysql = require("mysql2");
const dbConnection = mysql.createPool({
  user: process.env.DB_User,
  database: process.env.DB_Name,
  host: process.env.DB_Host,
  password: process.env.DB_Password,
});

const userTable = `CREATE TABLE if not exists users(
    user_id INT(20) auto_increment PRIMARY KEY,
    user_Name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
)`;
const questions = `CREATE TABLE if not exists questions(
        id INT(20) NOT NULL AUTO_INCREMENT,
        question_id VARCHAR(100) NOT NULL UNIQUE,
        user_id INT(30) NOT NULL,
        title VARCHAR(100) NOT NULL,
        description VARCHAR(255) NOT NULL,
        tag VARCHAR(20),
        PRIMARY KEY(id,question_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`;

const answers = `CREATE TABLE if not exists answers(
        answer_id INT(30) AUTO_INCREMENT,
        user_id INT(30) NOT NULL,
        question_id VARCHAR(100) NOT NULL,
        answer VARCHAR(255) NOT NULL,
        PRIMARY KEY(answer_id, user_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (question_id) REFERENCES questions(question_id)
)`;

dbConnection.query(userTable, (err, res) => {
  if (err) {
    console.log(err);
  }
  console.log("userTable created");
});

dbConnection.query(questions, (err, res) => {
  if (err) {
    console.log(err);
  }
  console.log("questionsTable created");
});

dbConnection.query(answers, (err, res) => {
  if (err) {
    console.log(err);
  }
  console.log("answersTable created");
});

module.exports = dbConnection.promise();
