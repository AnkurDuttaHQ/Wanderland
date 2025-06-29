const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { saveUrl } = require("../middleware");
const userController = require("../Controllers/user")


router
.route("/signup")
.get( userController.signupForm)
.post( wrapasync(userController.postSignup));

router
.route("/login")
.get( userController.loginForm)
.post( saveUrl, passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true }),
        userController.postlogin);

 router.get("/logout", userController.logout);


module.exports = router