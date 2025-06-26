// constants

const http = require("http")
const express = require("express")
const routes = require("./routes")
const path = require("path")

const favicon = require("serve-favicon")
const logger = require("morgan")
const errorHandler = require("errorhandler")

const fs = require("fs")
const config = JSON.parse(fs.readFileSync("./config/config.json"))

// variables

var app = express()

// configure app

app.set("port", 3322)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use(logger("dev"))
app.use(favicon(path.join(__dirname, "favicon.ico")))
app.use(express.static(path.join(__dirname, "public")))

// configure environments

if (app.get("env") === "development") {
  console.log('Server will run in "development" environment.')
  app.use(errorHandler({ dumpExceptions: true, showStack: true }))
}

if (app.get("env") === "production") {
  console.log('Server will run in "production" environment.')
  app.use(errorHandler())
}

// routes

app.get("/root/*", routes.index)
app.get("/", function(req, res) {
  res.redirect("/root/")
})

// bind app to port

var server = http.createServer(app)
server.listen(app.get('port'), () => {
  console.log("Server run... http://localhost:" +  + app.get('port'))
})
