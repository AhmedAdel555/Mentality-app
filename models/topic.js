const mongoose = require("mongoose")

const topicShcema = mongoose.Schema({
    name: {type: String, required: true},
    order: {type: Number, required: true},
    lesson: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "lesson"},
    contentType: { type: String, enum: ["lecture", "quiz","Lecture", "Quiz"]},
    contentLectureId: {type: mongoose.Schema.Types.ObjectId,ref: "lecture"},
    contentQuizId: {type: mongoose.Schema.Types.ObjectId,ref: "quiz"},
    users: [
        {type: mongoose.Schema.Types.ObjectId, ref: "user"}
    ]
})

module.exports = mongoose.model("topic", topicShcema, "topic")