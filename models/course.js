const mongoose = require("mongoose")

const courseShcema = mongoose.Schema({
        name : {type: String, required: true},
        image : {type: String, required: true},
        description: {type: String, required: true},
        price: {type: Number, required: true},
        users: [
            {type: mongoose.Schema.Types.ObjectId, ref: "user"}
        ]
}, {timestamps: true})

module.exports = mongoose.model("course", courseShcema, "course")