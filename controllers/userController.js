const User = require("../models/user")
const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require('config');
const axios = require('axios');

let throwError = require("../util/throwError")

let makeToken = function(user){
    let token = jwt.sign(
        {userId: user._id.toString()},
        config.get("SECRET_KEY"), 
        {expiresIn: "6h"})
    return token
}

exports.signUp = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        throwError("invalid inputs", 422 , errors)
    }
    let doSignUp = async function(){
        try{
            let hashedPassowd = await bcrypt.hash(req.body.password, 12)
            req.body.password = hashedPassowd
            delete req.body.passwordConfirmation
            let newUser = new User({...req.body})
            let user = await newUser.save()
            let token = makeToken(user)
            res.status(201).json({message: "account created", token: token, expiresIn: "6h" ,user: {_id:user._id.toString(),name: user.firstName + user.lastName}})
        }catch(err){
            next(err)
        }
    }
    doSignUp()
}

exports.signIn = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        throwError("invalid inputs", 422 , errors)
    }
    async function doLogin(){
        try{
            let user = await User.findOne({email: req.body.email})
            if(!user){
                throwError("authentication failed invalid email", 401)
            }
            let EqualPass = await bcrypt.compare(req.body.password, user.password)
            if(!EqualPass){
                throwError("authentication failed invalid password", 401)
            }
            let token = makeToken(user)
            res.status(200).json({message: "login succeded", token: token, expiresIn: "6h" ,user: {_id:user._id.toString(),name: user.firstName + user.lastName}})
        }catch(err){
            next(err)
        }
    }
    doLogin()
}

exports.signInWithGoogle = (req, res, next) => {
    let dowork = async function(){
        try{
            const {googleAccessToken} = req.body;
            if(!googleAccessToken){
                throwError("google access token is not found", 404)
            }
            let response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
                headers: {
                    "Authorization": `Bearer ${googleAccessToken}`
                }
            })
            const user = await User.findOne({email:response.data.email})
            if (!user){
                const newUser = new User({
                    firstName : response.data.given_name,
                    lastName : response.data.family_name,
                    email : response.data.email,
                    gender : "not specified"
                })
                user = await newUser.save()
            }
            let token = makeToken(user)
            res.status(200).json({message: "sign in with google succeded", token: token, expiresIn: "6h" ,user: {_id:user._id.toString(),name: user.firstName + user.lastName}})
        }catch(err){
            next(err)
        }
    }
    dowork()
}