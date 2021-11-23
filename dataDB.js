const mongoose = require("mongoose");

const movie = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rated: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  hero_image: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
});

const auth = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const movies_data = mongoose.model("list", movie);
const users = mongoose.model("user", auth);

module.exports = { movies_data, users };
