const mongoose = require("mongoose")

const lessonShcema = mongoose.Schema({
    name : {type: String, required: true},
    course: {type: mongoose.Schema.Types.ObjectId, ref: "course" , required: true},
    order: {type: Number, required: true},
    users: [
        {type: mongoose.Schema.Types.ObjectId,ref: "user"}
    ]
},{timestamps: true})

module.exports = mongoose.model("lesson", lessonShcema, "lesson")