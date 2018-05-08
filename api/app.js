const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mainRouter = require('./routes/router')

var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '../output')))

app.use('/', mainRouter)

app.use((req, res, next) => next(createError(404)))

app.use((err, req, res, next) => {  
  res.locals.message = err.message
  res.locals.error = err
  res.status(err.status || 500)
  res.error(err.message)
  // res.render('error')
})

module.exports = app