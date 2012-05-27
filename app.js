// constants

const express = require("express")
    , fs      = require("fs")
    , url     = require("url")
    , config  = JSON.parse(fs.readFileSync("./config/config.json"))

// variables

var app = module.exports = express.createServer()

// functions

var onRequest = function(req, res) {
  var path     = decodeURI(url.parse(req.url).pathname)
    , fullPath = config.rootDir + path
    , check    = existAndFileOrDir(fullPath)
    , files
    , backLink

  if(check === 1) {
    backLink = path.split('/')
    backLink.pop()
    backLink = backLink.join('/')
    if(backLink == '') { backLink = '/' }

    files = readDir(fullPath)

    res.render('files', {
        title: path,
        path: path,
        files: files,
        backLink: backLink
    })
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
    files = getFilesStat(files, dir)
    files = orderByTypeAndName(files)
  } else {
    files = false
  }

  return files
}

var getFilesStat = function(files, dir) {
  var fileStats = []

  for(var i = 0; i < files.length; ++i) {
    var file = files[i]
      , stat = fs.statSync(dir + '/' + file)

    fileStats.push({
        path: file,
        isDir: stat.isDirectory(),
        size: stat.size,
        hSize: humanFileSize(stat.size)
    })
  }

  return fileStats
}

var orderByTypeAndName = function(filesWithInfo) {
  var dirs = []
    , files = []
    , file

  for(var i = 0; i < filesWithInfo.length; ++i) {
    file = filesWithInfo[i]
    if(file.isDir) {
      dirs.push(file)
    } else {
      files.push(file)
    }
  }

  return dirs.concat(files)
}

var humanFileSize = function(size) {
  var unit = 0

  while((size / 1024) > 1) {
    size = size / 1024
    ++unit
  }

  size = Math.round(size * 1000) / 1000

  switch(unit) {
    case 0: unit = ''
    break
    case 1: unit = 'K'
    break
    case 2: unit = 'M'
    break
    case 3: unit = 'G'
    break
  }
  return {size: size, unit: unit}
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
