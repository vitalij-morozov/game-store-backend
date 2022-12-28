const notesSchema = require('../schemas/TP-NotesSchema');

const addNote = async (req, res) => {
  try {
    console.log('req.body ===', req.body);
    const newNote = new notesSchema(req.body);
    newNote.save();
    console.log('newNote ===', newNote);
    return res.status(201).json({ error: false, data: { note: newNote, message: 'new note created successfully' } });
  } catch (error) {
    return res.status(400).json({ error: true, message: 'Incorrect data', data: error.details });
  }
};

const getNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await notesSchema.find({ userId: userId });
    return res.json({ error: false, data: { notes } });
  } catch (error) {
    return res.status(400).json({ error: true, message: 'No notes found', data: error.details });
  }
};

const updateNote = async (req, res) => {
  try {
    const { userId, noteId, noteTitle, noteText, status } = req.body;
    const updatedNote = await notesSchema.findOneAndUpdate(
      { userId: userId, _id: noteId },
      { $set: { noteTitle: noteTitle, noteText: noteText, status: status } }
    );
  } catch (error) {
    return res.status(400).json({ error: true, message: 'Failed to update a note', data: error.details });
  }
};

const removeNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const deleteNote = await notesSchema.findOneAndDelete({ _id: noteId });
    res.status(203).json({ error: false, data: { message: 'note deleted successfully' } });
  } catch (error) {
    return res.status(400).json({ error: true, message: 'Failed to delete a note', data: error.details });
  }
};

module.exports = {
  addNote,
  getNotes,
  updateNote,
  removeNote,
};
