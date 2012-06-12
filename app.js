// constants

const express = require("express")
    , fs      = require("fs")
    , config  = JSON.parse(fs.readFileSync("./config/config.json"))
    , routes  = require('./routes')

// variables

var app = module.exports = express.createServer()

// configure app

app.configure(function() {
  app.use(express.logger())
  app.use(express.favicon("./favicon.ico"))
  app.use(app.router)
  app.set('view engine', 'jade')
  app.use(express.static(__dirname + '/public'))
})

// configure environments

app.configure('development', function(){
  console.log('Server will run in "development" environment.')
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})

app.configure('production', function(){
  console.log('Server will run in "production" environment.')
  app.use(express.errorHandler())
})

// routes

app.get('/r/*', routes.index)
app.get('/', function(req, res) {
  res.redirect('/r/')
})

// bind app to port

app.listen(3322)
console.log('Server run...')
