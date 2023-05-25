const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: false},
    gender: { type: String, enum: [ "Male", "Female" , "male", "female", "not specified"]},
    points :{type : Number, default: 0},
    courses: [
        {
            courseId: {type: mongoose.Schema.Types.ObjectId, ref: "course", required: true},
            progress: {type: Number, default: 0}
        }
    ],
    lessons: [
        {
            courseId: {type: mongoose.Schema.Types.ObjectId, ref: "lesson", required: true},
        }
    ],
    topics: [
        {
            courseId: {type: mongoose.Schema.Types.ObjectId, ref: "topic", required: true},
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model("user", userSchema, "user")