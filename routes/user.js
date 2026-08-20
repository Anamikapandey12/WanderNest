const express = require("express");
// const { UserExistsError } = require("passport-local-mongoose/dist/lib/errors");
const router = express.Router();
// const User = require("../Models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController=require("../controller/user")

     router.route("/signup")
     .get(userController.renderSignup)
    .post(wrapAsync(userController.signUP));


    router
    .route("/login")
    .get(userController.renderLogin)
    .post(
  saveRedirectUrl,
 passport.authenticate("local", {
   failureRedirect:'/login',
   failureFlash:true,
 }),
 userController.login,
 );
router.get("/logout",userController.logout)


module.exports=router;