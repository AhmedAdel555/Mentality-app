const mongoose = require("mongoose")


const quizSchema = mongoose.Schema({
    questions: [{type: String, required: true}],
    choices: [[{type: String, required: true}]],
    answers: [
        {
            quistion: {type: Number, required: true},
            answer: {type: Number, required: true}
        }
    ]
})

module.exports = mongoose.model("quiz", quizSchema, "quiz")