const { response } = require("../app");
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { user_Name, first_name, last_name, email, password } = req.body;
  if (!user_Name || !first_name || !last_name || !email || !password) {
    return res.status(404).json({ msg: "please enter all value of fields " });
  }
  if (password.length < 5) {
    return res.status(404).json({ msg: "password must be 6 characters long" });
  }
  try {
    const [user] = await dbConnection.query(
      "SELECT user_Name, user_id from users where user_Name=? OR email=?",
      [user_Name, email]
    );
    if (user.length > 0) {
      return res.status(404).json({ msg: "user already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO users(user_Name, first_name,last_name, email, password) VALUES(?,?,?,?,?)",
      [user_Name, first_name, last_name, email, encryptedPassword]
    );

    {
      return res.status(201).json({ msg: "user register successfully " });
    }
  } catch (err) {
    console.log(err);
    return res.status(201).json({ msg: "internal server error " });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter values for all fields." });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT user_Name, user_id, password FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid user credentials." });
    }

    const isSamePassword = await bcrypt.compare(password, user[0].password);

    if (!isSamePassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid user credentials." });
    }

    const { user_Name, user_id } = user[0];

    const token = jwt.sign({ user_Name, user_id }, "secret", {
      expiresIn: "1d",
    });

    return res
      .status(StatusCodes.OK)
      .json({ msg: "User logged in successfully.", token, user_Name, user_id });
  } catch (error) {
    console.log(error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong. Please try again later." });
  }
}

async function check(req, res) {
  const { user_Name, user_id } = req.user;

  return res
    .status(StatusCodes.OK)
    .json({ msg: "Access granted.", user_Name, user_id });
}

module.exports = { register, login, check };


