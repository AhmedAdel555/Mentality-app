const router = require("express").Router()
const {body} = require("express-validator")
const User = require("../models/user")
const userController = require("../controllers/userController")

router.post("/sign-up", [
    body("email").trim().isEmail()
   .custom((value) => {
        return User.findOne({email: value})
        .then((user) => {
            if(user){
                return Promise.reject("email is already exist")
            }
        })
   }),
   body("password").trim().isLength({min: 5}),
   body("passwordConfirmation").trim().isLength({min: 5})
   .custom((value,{ req }) => {
    if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
   }),
   body("firstName").trim().isLength({min: 3}),
   body("lastName").trim().isLength({min: 3}),
   body("gender").trim().isIn([ "Male", "Female" , "male", "female", "not specified"])
] ,userController.signUp)

router.post("/sign-in",[
    body("email").trim().isEmail(),
    body("password").trim().isLength({min: 5}),
],userController.signIn)

router.post("/sign-in-with-google", userController.signInWithGoogle)

module.exports = router