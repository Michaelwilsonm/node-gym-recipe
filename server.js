var http = require('http');
var express = require('express')
var app = express()
var $ = require('jquery')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var morgan = require('morgan')
var browserify = require('browserify')
var mongoose = require('mongoose')
var configDB = require('./config/database.js')
var bodyParser = require('body-parser')
var passport = require('passport')
var flash = require('connect-flash')

mongoose.connect(configDB.url)

require('./config/passport')(passport)

app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({secret: 'keyboard cat',
                saveUninitialized: true,
                resave: true}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.set('view engine', 'ejs')

require('./app/routes.js')(app, passport)

app.listen(3000)

console.log("server running on port " + 3000)