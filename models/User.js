const mongoose = require("mongoose");

const User = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, requied: true, unique: true },
  password: { type: String, required: true },
  diskSpace: { type: Number, default: 1024 ** 3 * 10 },
  usedSpace: { type: Number, default: 0 },
  avatar: { type: String },
  files: [{ type: mongoose.Types.ObjectId, ref: 'file' }],
});

module.exports = mongoose.model('User', User)