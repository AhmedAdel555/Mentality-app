const jwt = require("jsonwebtoken")
const config = require('config');
const throwError = require("./throwError")
const path = require("path")
const fs = require("fs")
let clearImage = function(imagePath){
    p = path.join(__dirname, "..", imagePath)
    fs.unlink(p, (err) => {
        console.log(err)
    })
}
module.exports = (req, res, next) => {
    let token = req.get("Authorization")
    if(!token){
        if(req.file){
            clearImage(req.file.path)
        }
        throwError("not authentication", 401)
    }
    let decodedToken
    try{
        decodedToken = jwt.verify(token, config.get("SECRET_KEY"))
    }catch(err){
        if(req.file){
            clearImage(req.file.path)
        }
        throw(err)
    }
    if(!decodedToken){
        if(req.file){
            clearImage(req.file.path)
        }
        throwError("not authentication", 401)
    }
    req.userId = decodedToken.userId
    next()
}