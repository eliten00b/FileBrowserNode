// constants

const express = require("express")
    , fs      = require("fs")
    , url     = require("url")
    , config  = JSON.parse(fs.readFileSync("./config/config.json"))

// variables

var app = module.exports = express.createServer()

// functions

var onRequest = function(req, res) {
  var path     = url.parse(req.url).pathname
    , fullPath = config.rootDir + path
    , check    = existAndFileOrDir(fullPath)
    , files

  if(check === 1) {
    files = readDir(fullPath)
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.write("Files from dir '" + path + "':\n")
    res.write(files.join('\n'))
    res.end()
  } else {
    res.render('404', { title: '404', path: path })
  }
}

  // return 1 if dir, 2 is file, 0 not exist or not file or dir
var existAndFileOrDir = function(path) {
  var stat

  try {
    stat = fs.statSync(path)

    if(stat.isDirectory()) {
      return 1
    } else if (stat.isFile()) {
      return 2
    }
  } catch(err) {
  }
  return 0
}

var readDir = function(dir) {
  var isDir
    , files
    , type

  console.log('lookup for files in', dir)

  type = existAndFileOrDir(dir)

  if(type === 1) {
    files = fs.readdirSync(dir,
      function(err, files) {
        if(err) { throw err }
        return files
      }
    )
  } else {
    files = false
  }

  return files
}

// configure app

app.configure(function() {
  app.use(express.logger())
  app.use(express.favicon("./favicon.ico"))
  app.use(app.router)
  app.set('view engine', 'jade')
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

app.get('/*', onRequest)

// bind app to port

app.listen(3322)
console.log('Server run...')
