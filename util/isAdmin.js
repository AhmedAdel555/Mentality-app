const User = require("../models/user")
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
    if(req.userId !== "640e05864fe93ed3d7cf34df"){
        if(req.file){
            clearImage(req.file.path)
        }
        throwError("you don't have a permission to access this page", 403)
    }
    next()
}