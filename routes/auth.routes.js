const Router = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult, check } = require("express-validator")
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware")
const fileService = require('../services/fileService')
const File = require('../models/File')


router.post("/registration", [
  check("email", "Uncorrect email").isEmail(),
  check("password", "Password must be longer that 6 and shorter that 16").isLength({ min: 6, max: 16 }),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty) {
      return res.status(400).json({ message: "Uncurrent request", errors })
    }
    const { email, password, firstName, lastName } = req.body
    const candidate = await User.findOne({ email })
    if (candidate) {
      return res.status(400).json({ message: `User with email ${email} already exists` })
    }
    const hashPassword = await bcrypt.hash(password, 8)
    const user = new User({ email, password: hashPassword, firstName, lastName })
    await user.save()
    await fileService.createDir(req, new File({ user: user.id, name: '' }))
    return res.status(200).json({ message: "User created successfully" })
  } catch (error) {
    console.log(error);
    res.send({ message: "Server error" });
  }
})

router.post("/login", [
], async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }
    const isPassValid = bcrypt.compareSync(password, user.password)
    if (!isPassValid) {
      return res.status(400).json({ message: "Invalid password" })
    }
    const token = jwt.sign({ id: user.id }, config.get("secretKey"), { expiresIn: "2h" })
    return res.json({
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
        email: user.email,
        diskSpace: user.diskSpace,
        usedSpace: user.usedSpace,
        avatar: user.avatar,
      }
    })
  } catch (error) {
    console.log(error);
    res.send({ message: "Server error" });
  }
})

router.get("/auth", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id })
    const token = jwt.sign({ id: user.id }, config.get("secretKey"), { expiresIn: "2h" })
    return res.json({
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
        email: user.email,
        diskSpace: user.diskSpace,
        usedSpace: user.usedSpace,
        avatar: user.avatar,
      }
    })
  } catch (error) {
    console.log(error);
    res.send({ message: "Server error" });
  }
})

module.exports = router;
