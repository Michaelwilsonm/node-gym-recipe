var http = require('http');
var express = require('express')
var app = express()

var morgan = require('morgan')
var browserify = require('browserify')

app.use(morgan('dev'))

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)

console.log("server running on port :" + 3000)