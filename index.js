const express = require("express"); // typescript ругается 
const mongoose = require("mongoose");
const config = require("config");
const fileUpload = require("express-fileupload");

const authRouter = require("./routes/auth.routes")
const fileRouter = require("./routes/file.routes")
const app = express();
const PORT = config.get("serverPort")
const corsMiddleware = require("./middleware/cors.middleware")

app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(express.json())
app.use(express.static('static'))
app.use("/api/auth", authRouter)
app.use("/api/files", fileRouter)


const start = async () => {
  try {
    await mongoose.connect(config.get("dbUrl"))
    app.listen(PORT)
    console.log("Сервер запущен", PORT);
  } catch (error) {
    console.error("Сервер не запустился", error)
  }
}
start()