const Topic = require("../models/topic")
const Lecture = require("../models/lecture")
const Quiz = require("../models/quiz")
const { validationResult } = require("express-validator")
const throwError = require("../util/throwError")
const path = require("path")
const fs = require("fs")
let clearSlides = function(slidesPath){
    p = path.join(__dirname, "..", slidesPath)
    fs.unlink(p, (err) => {
        console.log(err)
    })
}

exports.addTopic = (req, res, next) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        if(req.file){
            clearSlides(req.file.path)
        }
        throwError("invalid inputs", 422, errors)
    }
    let lessonId = req.params.lessonId
    if(req.body.contentType === "lecture" || req.body.contentType === "Lecture" ){

        let doSaveVideo = async function(){
            try{
                let lecture = new Lecture({
                    videoUrl: req.body.content,
                    slidesUrl: req.file.path
                })
                let savedLecture = await lecture.save()
                let topic = new Topic({
                    name: req.body.name,
                    order: req.body.order,
                    lesson: lessonId,
                    contentType: req.body.contentType,
                    contentLectureId: savedLecture._id
                })
                let savedTopic = await topic.save()
                delete savedTopic.contentQuizId
                delete savedTopic.users
                res.status(200).json({message: "succeded", topic: savedTopic})
            }catch(err){
                if(req.file){
                    clearSlides(req.file.path)
                }
                next(err)
            }
        }
        doSaveVideo()

    }else if(req.body.contentType === "quiz" || req.body.contentType === "Quiz" ){
        let doSaveQuiz = async function(){
            try{
                let quiz = new Quiz({
                    questions: req.body.content.questions,
                    choices: req.body.content.choices,
                    answers: req.body.content.answers
                })
                let savedQuiz = await quiz.save()    
                let topic = new Topic({
                    name: req.body.name,
                    order: req.body.order,
                    lesson: lessonId,
                    contentType: req.body.contentType,
                    contentQuizId: savedQuiz._id
                })
                let savedTopic = await topic.save()
                delete savedTopic.contentLectureId
                delete savedTopic.users
                res.status(200).json({message: "succeded", topic: savedTopic})
            }catch(err){
                next(err)
            }
        }
        doSaveQuiz()
    }
}

exports.updateTopic = (req, res, next) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        throwError("invalid inputs", 422, errors)
    }
    let doUpdateTopic = async function(){
        try{
            if(req.body.contentType === "lecture" || req.body.contentType === "Lecture"){
                let topic = await Topic.findById(req.params.topicId)
                .select("name order contentLectureId")
                .exec()
                if(!topic){
                    throwError("fail to get data from database")
                }
                topic.name = req.body.name
                topic.order = req.body.order
                let updatedTopic = await topic.save()
                let lecture = await Lecture.findById(topic.contentLectureId)
                if(req.file){
                    clearSlides(lecture.slidesUrl)
                    lecture.slidesUrl = req.file.path
                }
                lecture.videoUrl = req.body.content
                let updatedLecture = await lecture.save()
                delete updatedTopic.contentQuizId
                delete updatedTopic.users
                res.status(200).json({message: "succeded", topic: {...updatedTopic._doc , lecture: updatedLecture}})
            }else if(req.body.contentType === "quiz" || req.body.contentType === "Quiz"){
                let topic = await Topic.findById(req.params.topicId)
                .select("name order contentQuizId")
                .exec()
                if(!topic){
                    throwError("fail to get data from database")
                }
                topic.name = req.body.name
                topic.order = req.body.order
                let updatedTopic = await topic.save()
                let quiz = await Quiz.findById(topic.contentQuizId)
                quiz.questions= req.body.content.questions
                quiz.choices= req.body.content.choices
                quiz.answers= req.body.content.answers
                let updatedQuiz = await quiz.save()
                delete updatedTopic.contentQuizId
                delete updatedTopic.users
                res.status(200).json({message: "succeded", topic: {...updatedTopic._doc , quiz: updatedQuiz}})
            }
        }catch(err){
            next(err)
        }
    }
    doUpdateTopic()
}

exports.getAllTopics = (req,res,next) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        throwError("invalid inputs", 422, errors)
    }
    let doGetAllTopics = async function(){
        try{
            let topics = await Topic.find()
            .where({lesson: req.params.lessonId})
            .sort({order:1})
            .select("name order contentType")
            .exec()
            if(!topics){
                throwError("fail to get data from database")
            }
            res.status(200).json({message: "succeded",lessonId: req.params.lessonId, topics: topics})
        }catch(err){
            next(err)
        }    
    }
    doGetAllTopics()
}

exports.getTopic = (req, res, next) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        throwError("invalid inputs", 422, errors)
    }
    let doGetTopic = async function(){
        try{
            let topic = await Topic.findById(req.params.topicId)
            .select("name order contentType")
            .exec()
            if(!topic){
                throwError("fail to get data from database or something wronge")
            }
            res.status(200).json({message: "succeded", topic: topic})
        }catch(err){
            next(err)
        }    
    }
    doGetTopic()
}