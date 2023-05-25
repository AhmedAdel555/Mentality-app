const Course = require("../models/course")
const { validationResult } = require("express-validator")
const throwError = require("../util/throwError")
const path = require("path")
const fs = require("fs")
let clearImage = function(imagePath){
    p = path.join(__dirname, "..", imagePath)
    fs.unlink(p, (err) => {
        console.log(err)
    })
}

exports.addCourse = (req, res, next) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        if(req.file){
            clearImage(req.file.path)
        }
        throwError("invalid inputs", 422, errors)
    }
    let doAddCourse = async function(){
        try{
            let newCourse = new Course({
                name : req.body.name,
                image : req.file.path,
                description: req.body.description,
                price: req.body.price,
            })
            let course = await newCourse.save()
            res.status(201).json({message: "course created successfuly", courseId: course._id})
        }catch(err){
            if(req.file){
                clearImage(req.file.path)
            }
            next(err)
        }
    }
    doAddCourse()
}

exports.updateCourse = (req, res,next) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        if(req.file){
            clearImage(req.file.path)
        }
        throwError("invalid inputs", 422, errors)
    }
    const courseId = req.params.courseId
    let doUpdate = async function(){
       try{
        if(req.file){
            let course = await Course.findById(courseId)
            if(!course){
                throwError("course is not found", 404)
            }
            clearImage(course.image)
            course.name = req.body.name
            course.image = req.file.path
            course.description= req.body.description
            course.price= req.body.price
            let updatedCourse = await course.save()
            res.status(200).json({message: "course updated succesfully", courseId: updatedCourse._id})
        }
        else{
            let course = await Course.findById(courseId)
            if(!course){
                throwError("course is not found", 404)
            }
            course.name = req.body.name
            course.description= req.body.description
            course.price= req.body.price
            let updatedCourse = await course.save()
            res.status(200).json({message: "course updated succesfully", courseId: updatedCourse._id})
        }
       }catch(err){
            if(req.file){
                clearImage(req.file.path)
            }
            next(err)
       }
    }
    doUpdate()
}

exports.readAllCourses = (req, res, next) => {
    let doReadAllCourses = async function(){
        try{
            let courses = await Course.find().select("name image description price").exec();
            if(!courses){
                throwError("fail to get data from database")
            }
            res.status(200).json({messgae: "succeded" , courses: courses})
        }catch(err){
            next(err)
        }
    }
    doReadAllCourses()
}

exports.readOneCourse = (req, res, next) => {
    let doReadOneCourse = async function(){
        try{
            const courseId = req.params.courseId
            let course = await Course.findById(courseId).select("name image description price").exec();
            if(!course){
                throwError("fail to get data from database")
            }
            res.status(200).json({messgae: "succeded" ,course: course})
        }catch(err){
            next(err)
        }
    }
    doReadOneCourse()
}

