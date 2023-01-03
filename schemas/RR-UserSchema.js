const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: { type: Array, required: true },
  secret: { type: String, required: true },
});

module.exports = mongoose.model('RandomMealsUsers', userSchema);
