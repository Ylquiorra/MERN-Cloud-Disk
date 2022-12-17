const fs = require("fs")
const File = require("../models/File")
const config = require("config")

class FileService {

  createDir(req, file) {
    const filePath = this.getPath(req, file)
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true })
          return resolve({ message: "File was created successfully" })
        } else {
          return reject({ message: "File already exists" })
        }
      } catch (error) {
        return reject({ message: error.message })
      }
    })
  }

  deleteFile(req, file) {
    const path = this.getPath(req, file)
    if (file.type === 'dir') {
      fs.rmdirSync(path)
    } else {
      fs.unlinkSync(path)
    }
  }

  getPath(req, file) {
    return req.filePath + '\\' + file.user + '\\' + file.path
  }
}

module.exports = new FileService()