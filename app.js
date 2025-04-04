const express = require("express");
const app = express();
const port = 5500;
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./Route/userRoute");
const questionRoute= require('./Route/questionRoute')
const answer= require('./Route/answerRoute')

const dbConnection = require("./db/dbConfig");
const bodyparser = require("body-parser");
const cors= require('cors');

app.use(express.json());

//app.get('/',(req,res)=>{
// res.send('Welcome')
app.use(cors())
app.use(bodyparser.urlencoded({ extended: true }));
//})
app.use("/user", userRoute);
app.use("/api",questionRoute)
app.use("/api",answer)

async function start() {
  try {
    const result = await dbConnection.execute("select 'test'");
    app.listen(port);
    console.log("DB connection established");
    console.log(`listening on port  http://localhost:${port}`);
  } catch (err) {
    console.log(err.message);
  }
}
start();

module.exports = app;
