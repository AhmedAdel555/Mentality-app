const mongoose = require("mongoose")

const lectureSchema = mongoose.Schema({
    videoUrl: {type: String, required: true},
    slidesUrl: {type: String, required: true}
})

module.exports = mongoose.model("lecture", lectureSchema, "lecture")