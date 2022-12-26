const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notes: { type: Array, required: true },
  secret: { type: String, required: true },
});

module.exports = mongoose.model('TaskPlannerUsers', userSchema);
