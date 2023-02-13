//imports - buildin
const express = require('express')
const path = require('path')
//imports - 3rdparties
const cors = require('cors')
const morgan = require('morgan')

//imports - custom
const planetsRouter = require('./routes/planets/planets-router')

//App setup
const app = express()  

//Middleware

app.use(cors({
    origin: 'http://localhost:3000',
}))

app.use(morgan('combined'))

app.use(express.json())

app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(planetsRouter)
/* app.use('/',(req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
}) */

module.exports = app