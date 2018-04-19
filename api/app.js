const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

// Routers
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

// Express app
var app = express()

// View engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// Middleware
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', indexRouter)
app.use('/users', usersRouter)

// Error handling
// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)))

// Global error handler
app.use((err, req, res, next) => {  
  res.locals.message = err.message
  res.locals.error = err
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app