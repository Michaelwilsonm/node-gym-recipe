var http = require('http');
var express = require('express')
var app = express()

var morgan = require('morgan')
var browserify = require('browserify')

var cookieParser = require('cookie-parser')
var session = require('express-session')


app.use(morgan('dev'))
app.use(cookieParser())
app.use(session({secret: 'keyboard cat',
                saveUninitialized: true,
                resave: true}))

app.get('/', function (req, res) {
  res.send('Hello World')
  console.log(req.cookies)
  console.log("=============")
  console.log(req.session)
})

app.listen(3000)

console.log("server running on port " + 3000)