const express = require('express')
const mongoose = require("mongoose")
const port = process.env.PORT || 3500
const app = express()
const path = require("path")
const authRouters = require('./routers/authRouter')
const courseRouters = require('./routers/courseRouter')
const lessonRouters = require('./routers/lessonRouter')
const topicRouters = require('./routers/topicRouter')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/images', express.static(path.join(__dirname, 'images')) )
app.use('/slides', express.static(path.join(__dirname, 'slides')) )

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization')
    next()
})

app.use(authRouters)
app.use(courseRouters)
app.use(lessonRouters)
app.use(topicRouters)
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500 ).json({message: error.message, data: error.data})
})
mongoose.connect("mongodb+srv://mentalitylearning05:bmZjiZd4Hcbs0JLC@cluster0.e8w4qyf.mongodb.net/mentality-learning?retryWrites=true&w=majority")
.then((result) => {
    app.listen(port)
}).catch((err) => {
    console.log(err)
})