const url         = require("url")
    , fs          = require("fs")
    , config      = JSON.parse(fs.readFileSync("./config/config.json"))
    , fileHelpers = require('../actionHelpers/fileHelpers.js')

exports.index = function(req, res) {
  var rPath    = decodeURI(url.parse(req.url).pathname)
    , path     = rPath.replace(/^\/root/, '')
    , fullPath = config.rootDir + path
    , check    = fileHelpers.existAndFileOrDir(fullPath)
    , files
    , backLink

  if(check === 1) {
    backLink = rPath.split('/')
    backLink.pop()
    backLink = backLink.join('/')
    if(path == '/') {
      backLink = ''
    } else if(backLink == '/root') {
      backLink = '/root/'
    }

    files = fileHelpers.readDir(fullPath)

    res.render('files', {
        title: path,
        path: path,
        rPath: rPath,
        files: files,
        backLink: backLink
    })
  } else if(check === 2){
    res.download(fullPath)
  } else {
    res.render('404', { title: '404 - ' + path, path: path })
  }
}
