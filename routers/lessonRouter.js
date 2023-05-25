const router = require("express").Router()
const lessonController = require("../controllers/lessonController")
const {body, param} = require("express-validator")
const Course = require("../models/course")
const Lesson = require("../models/lesson")
const checkAuth = require("../util/isAuthenticated")
const isAdmin = require("../util/isAdmin")

router.post("/courses/:courseId/lessons/add-lesson",
[
    body("name").trim().isLength({min: 5}),
    body("order").trim().isNumeric(),
    param("courseId").trim()
    .custom((value, {req})=>{
        return Course.findById(value)
        .then((course) => {
            if(!course){
                return Promise.reject("course is not exist")
            }
        })
    })
]
,checkAuth, isAdmin, lessonController.addLesson)

router.put("/courses/:courseId/lessons/:lessonId/update-lesson", 
[
    param("courseId").trim()
    .custom((value, {req})=>{
        return Course.findById(value)
        .then((course) => {
            if(!course){
                return Promise.reject("course is not exist")
            }
        })
    }),
    param("lessonId").trim()
    .custom((value, {req})=>{
        return Lesson.findById(value)
        .then((lesson) => {
            if(!lesson){
                return Promise.reject("lesson is not exist")
            }
        })
    })
]
,checkAuth, isAdmin, lessonController.updateLesson)

router.get("/courses/:courseId/lessons",
[
    param("courseId").trim()
    .custom((value, {req})=>{
        return Course.findById(value)
        .then((course) => {
            if(!course){
                return Promise.reject("course is not exist")
            }
        })
    })
] 
,lessonController.allLessons)

router.get("/courses/:courseId/lessons/:lessonId", 
[
    param("courseId").trim()
    .custom((value, {req})=>{
        return Course.findById(value)
        .then((course) => {
            if(!course){
                return Promise.reject("course is not exist")
            }
        })
    }),
    param("lessonId").trim()
    .custom((value, {req})=>{
        return Lesson.findById(value)
        .then((lesson) => {
            if(!lesson){
                return Promise.reject("lesson is not exist")
            }
        })
    })
]
, lessonController.getLesson)

module.exports = router