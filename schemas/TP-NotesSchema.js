const mongoose = require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema({
  noteTitle: { type: String, required: true },
  noteType: { type: String, required: true },
  noteText: { type: String, required: true },
  dueDate: { type: String, required: false },
  status: { type: String, required: false },
  userId: { type: String, required: true },
  createdAt: { type: String, required: true },
});

module.exports = mongoose.model('TaskPlannerNotes2', notesSchema);
