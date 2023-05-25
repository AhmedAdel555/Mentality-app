const Lesson = require("../models/lesson")
const { validationResult } = require("express-validator")
const throwError = require("../util/throwError")
exports.addLesson = (req, res, next) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        throwError("invalid inputs", 422, errors)
    }
    let doAddLesson = async function(){
        try{
            let newLesson = new Lesson({
                name : req.body.name,
                course: req.params.courseId,
                order: req.body.order
            })
            let savedLesson = await newLesson.save()
            res.status(200).json({message: "lessons added succesfully", lesson: {_id: savedLesson._id , name:savedLesson.name, order: savedLesson.order, courseId: savedLesson.course}})
        }catch(err){
            next(err)
        }
    }
    doAddLesson()
}

exports.allLessons = (req,res,next) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        throwError("invalid inputs", 422, errors)
    }
    let doReadAllLessons = async function(){
        try{
            let lessons = await Lesson.find().where({course: req.params.courseId}).sort({order:1}).select("name order").exec()
            if(!lessons){
                throwError("fail to get data from database")
            }
            res.status(200).json({message: "succeded", courseId: req.params.courseId, lessons: lessons})
        }catch(err){
            next(err)
        }
    }
    doReadAllLessons()
}

exports.getLesson = (req, res, next) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        throwError("invalid inputs", 422, errors)
    }
    let dogetLesson = async function(){
        try{
            let lesson = await Lesson.findById(req.params.lessonId).select("name order").exec()
            if(!lesson){
                throwError("lesson is not found")
            }
            res.status(200).json({message: "succeded", lesson:lesson})
        }catch(err){
            next(err)
        }
    }
    dogetLesson()
}

exports.updateLesson = (req, res,next) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        throwError("invalid inputs", 422, errors)
    }
    let doUpdateLesson = async function(){
        try{
            let lesson = await Lesson.findById(req.params.lessonId)
            if(!lesson){
                throwError("falid to get data")
            }
            lesson.name = req.body.name
            lesson.order = req.body.order
            let updatedLesson = await lesson.save()
            res.status(200).json({message:"succeded", lesson: updatedLesson})
        }catch(err){
            next(err)
        }
    }
    doUpdateLesson()
}

