const router = require("express").Router()
const {body} = require("express-validator")
const courseController = require("../controllers/courseController")
const checkAuth = require("../util/isAuthenticated")
const isAdmin = require("../util/isAdmin")
const multer  = require('multer')
const uploadImages = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'images')
        },
        filename: function (req, file, cb) {
            const uniquePuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniquePuffix + '-' + file.originalname)
        }
        }),
    fileFilter: function (req, file, cb) {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
})

router.post("/courses/add-course", 
uploadImages.single("image"),
[
    body("name").trim().isLength({min: 3}),
    body("description").trim().isLength({min: 10}),
    body("price").custom((value,{req}) => {
        if(isNaN(value)){
            throw new Error("invalid value");
        }
        else if (+value < 0 || +value > 3000){
            throw new Error("price must be in range 0 : 3000");
        }
        return true
    })
],
checkAuth, isAdmin,
courseController.addCourse)

router.put("/courses/:courseId/update-course", 
uploadImages.single("image"),
[
    body("name").trim().isLength({min: 3}),
    body("description").trim().isLength({min: 10}),
    body("price").custom((value,{req}) => {
        if(isNaN(value)){
            throw new Error("invalid value");
        }
        else if (+value < 0 || +value > 3000){
            throw new Error("price must be in range 0 : 3000");
        }
        return true
    })
],
checkAuth, isAdmin, courseController.updateCourse)

router.get("/courses",courseController.readAllCourses)

router.get("/courses/:courseId",courseController.readOneCourse)

module.exports = router