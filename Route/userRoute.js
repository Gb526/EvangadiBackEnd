const express = require("express");

const authMiddleWare= require('../Middleware/authMiddleware')
const { register, login , check} = require("../Controller/userController");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/check", authMiddleWare, check);

module.exports = router;





//const express = require("express");
//const router = express.Router();

/*user controllers*/
//const { register, login, checkUser } = require("../Controller/userController");

/*register route*/
//router.post("/register", register);

/*login user*/
//router.post("/login", login);

/*check user*/
//route.get('/check', checkUser)

//module.exports = router;
