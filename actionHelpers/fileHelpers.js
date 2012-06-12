const fs = require("fs")

// return 1 if dir, 2 is file, 0 not exist or not file or dir
exports.existAndFileOrDir = function(path) {
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

exports.readDir = function(dir) {
  var isDir
    , files
    , type

  console.log('lookup for files in', dir)

  type = this.existAndFileOrDir(dir)

  if(type === 1) {
    files = fs.readdirSync(dir,
      function(err, files) {
        if(err) { throw err }
        return files
      }
    )
    files = this.getFilesStat(files, dir)
    files = this.orderByTypeAndName(files)
  } else {
    files = false
  }

  return files
}

exports.getFilesStat = function(files, dir) {
  var fileStats = []

  for(var i = 0; i < files.length; ++i) {
    var file = files[i]
      , stat = fs.statSync(dir + '/' + file)

    fileStats.push({
        path: file,
        isDir: stat.isDirectory(),
        size: stat.size,
        hSize: this.humanFileSize(stat.size)
    })
  }

  return fileStats
}

exports.orderByTypeAndName = function(filesWithInfo) {
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

exports.humanFileSize = function(size) {
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
