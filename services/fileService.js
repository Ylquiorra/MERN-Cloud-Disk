const fs = require("fs")
const File = require("../models/File")
const config = require("config")

class FileService {

  createDir(file) {
    const filePath = `${config.get("filePath")}\\${file.user}\\${file.path}`
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

  deleteFile(file) {
    const path = this.getPath(file)
    if (file.type === 'dir') {
      fs.rmdirSync(path)
    } else {
      fs.unlinkSync(path)
    }
  }

  getPath(file) {
    return config.get('filePath') + '\\' + file.user + '\\' + file.path
  }
}

module.exports = new FileService()