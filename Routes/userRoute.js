const express = require("express");
const { handleGetSignup, handleCreateUserSignup, handleGetSignin, handleUserSignin, handleDoLogout } = require("../Controllers/userController");

const router = express.Router();


router.get("/signup", handleGetSignup);
router.post("/user/signup", handleCreateUserSignup);
router.get("/signin", handleGetSignin);
router.post("/user/signin", handleUserSignin);
router.get("/logout", handleDoLogout)


module.exports = router;