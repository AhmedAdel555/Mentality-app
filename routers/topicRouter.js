const router = require("express").Router()
const {body, param} = require("express-validator")
const checkAuth = require("../util/isAuthenticated")
const isAdmin = require("../util/isAdmin")
const topicController = require("../controllers/topicController")
const Course = require("../models/course")
const Lesson = require("../models/lesson")
const Topic = require("../models/topic")
const multer  = require('multer')
const uploadSlides = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'slides')
        },
        filename: function (req, file, cb) {
            const uniquePuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniquePuffix + '-' + file.originalname)
        }
        }),
    fileFilter: function (req, file, cb) {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
})

router.post("/courses/:courseId/lessons/:lessonId/topics/add-topic",
uploadSlides.single('slides'),
[
    body("name").trim().isLength({min:3}),
    body("order").trim().isNumeric(),
    body("contentType").trim().isIn(["lecture", "quiz","Lecture", "Quiz"]),
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
],
checkAuth, isAdmin ,topicController.addTopic)

router.put("/courses/:courseId/lessons/:lessonId/topics/:topicId/update-topic",
uploadSlides.single('slides'),
[
    body("name").trim().isLength({min:3}),
    body("order").trim().isNumeric(),
    body("contentType").trim().isIn(["lecture", "quiz","Lecture", "Quiz"]),
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
    }),
    param("topicId").trim()
    .custom((value, {req})=>{
        return Topic.findById(value)
        .then((topic) => {
            if(!topic){
                return Promise.reject("topic is not exist")
            }
        })
    }),
],
checkAuth, isAdmin , topicController.updateTopic)

router.get("/courses/:courseId/lessons/:lessonId/topics",
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
])

router.get("/courses/:courseId/lessons/:lessonId/topics/:topicId",
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
    }),
    param("topicId").trim()
    .custom((value, {req})=>{
        return Topic.findById(value)
        .then((topic) => {
            if(!topic){
                return Promise.reject("topic is not exist")
            }
        })
    }),
]
)
module.exports = router

